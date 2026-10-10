import { currentUser, db, json, now, sameOrigin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// "Doubt resolved" notifications for the logged-in student: answered doubts the student has not looked at yet.
export async function GET() {
  const u = await currentUser();
  if (!u) return json({ count: 0, items: [] });
  const { results } = await db().prepare('SELECT id, chapter, answered_at FROM doubts WHERE user_id = ? AND answered_at > 0 AND seen_at = 0 ORDER BY answered_at DESC LIMIT 20').bind(u.id).all();
  return json({ count: results.length, items: results });
}

// The student has seen them: { all: true } or { id }.
export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const u = await currentUser();
  if (!u) return json({ error: 'Please log in.' }, 401);
  const { id, all } = await request.json().catch(() => ({}));
  if (all) await db().prepare('UPDATE doubts SET seen_at = ? WHERE user_id = ? AND answered_at > 0 AND seen_at = 0').bind(now(), u.id).run();
  else if (Number.isInteger(id)) await db().prepare('UPDATE doubts SET seen_at = ? WHERE id = ? AND user_id = ? AND answered_at > 0 AND seen_at = 0').bind(now(), id, u.id).run();
  else return json({ error: 'Nothing to mark.' }, 400);
  return json({ ok: true });
}
