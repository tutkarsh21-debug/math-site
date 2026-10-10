import { currentUser, db, json, now } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// The timetable that a visitor or a student may see, for a stretch of time (the week on screen).
//   /api/timetable?scope=live&from=...&to=...   the live classes, for everyone (no student details)
//   /api/timetable?scope=mine&from=...&to=...   for a logged-in student: the live classes of their class and board, and their own 1-to-1 classes.
//                                               For the owner: every class, with the student's name on 1-to-1 classes.
// from and to are unix seconds. Without them: from half an hour ago for 60 days. A range is at most 62 days.
// Cancelled classes are included, marked, so that students can see that a class will not happen.
export async function GET(request) {
  const q = new URL(request.url).searchParams, scope = q.get('scope');
  const t = now();
  let from = Number(q.get('from')) || t - 1800, to = Number(q.get('to')) || from + 60 * 86400;
  to = Math.min(to, from + 62 * 86400);
  const COLS = 't.id, t.kind, t.title, t.cls, t.board, t.starts_at, t.minutes, t.link, t.notes, t.status, t.reason, t.moved';
  if (scope !== 'mine') {
    const { results } = await db().prepare(`SELECT ${COLS} FROM timetable t WHERE t.kind = 'live' AND t.starts_at < ? AND t.starts_at + t.minutes * 60 > ? ORDER BY t.starts_at LIMIT 300`).bind(to, from).all();
    return json({ now: t, from, to, items: results });
  }
  const u = await currentUser();
  if (!u) return json({ error: 'Please log in.' }, 401);
  if (u.is_admin) {
    const { results } = await db().prepare(`SELECT ${COLS}, t.student_id, u.name AS student FROM timetable t LEFT JOIN users u ON u.id = t.student_id WHERE t.starts_at < ? AND t.starts_at + t.minutes * 60 > ? ORDER BY t.starts_at LIMIT 300`).bind(to, from).all();
    return json({ now: t, from, to, items: results, owner: true });
  }
  const { results } = await db().prepare(`SELECT ${COLS} FROM timetable t
    WHERE t.starts_at < ? AND t.starts_at + t.minutes * 60 > ?
      AND ((t.kind = 'live' AND (t.cls = '' OR t.cls = ?) AND (t.board = '' OR t.board = ?)) OR (t.kind = 'one' AND t.student_id = ?))
    ORDER BY t.starts_at LIMIT 300`).bind(to, from, u.cls, u.board, u.id).all();
  return json({ now: t, from, to, items: results });
}
