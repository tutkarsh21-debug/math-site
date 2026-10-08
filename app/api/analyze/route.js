import { currentUser, db, json, now, sameOrigin } from '@/lib/auth';
import { writeReport } from '@/lib/analyze';
import { PER_DAY, validatePayload } from '@/lib/report';

export const dynamic = 'force-dynamic';

// The AI report on a test, for a logged-in student. Each report costs money, so it needs a login and is limited to PER_DAY a day.
// Body: the figures of the test (see lib/report.js validatePayload) and lang: 'en' or 'hinglish'.
export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const u = await currentUser();
  if (!u) return json({ error: 'Please log in to get an AI report.', login: true }, 401);
  const body = await request.json().catch(() => null);
  const { p, error } = validatePayload(body);
  if (error) return json({ error }, 400);
  const lang = body.lang === 'hinglish' ? 'hinglish' : 'en';
  const t = now();
  const { n } = await db().prepare('SELECT COUNT(*) AS n FROM ai_reports WHERE user_id = ? AND created_at > ?').bind(u.id, t - 86400).first();
  if (n >= PER_DAY) return json({ error: `You can ask for ${PER_DAY} AI reports in a day. Please try again tomorrow. The analysis under each test is always available.` }, 429);
  const r = await writeReport(p, lang);
  if (r.error) return json({ error: r.error, off: !!r.off }, r.status || 502);
  await db().prepare('INSERT INTO ai_reports (user_id, created_at) VALUES (?, ?)').bind(u.id, t).run();
  return json({ report: r.report, left: PER_DAY - n - 1 });
}
