import { adminGate, db, json } from '@/lib/auth';
import { studentOverview } from '@/lib/dashboard';

export const dynamic = 'force-dynamic';

// One student's full dashboard, for the owner: /api/admin/student?id=12
export async function GET(request) {
  const stop = await adminGate();
  if (stop) return stop;
  const id = Number(new URL(request.url).searchParams.get('id'));
  if (!Number.isInteger(id) || id < 1) return json({ error: 'Invalid student.' }, 400);
  const data = await studentOverview(id, 100);
  if (!data) return json({ error: 'Not found.' }, 404);
  const u = await db().prepare('SELECT mobile FROM users WHERE id = ?').bind(id).first();
  data.user.mobile = u?.mobile || '';
  return json(data);
}
