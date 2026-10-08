import { currentUser, json } from '@/lib/auth';
import { studentOverview } from '@/lib/dashboard';

export const dynamic = 'force-dynamic';

// The logged-in student's own dashboard.
export async function GET() {
  const u = await currentUser();
  if (!u) return json({ error: 'Please log in.' }, 401);
  return json(await studentOverview(u.id));
}
