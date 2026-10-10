import { currentUser, db, json, now } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// The timetable that a visitor or a student may see.
//   /api/timetable?scope=live   the coming live classes, for everyone (no student details)
//   /api/timetable?scope=mine   for a logged-in student: the live classes of their class and board, and their own 1-to-1 classes.
//                               For the owner: every coming class, with the student's name on 1-to-1 classes.
// Classes that ended more than half an hour ago are left out.
export async function GET(request) {
  const scope = new URL(request.url).searchParams.get('scope');
  const t = now(), from = t - 1800;
  const COLS = 'id, kind, title, cls, board, starts_at, minutes, link, notes';
  if (scope !== 'mine') {
    const { results } = await db().prepare(`SELECT ${COLS} FROM timetable WHERE kind = 'live' AND starts_at + minutes * 60 > ? ORDER BY starts_at LIMIT 60`).bind(from).all();
    return json({ now: t, items: results.map(r => ({ ...r, link: r.link })) });
  }
  const u = await currentUser();
  if (!u) return json({ error: 'Please log in.' }, 401);
  if (u.is_admin) {
    const { results } = await db().prepare(`SELECT t.${COLS.split(', ').join(', t.')}, t.student_id, u.name AS student FROM timetable t LEFT JOIN users u ON u.id = t.student_id WHERE t.starts_at + t.minutes * 60 > ? ORDER BY t.starts_at LIMIT 200`).bind(from).all();
    return json({ now: t, items: results, owner: true });
  }
  const { results } = await db().prepare(`SELECT ${COLS} FROM timetable
    WHERE starts_at + minutes * 60 > ? AND ((kind = 'live' AND (cls = '' OR cls = ?) AND (board = '' OR board = ?)) OR (kind = 'one' AND student_id = ?))
    ORDER BY starts_at LIMIT 100`).bind(from, u.cls, u.board, u.id).all();
  // The meeting link of a 1-to-1 class belongs to that student only; a live class has none to show.
  return json({ now: t, items: results.map(r => (r.kind === 'one' ? r : { ...r })) });
}
