import { db, hashPassword, json, now, same, sameOrigin, startSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
const WRONG = 'Wrong mobile number or password.', MAX_FAILS = 5, LOCK_MINUTES = 15;

export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const { mobile, password } = await request.json().catch(() => ({}));
  if (!/^[6-9]\d{9}$/.test(mobile || '') || typeof password !== 'string' || password.length > 72) return json({ error: WRONG }, 401);
  const u = await db().prepare('SELECT id, name, mobile, cls, board, pass_hash, salt, fails, locked_until FROM users WHERE mobile = ?').bind(mobile).first();
  // An unknown number still costs one hash, so the reply takes the same time either way.
  if (!u) { await hashPassword(password, '00'.repeat(16)); return json({ error: WRONG }, 401); }
  if (u.locked_until > now()) return json({ error: `Too many wrong attempts. Try again after ${LOCK_MINUTES} minutes.` }, 429);
  if (!same(await hashPassword(password, u.salt), u.pass_hash)) {
    const fails = u.fails + 1, lock = fails >= MAX_FAILS;
    await db().prepare('UPDATE users SET fails = ?, locked_until = ? WHERE id = ?').bind(lock ? 0 : fails, lock ? now() + LOCK_MINUTES * 60 : 0, u.id).run();
    return json({ error: WRONG }, 401);
  }
  if (u.fails) await db().prepare('UPDATE users SET fails = 0 WHERE id = ?').bind(u.id).run();
  await startSession(u.id);
  return json({ user: { name: u.name, mobile: u.mobile, cls: u.cls, board: u.board } });
}
