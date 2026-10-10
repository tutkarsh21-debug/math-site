import { currentUser, db, json, now } from '@/lib/auth';
import { EARLY, JITSI_DOMAIN, LATE, roomOpen } from '@/lib/studio';

export const dynamic = 'force-dynamic';

// The video room of one 1-to-1 class: /api/studio/room?id=12
// Only the student the class is for may enter, from 15 minutes before it starts until half an hour after it ends. The owner may enter at any time.
// The room's name is secret: it is given only here.
export async function GET(request) {
  const u = await currentUser();
  if (!u) return json({ error: 'Please log in.' }, 401);
  const id = Number(new URL(request.url).searchParams.get('id'));
  const row = Number.isInteger(id) && id > 0 ? await db().prepare("SELECT id, title, starts_at, minutes, room, link, student_id FROM timetable WHERE id = ? AND kind = 'one'").bind(id).first() : null;
  if (!row || !row.room || (!u.is_admin && row.student_id !== u.id)) return json({ error: 'Class not found.' }, 404);
  const t = now();
  if (!u.is_admin && !roomOpen(row, t)) {
    const early = row.starts_at - EARLY - t;
    return json({ error: early > 0 ? 'The room opens 15 minutes before the class.' : `This class ended more than ${LATE / 60} minutes ago.`, opensAt: row.starts_at - EARLY }, 403);
  }
  return json({ domain: JITSI_DOMAIN, room: row.room, title: row.title, name: u.name, owner: !!u.is_admin, link: row.link || '' });
}
