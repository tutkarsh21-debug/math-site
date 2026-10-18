import { db, json, now, sameOrigin } from '@/lib/auth';

export const dynamic = 'force-dynamic';
// Limits against misuse of the open form: per student in a day, and for the whole site in an hour.
const PER_USER = 3, PER_HOUR = 40;
// The same reply for a number that is registered and one that is not, so nobody can use this form to find out who has an account.
const REPLY = { ok: true };

export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const body = await request.json().catch(() => ({}));
  if (body.website) return json(REPLY);   // a hidden field that only form-filling programs complete
  if (!/^[6-9]\d{9}$/.test(body.mobile || '')) return json({ error: 'Please enter your 10-digit mobile number.' }, 400);
  const u = await db().prepare('SELECT id FROM users WHERE mobile = ?').bind(body.mobile).first();
  if (!u) return json(REPLY);
  const t = now();
  const { d, p, h } = await db().prepare('SELECT (SELECT COUNT(*) FROM password_requests WHERE user_id = ? AND created_at > ?) AS d, (SELECT COUNT(*) FROM password_requests WHERE user_id = ? AND done_at = 0) AS p, (SELECT COUNT(*) FROM password_requests WHERE created_at > ?) AS h')
    .bind(u.id, t - 86400, u.id, t - 3600).first();
  if (p === 0 && d < PER_USER && h < PER_HOUR) await db().prepare('INSERT INTO password_requests (user_id, created_at) VALUES (?, ?)').bind(u.id, t).run();
  return json(REPLY);
}
