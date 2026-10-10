import { CLASSES, BOARDS } from '@/lib/data';
import { adminGate, db, json, now, randomHex, sameOrigin } from '@/lib/auth';
import { videoId } from '@/lib/studio';

export const dynamic = 'force-dynamic';
const WEEK = 7 * 86400;

// The owner's timetable manager.
// GET ?from=&to=: the classes of that stretch of time (the week on screen), cancelled ones too, and the students (to choose who a 1-to-1 class is for).
export async function GET(request) {
  const stop = await adminGate();
  if (stop) return stop;
  const q = new URL(request.url).searchParams, from = Number(q.get('from')) || now() - 7 * 86400;
  const to = Math.min(Number(q.get('to')) || from + 60 * 86400, from + 62 * 86400);
  const { results } = await db().prepare('SELECT t.id, t.kind, t.title, t.cls, t.board, t.student_id, t.starts_at, t.minutes, t.link, t.notes, t.series, t.status, t.reason, t.moved, u.name AS student FROM timetable t LEFT JOIN users u ON u.id = t.student_id WHERE t.starts_at < ? AND t.starts_at + t.minutes * 60 > ? ORDER BY t.starts_at LIMIT 300').bind(to, from).all();
  const students = await db().prepare('SELECT id, name, mobile, cls, board FROM users WHERE is_admin = 0 AND is_teacher = 0 ORDER BY name LIMIT 1000').all();
  return json({ now: now(), from, to, items: results, students: students.results });
}

// Checks the link of a class. Live: a YouTube video (kept as its id). 1-to-1: an https meeting link. Returns { link } or { error }.
function cleanLink(kind, raw) {
  const s = typeof raw === 'string' ? raw.trim() : '';
  if (!s) return { link: '' };
  if (kind === 'live') { const v = videoId(s); return v ? { link: v } : { error: 'That is not a YouTube video link. Leave it empty to show the channel\'s live stream.' }; }
  return /^https:\/\/[^\s]{4,300}$/.test(s) ? { link: s } : { error: 'A meeting link must start with https://' };
}
const okTime = t => Number.isInteger(t) && t > now() - 400 * 86400 && t < now() + 400 * 86400;

// POST: { kind: 'live' | 'one', title, cls, board, studentId, startsAt (unix seconds), minutes, link, notes, repeat }
// repeat: how many weeks the class is held (1 to 26). The same weekday and time every week; each week can then be changed or cancelled on its own.
export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const stop = await adminGate();
  if (stop) return stop;
  const b = await request.json().catch(() => ({}));
  const kind = b.kind === 'one' ? 'one' : b.kind === 'live' ? 'live' : '';
  const title = typeof b.title === 'string' ? b.title.trim() : '';
  const startsAt = b.startsAt, minutes = Number.isInteger(b.minutes) ? b.minutes : 0;
  const repeat = b.repeat === undefined ? 1 : b.repeat;
  const notes = typeof b.notes === 'string' ? b.notes.trim().slice(0, 500) : '';
  if (!kind) return json({ error: 'Choose live class or 1-to-1 class.' }, 400);
  if (title.length < 3 || title.length > 100) return json({ error: 'Please give the class a name of 3 to 100 characters.' }, 400);
  if (!Number.isInteger(startsAt) || startsAt < now() - 86400 || startsAt > now() + 400 * 86400) return json({ error: 'Please choose a date and time within the coming year.' }, 400);
  if (minutes < 10 || minutes > 360) return json({ error: 'The class length must be between 10 and 360 minutes.' }, 400);
  if (!Number.isInteger(repeat) || repeat < 1 || repeat > 26) return json({ error: 'A class can repeat for 1 to 26 weeks.' }, 400);
  let cls = '', board = '', studentId = 0;
  if (kind === 'live') {
    cls = typeof b.cls === 'string' ? b.cls : ''; board = typeof b.board === 'string' ? b.board : '';
    if (cls && !CLASSES[cls]) return json({ error: 'Please choose a class from the list.' }, 400);
    if (board && !BOARDS.includes(board)) return json({ error: 'Please choose a board from the list.' }, 400);
  } else {
    studentId = Number.isInteger(b.studentId) ? b.studentId : 0;
    const s = studentId ? await db().prepare('SELECT id, cls, board FROM users WHERE id = ? AND is_admin = 0').bind(studentId).first() : null;
    if (!s) return json({ error: 'Please choose the student for this 1-to-1 class.' }, 400);
    cls = s.cls; board = s.board;
  }
  const lk = cleanLink(kind, b.link);
  if (lk.error) return json({ error: lk.error }, 400);
  // A YouTube link belongs to one stream, so it is kept only on the first class of a repeating live class.
  const series = repeat > 1 ? randomHex(6) : '', t = now(), d = db();
  const steps = Array.from({ length: repeat }, (_, i) => d.prepare('INSERT INTO timetable (kind, title, cls, board, student_id, starts_at, minutes, link, notes, room, created_at, series) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(kind, title, cls, board, studentId, startsAt + i * WEEK, minutes, kind === 'live' && i > 0 ? '' : lk.link, notes, kind === 'one' ? `mathsetu-${randomHex(10)}` : '', t, series));
  await d.batch(steps);
  return json({ ok: true, added: repeat });
}

// PATCH: change a class, or cancel / restore it.
// { id, scope: 'one' | 'following', title?, startsAt?, minutes?, notes?, link?, cancel?: true | false, reason? }
// scope 'following' applies the change to this class and every later class of the same weekly series (a new time moves them all by the same amount).
export async function PATCH(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const stop = await adminGate();
  if (stop) return stop;
  const b = await request.json().catch(() => ({}));
  const row = Number.isInteger(b.id) ? await db().prepare('SELECT id, kind, starts_at, series FROM timetable WHERE id = ?').bind(b.id).first() : null;
  if (!row) return json({ error: 'Class not found.' }, 404);
  const sets = [], vals = [];
  if (b.title !== undefined) {
    const v = typeof b.title === 'string' ? b.title.trim() : '';
    if (v.length < 3 || v.length > 100) return json({ error: 'Please give the class a name of 3 to 100 characters.' }, 400);
    sets.push('title = ?'); vals.push(v);
  }
  if (b.minutes !== undefined) {
    if (!Number.isInteger(b.minutes) || b.minutes < 10 || b.minutes > 360) return json({ error: 'The class length must be between 10 and 360 minutes.' }, 400);
    sets.push('minutes = ?'); vals.push(b.minutes);
  }
  if (b.notes !== undefined) { sets.push('notes = ?'); vals.push(typeof b.notes === 'string' ? b.notes.trim().slice(0, 500) : ''); }
  if (b.link !== undefined) {
    const lk = cleanLink(row.kind, b.link);
    if (lk.error) return json({ error: lk.error }, 400);
    sets.push('link = ?'); vals.push(lk.link);
  }
  if (b.startsAt !== undefined) {
    if (!okTime(b.startsAt)) return json({ error: 'Please choose a date and time within the coming year.' }, 400);
    const delta = b.startsAt - row.starts_at;
    if (delta) { sets.push('starts_at = starts_at + ?', 'moved = 1'); vals.push(delta); }
  }
  if (b.cancel === true) { sets.push("status = 'cancelled'", 'reason = ?'); vals.push(typeof b.reason === 'string' ? b.reason.trim().slice(0, 200) : ''); }
  if (b.cancel === false) sets.push("status = ''", "reason = ''");
  if (!sets.length) return json({ error: 'Nothing to change.' }, 400);
  const following = b.scope === 'following' && row.series;
  const { meta } = await db().prepare(`UPDATE timetable SET ${sets.join(', ')} WHERE ${following ? 'series = ? AND starts_at >= ?' : 'id = ?'}`).bind(...vals, ...(following ? [row.series, row.starts_at] : [row.id])).run();
  return json({ ok: true, changed: meta.changes });
}

// DELETE: { id, scope: 'one' | 'following' }
export async function DELETE(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const stop = await adminGate();
  if (stop) return stop;
  const { id, scope } = await request.json().catch(() => ({}));
  const row = Number.isInteger(id) ? await db().prepare('SELECT id, series, starts_at FROM timetable WHERE id = ?').bind(id).first() : null;
  if (!row) return json({ error: 'Class not found.' }, 404);
  if (scope === 'following' && row.series) await db().prepare('DELETE FROM timetable WHERE series = ? AND starts_at >= ?').bind(row.series, row.starts_at).run();
  else await db().prepare('DELETE FROM timetable WHERE id = ?').bind(id).run();
  return json({ ok: true });
}
