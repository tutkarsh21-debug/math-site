import { currentUser, json } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// The logged-in student, or null. The header and the account page ask for this.
export async function GET() {
  const u = await currentUser();
  return json({ user: u ? { name: u.name, mobile: u.mobile, cls: u.cls, board: u.board } : null });
}
