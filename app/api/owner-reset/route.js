import { getCloudflareContext } from '@opennextjs/cloudflare';
import { db, json, now, same, sameOrigin, setPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';
// The owner can set a new password without logging in by giving a secret code. The code is NOT in this repository: it is a Worker
// secret named OWNER_RESET_CODE that only the owner sets in the Cloudflare dashboard. If it is not set, or is shorter than
// MIN_CODE characters, this route does nothing at all.
const MIN_CODE = 16, MAX_FAILS = 5, WINDOW = 3600;
const enc = new TextEncoder();
const sha = async s => [...new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(s)))].map(b => b.toString(16).padStart(2, '0')).join('');
const WRONG = 'The mobile number or the secret code is not right.';

export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const secret = getCloudflareContext().env.OWNER_RESET_CODE;
  if (typeof secret !== 'string' || secret.length < MIN_CODE) return json({ error: 'Not available.' }, 404);
  const { mobile, code, password } = await request.json().catch(() => ({}));
  if (typeof password !== 'string' || password.length < 8 || password.length > 72) return json({ error: 'The new password must have at least 8 characters.' }, 400);
  if (!/^[6-9]\d{9}$/.test(mobile || '') || typeof code !== 'string' || code.length > 200) return json({ error: WRONG }, 401);
  const t = now();
  const { n } = await db().prepare('SELECT COUNT(*) AS n FROM owner_reset_fails WHERE created_at > ?').bind(t - WINDOW).first();
  if (n >= MAX_FAILS) return json({ error: 'Too many wrong tries. Please try again after an hour.' }, 429);
  // Both are hashed first, so the comparison takes the same time whatever is typed.
  const ok = same(await sha(code.trim()), await sha(secret.trim()));
  const u = ok ? await db().prepare('SELECT id FROM users WHERE mobile = ? AND is_admin = 1').bind(mobile).first() : null;
  if (!u) {
    await db().prepare('INSERT INTO owner_reset_fails (created_at) VALUES (?)').bind(t).run();
    return json({ error: WRONG }, 401);
  }
  await setPassword(u.id, password);
  await db().prepare('DELETE FROM owner_reset_fails').run();
  return json({ ok: true });
}
