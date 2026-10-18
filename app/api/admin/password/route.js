import { adminGate, db, json, newTempPassword, now, sameOrigin, setPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// The students who asked for a password reset and are still waiting, oldest first.
export async function GET() {
  const stop = await adminGate();
  if (stop) return stop;
  const { results } = await db().prepare('SELECT r.id, r.created_at, u.id AS user_id, u.name, u.mobile, u.cls, u.board FROM password_requests r JOIN users u ON u.id = r.user_id WHERE r.done_at = 0 ORDER BY r.created_at LIMIT 100').all();
  return json({ requests: results });
}

// Sets a temporary password for one student. The password is shown once, here, and is not stored anywhere in readable form.
export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const stop = await adminGate();
  if (stop) return stop;
  const { id } = await request.json().catch(() => ({}));
  if (!Number.isInteger(id) || id < 1) return json({ error: 'Invalid student.' }, 400);
  const u = await db().prepare('SELECT id, name, mobile FROM users WHERE id = ?').bind(id).first();
  if (!u) return json({ error: 'Not found.' }, 404);
  const password = newTempPassword();
  await setPassword(u.id, password);
  await db().prepare('UPDATE password_requests SET done_at = ? WHERE user_id = ? AND done_at = 0').bind(now(), u.id).run();
  return json({ name: u.name, mobile: u.mobile, password });
}
