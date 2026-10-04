import { currentUser, db, json } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// The photo attached to a doubt: /api/doubts/photo?id=12. Only the student who asked and the site owner can see it.
export async function GET(request) {
  const u = await currentUser();
  if (!u) return json({ error: 'Please log in.' }, 401);
  const id = Number(new URL(request.url).searchParams.get('id'));
  if (!Number.isInteger(id) || id < 1) return json({ error: 'Not found.' }, 404);
  const row = await db().prepare('SELECT d.user_id, p.data FROM doubts d JOIN doubt_photos p ON p.doubt_id = d.id WHERE d.id = ?').bind(id).first();
  if (!row || (row.user_id !== u.id && !u.is_admin)) return json({ error: 'Not found.' }, 404);
  return new Response(Uint8Array.from(atob(row.data), c => c.charCodeAt(0)), { headers: { 'content-type': 'image/jpeg', 'cache-control': 'private, no-store', 'x-content-type-options': 'nosniff' } });
}
