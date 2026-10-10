import { CLASSES, BOARDS } from '@/lib/data';
import { adminGate, db, json, now, randomHex, sameOrigin } from '@/lib/auth';
import { videoId } from '@/lib/studio';

export const dynamic = 'force-dynamic';

// The owner's timetable manager.
// GET: every class from a week ago on, and the students (for choosing who a 1-to-1 class is for).
export async function GET() {
  const stop = await adminGate();
  if (stop) return stop;
  const { results } = await db().prepare('SELECT t.id, t.kind, t.title, t.cls, t.board, t.student_id, t.starts_at, t.minutes, t.link, t.notes, u.name AS student FROM timetable t LEFT JOIN users u ON u.id = t.student_id WHERE t.starts_at > ? ORDER BY t.starts_at LIMIT 300').bind(now() - 7 * 86400).all();
  const students = await db().prepare('SELECT id, name, mobile, cls, board FROM users WHERE is_admin = 0 AND is_teacher = 0 ORDER BY name LIMIT 1000').all();
  return json({ items: results, students: students.results });
}

// POST: { kind: 'live' | 'one', title, cls, board, studentId, startsAt (unix seconds), minutes, link, notes }
export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const stop = await adminGate();
  if (stop) return stop;
  const b = await request.json().catch(() => ({}));
  const kind = b.kind === 'one' ? 'one' : b.kind === 'live' ? 'live' : '';
  const title = typeof b.title === 'string' ? b.title.trim() : '';
  const startsAt = Number.isInteger(b.startsAt) ? b.startsAt : 0, minutes = Number.isInteger(b.minutes) ? b.minutes : 0;
  const notes = typeof b.notes === 'string' ? b.notes.trim().slice(0, 500) : '';
  if (!kind) return json({ error: 'Choose live class or 1-to-1 class.' }, 400);
  if (title.length < 3 || title.length > 100) return json({ error: 'Please give the class a name of 3 to 100 characters.' }, 400);
  if (startsAt < now() - 86400 || startsAt > now() + 400 * 86400) return json({ error: 'Please choose a date and time within the coming year.' }, 400);
  if (minutes < 10 || minutes > 360) return json({ error: 'The class length must be between 10 and 360 minutes.' }, 400);
  let cls = '', board = '', studentId = 0, link = '', room = '';
  if (kind === 'live') {
    cls = typeof b.cls === 'string' ? b.cls : ''; board = typeof b.board === 'string' ? b.board : '';
    if (cls && !CLASSES[cls]) return json({ error: 'Please choose a class from the list.' }, 400);
    if (board && !BOARDS.includes(board)) return json({ error: 'Please choose a board from the list.' }, 400);
    const raw = typeof b.link === 'string' ? b.link.trim() : '';
    link = raw ? videoId(raw) : '';
    if (raw && !link) return json({ error: 'That is not a YouTube video link. Leave it empty to show the channel\'s live stream.' }, 400);
  } else {
    studentId = Number.isInteger(b.studentId) ? b.studentId : 0;
    const s = studentId ? await db().prepare('SELECT id, cls, board FROM users WHERE id = ? AND is_admin = 0').bind(studentId).first() : null;
    if (!s) return json({ error: 'Please choose the student for this 1-to-1 class.' }, 400);
    cls = s.cls; board = s.board;
    const raw = typeof b.link === 'string' ? b.link.trim() : '';
    if (raw && !/^https:\/\/[^\s]{4,300}$/.test(raw)) return json({ error: 'A meeting link must start with https://' }, 400);
    link = raw;
    room = `mathsetu-${randomHex(10)}`;
  }
  await db().prepare('INSERT INTO timetable (kind, title, cls, board, student_id, starts_at, minutes, link, notes, room, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(kind, title, cls, board, studentId, startsAt, minutes, link, notes, room, now()).run();
  return json({ ok: true });
}

// DELETE: { id }
export async function DELETE(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const stop = await adminGate();
  if (stop) return stop;
  const { id } = await request.json().catch(() => ({}));
  if (!Number.isInteger(id)) return json({ error: 'Nothing to delete.' }, 400);
  await db().prepare('DELETE FROM timetable WHERE id = ?').bind(id).run();
  return json({ ok: true });
}
