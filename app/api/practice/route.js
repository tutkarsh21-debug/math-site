import { currentUser, db, json, now, sameOrigin } from '@/lib/auth';
import { CLASSES } from '@/lib/data';

export const dynamic = 'force-dynamic';
const LEVELS = ['0', '1', '2', 'mixed'], SLUG = /^[a-z0-9-]{1,60}$/;

// Saves a finished practice test for the logged-in student, so that the dashboards can show it:
// { cls, level, minutes, secs, skipped, items: [{ ch, label, n, c }] }. The score is added up here from items.
export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const u = await currentUser();
  if (!u) return json({ error: 'Please log in.' }, 401);
  const b = await request.json().catch(() => ({}));
  const int = (v, max) => Number.isInteger(v) && v >= 0 && v <= max;
  if (!(CLASSES[b.cls] || b.cls === 'olympiad') || !LEVELS.includes(String(b.level))) return json({ error: 'Invalid test.' }, 400);
  if (!Array.isArray(b.items) || !b.items.length || b.items.length > 40) return json({ error: 'Invalid test.' }, 400);
  const items = [];
  for (const i of b.items) {
    if (!i || typeof i.ch !== 'string' || !SLUG.test(i.ch) || typeof i.label !== 'string' || i.label.length > 80 || !int(i.n, 60) || !int(i.c, 60) || i.c > i.n || i.n < 1) return json({ error: 'Invalid test.' }, 400);
    items.push({ ch: i.ch, label: i.label, n: i.n, c: i.c });
  }
  const total = items.reduce((s, i) => s + i.n, 0), score = items.reduce((s, i) => s + i.c, 0);
  if (total > 100 || !int(b.minutes ?? 0, 600) || !int(b.secs ?? 0, 36000) || !int(b.skipped ?? 0, 100)) return json({ error: 'Invalid test.' }, 400);
  await db().prepare('INSERT INTO practice_results (user_id, cls, level, score, total, secs, minutes, skipped, items, taken_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(u.id, b.cls, String(b.level), score, total, b.secs ?? 0, b.minutes ?? 0, b.skipped ?? 0, JSON.stringify(items), now()).run();
  return json({ ok: true });
}
