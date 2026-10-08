import { adminGate, json } from '@/lib/auth';
import { adminOverview } from '@/lib/dashboard';

export const dynamic = 'force-dynamic';

// The owner's view of the whole site.
export async function GET() {
  const stop = await adminGate();
  if (stop) return stop;
  return json(await adminOverview());
}
