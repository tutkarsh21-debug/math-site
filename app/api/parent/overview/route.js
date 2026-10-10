import { PARENT_LOGIN } from '@/lib/data';
import { json, parentStudentId } from '@/lib/auth';
import { studentOverview } from '@/lib/dashboard';

export const dynamic = 'force-dynamic';

// What a logged-in parent may read: the dashboard of the one student the code belongs to. Nothing else, and nothing can be changed.
export async function GET() {
  if (!PARENT_LOGIN) return json({ error: 'Not found.' }, 404);   // parent login is switched off: see lib/data.js
  const id = await parentStudentId();
  if (!id) return json({ error: 'Please enter the parent code.' }, 401);
  const data = await studentOverview(id, 40);
  if (!data) return json({ error: 'Not found.' }, 404);
  // The parent knows the mobile number already, and the parent-code details belong to the student.
  delete data.user.hasParentCode; delete data.user.parentCodeAt;
  return json(data);
}
