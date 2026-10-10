import { adminGate, db, json, sameOrigin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// The owner's list of teacher accounts.
export async function GET() {
  const stop = await adminGate();
  if (stop) return stop;
  const { results } = await db().prepare('SELECT id, name, mobile, created_at FROM users WHERE is_teacher = 1 ORDER BY name').all();
  const requests = await db().prepare('SELECT id, name, mobile, created_at FROM users WHERE teacher_request = 1 AND is_teacher = 0 ORDER BY created_at').all();
  return json({ teachers: results, requests: requests.results });
}

// { mobile, teacher: true } makes an existing account a teacher (this also approves a request); { mobile, teacher: false } takes it back.
// { mobile, decline: true } turns down a teacher request: the account stays an ordinary student account.
// The teacher registers on /login like anyone else, and the owner then adds the mobile number here.
export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const stop = await adminGate();
  if (stop) return stop;
  const { mobile, teacher, decline } = await request.json().catch(() => ({}));
  if (!/^[6-9]\d{9}$/.test(mobile || '') || (typeof teacher !== 'boolean' && decline !== true)) return json({ error: 'Please enter a 10-digit mobile number.' }, 400);
  const u = await db().prepare('SELECT id, is_admin FROM users WHERE mobile = ?').bind(mobile).first();
  if (!u) return json({ error: 'There is no account with this number. Ask the teacher to register on the Login page first.' }, 404);
  if (u.is_admin) return json({ error: 'This is the owner account. It can already do everything a teacher can.' }, 400);
  if (decline === true) await db().prepare('UPDATE users SET teacher_request = 0 WHERE id = ?').bind(u.id).run();
  else await db().prepare('UPDATE users SET is_teacher = ?, teacher_request = 0 WHERE id = ?').bind(teacher ? 1 : 0, u.id).run();
  return json({ ok: true });
}
