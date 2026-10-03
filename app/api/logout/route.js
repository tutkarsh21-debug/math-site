import { endSession, json, sameOrigin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  await endSession();
  return json({ ok: true });
}
