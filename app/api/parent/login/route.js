import { PARENT_LOGIN } from '@/lib/data';
import { db, json, now, parentCodeHash, same, sameOrigin, startParentSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
const WRONG = 'Wrong mobile number or parent code.', MAX_FAILS = 5, LOCK_MINUTES = 15;

// A parent opens the dashboard with the student's mobile number and the parent code the student made.
export async function POST(request) {
  if (!PARENT_LOGIN) return json({ error: 'Not found.' }, 404);   // parent login is switched off: see lib/data.js
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const { mobile, code } = await request.json().catch(() => ({}));
  if (!/^[6-9]\d{9}$/.test(mobile || '') || typeof code !== 'string' || code.length > 20) return json({ error: WRONG }, 401);
  const hash = await parentCodeHash(code);
  const u = await db().prepare('SELECT id, parent_code_hash, parent_fails, parent_locked_until FROM users WHERE mobile = ?').bind(mobile).first();
  // An unknown number, or a student with no code made, gets the very same answer, so nobody can find out who has an account.
  if (!u || !u.parent_code_hash) return json({ error: WRONG }, 401);
  if (u.parent_locked_until > now()) return json({ error: `Too many wrong codes. Try again after ${LOCK_MINUTES} minutes.` }, 429);
  if (!same(hash, u.parent_code_hash)) {
    const fails = u.parent_fails + 1, lock = fails >= MAX_FAILS;
    await db().prepare('UPDATE users SET parent_fails = ?, parent_locked_until = ? WHERE id = ?').bind(lock ? 0 : fails, lock ? now() + LOCK_MINUTES * 60 : 0, u.id).run();
    return json({ error: WRONG }, 401);
  }
  if (u.parent_fails) await db().prepare('UPDATE users SET parent_fails = 0 WHERE id = ?').bind(u.id).run();
  await startParentSession(u.id);
  return json({ ok: true });
}
