import { endParentSession, json, sameOrigin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  await endParentSession();
  return json({ ok: true });
}
