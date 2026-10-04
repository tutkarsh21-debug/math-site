import { currentUser, db, json, now, sameOrigin } from '@/lib/auth';
import { BOARDS, CLASSES } from '@/lib/data';

export const dynamic = 'force-dynamic';
// Limits against misuse of the open form: per mobile number in a day, and for the whole site in an hour.
const PER_MOBILE = 3, PER_HOUR = 60;

// Anyone can send an enquiry; no account is needed.
export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const body = await request.json().catch(() => ({}));
  // "website" is a hidden field that people never see. Only automated form-fillers complete it.
  if (body.website) return json({ ok: true });
  const { mobile, cls, board } = body;
  const name = typeof body.name === 'string' ? body.name.trim() : '', message = typeof body.message === 'string' ? body.message.trim() : '';
  if (name.length < 2 || name.length > 60) return json({ error: 'Please enter the student\'s name.' }, 400);
  if (!/^[6-9]\d{9}$/.test(mobile || '')) return json({ error: 'Please enter a 10-digit mobile number.' }, 400);
  if (!CLASSES[cls]) return json({ error: 'Please choose the class.' }, 400);
  if (!BOARDS.includes(board)) return json({ error: 'Please choose the board.' }, 400);
  if (message.length > 500) return json({ error: 'Please keep the message under 500 characters.' }, 400);
  const t = now();
  const { m, h } = await db().prepare('SELECT (SELECT COUNT(*) FROM enquiries WHERE mobile = ? AND created_at > ?) AS m, (SELECT COUNT(*) FROM enquiries WHERE created_at > ?) AS h')
    .bind(mobile, t - 86400, t - 3600).first();
  if (m >= PER_MOBILE) return json({ error: 'We already have your enquiry and will get back to you soon.' }, 429);
  if (h >= PER_HOUR) return json({ error: 'The form is busy right now. Please try again in an hour, or message us on Telegram.' }, 429);
  await db().prepare('INSERT INTO enquiries (name, mobile, cls, board, message, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(name, mobile, cls, board, message, t).run();
  return json({ ok: true });
}

// The list of enquiries, newest first. Only for accounts marked as admin (users.is_admin = 1).
export async function GET() {
  const u = await currentUser();
  if (!u) return json({ error: 'Please log in.' }, 401);
  if (!u.is_admin) return json({ error: 'Not allowed.' }, 403);
  const { results } = await db().prepare('SELECT id, name, mobile, cls, board, message, created_at FROM enquiries ORDER BY created_at DESC LIMIT 500').all();
  return json({ enquiries: results });
}
