import { checkSignup, db, hashPassword, json, now, randomHex, sameOrigin, startSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const body = await request.json().catch(() => ({}));
  const asTeacher = body.role === 'teacher';
  // A teacher gives only a name, a mobile number and a password. The class and board are placeholders, and the account
  // has no teacher powers until the owner approves it at /admin/teachers.
  const data = asTeacher ? { ...body, cls: 'class-10', board: 'CBSE' } : body;
  const error = checkSignup(data);
  if (error) return json({ error }, 400);
  const { mobile, cls, board, password } = data, name = data.name.trim();
  if (await db().prepare('SELECT 1 FROM users WHERE mobile = ?').bind(mobile).first())
    return json({ error: 'This mobile number is already registered. Please log in.' }, 409);
  const salt = randomHex(16);
  const { meta } = await db().prepare('INSERT INTO users (name, mobile, cls, board, pass_hash, salt, created_at, teacher_request) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(name, mobile, cls, board, await hashPassword(password, salt), salt, now(), asTeacher ? 1 : 0).run();
  await startSession(meta.last_row_id);
  return json({ user: { name, mobile, cls, board } });
}
