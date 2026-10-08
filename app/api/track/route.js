import { currentUser, db, json, now, sameOrigin } from '@/lib/auth';

export const dynamic = 'force-dynamic';
const KINDS = ['view', 'pdf'], TARGET = /^\/[A-Za-z0-9_\-/.]{0,120}$/, PER_MINUTE = 40;

// Records that a logged-in student opened a page or a PDF: { kind: 'view' | 'pdf', target: '/class-10/real-numbers' }.
// Visitors who are not logged in are not recorded at all: the request is simply ignored.
export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const u = await currentUser();
  if (!u || u.is_admin) return json({ ok: true });
  const { kind, target } = await request.json().catch(() => ({}));
  if (!KINDS.includes(kind) || typeof target !== 'string' || !TARGET.test(target) || /^\/(api|admin|account|parent|login|_next)(\/|$)/.test(target)) return json({ error: 'Invalid.' }, 400);
  const t = now();
  // A runaway page cannot fill the table: past 40 records in a minute, the rest are dropped.
  const { n } = await db().prepare('SELECT COUNT(*) AS n FROM events WHERE user_id = ? AND created_at > ?').bind(u.id, t - 60).first();
  if (n >= PER_MINUTE) return json({ ok: true });
  await db().prepare('INSERT INTO events (user_id, kind, target, created_at) VALUES (?, ?, ?, ?)').bind(u.id, kind, target, t).run();
  return json({ ok: true });
}
