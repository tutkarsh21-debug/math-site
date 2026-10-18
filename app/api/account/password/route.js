import { currentUser, db, hashPassword, json, now, same, sameOrigin, setPassword, startSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
const MAX_FAILS = 5, LOCK_MINUTES = 15;

// A logged-in student changes the password. The old password must be right, and every other login is ended.
export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const me = await currentUser();
  if (!me) return json({ error: 'Please log in.' }, 401);
  const { current, next } = await request.json().catch(() => ({}));
  if (typeof current !== 'string' || current.length > 72) return json({ error: 'The current password is not right.' }, 400);
  if (typeof next !== 'string' || next.length < 8 || next.length > 72) return json({ error: 'The new password must have at least 8 characters.' }, 400);
  const u = await db().prepare('SELECT id, pass_hash, salt, fails, locked_until FROM users WHERE id = ?').bind(me.id).first();
  if (u.locked_until > now()) return json({ error: `Too many wrong attempts. Try again after ${LOCK_MINUTES} minutes.` }, 429);
  if (!same(await hashPassword(current, u.salt), u.pass_hash)) {
    const fails = u.fails + 1, lock = fails >= MAX_FAILS;
    await db().prepare('UPDATE users SET fails = ?, locked_until = ? WHERE id = ?').bind(lock ? 0 : fails, lock ? now() + LOCK_MINUTES * 60 : 0, u.id).run();
    return json({ error: 'The current password is not right.' }, 400);
  }
  await setPassword(u.id, next);
  await startSession(u.id);
  return json({ ok: true });
}
