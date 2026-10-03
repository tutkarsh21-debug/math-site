import { currentUser, db, json, now, sameOrigin } from '@/lib/auth';
import TESTS from '@/lib/tests.json';

export const dynamic = 'force-dynamic';

// The saved test scores of the logged-in student, newest first.
export async function GET() {
  const u = await currentUser();
  if (!u) return json({ error: 'Please log in.' }, 401);
  const { results } = await db().prepare('SELECT test, score, total, taken_at FROM results WHERE user_id = ? ORDER BY taken_at DESC LIMIT 200').bind(u.id).all();
  return json({ results });
}

export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const u = await currentUser();
  if (!u) return json({ error: 'Please log in.' }, 401);
  const { test, score } = await request.json().catch(() => ({}));
  const t = TESTS[test];
  if (!t || !Number.isInteger(score) || score < 0 || score > t.qs.length) return json({ error: 'Invalid result.' }, 400);
  await db().prepare('INSERT INTO results (user_id, test, score, total, taken_at) VALUES (?, ?, ?, ?, ?)').bind(u.id, test, score, t.qs.length, now()).run();
  return json({ ok: true });
}
