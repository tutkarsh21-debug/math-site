import { checkSignup, db, hashPassword, json, now, randomHex, sameOrigin, startSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const body = await request.json().catch(() => ({}));
  const error = checkSignup(body);
  if (error) return json({ error }, 400);
  const { mobile, cls, board, password } = body, name = body.name.trim();
  if (await db().prepare('SELECT 1 FROM users WHERE mobile = ?').bind(mobile).first())
    return json({ error: 'This mobile number is already registered. Please log in.' }, 409);
  const salt = randomHex(16);
  const { meta } = await db().prepare('INSERT INTO users (name, mobile, cls, board, pass_hash, salt, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(name, mobile, cls, board, await hashPassword(password, salt), salt, now()).run();
  await startSession(meta.last_row_id);
  return json({ user: { name, mobile, cls, board } });
}
