import { db, json, staffGate } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// The doubt queue for teachers and the owner: unanswered first (oldest first, so nobody waits long), then the newest answered.
// The AI draft is not part of this; only the owner sees it, on /admin/doubts.
export async function GET() {
  const stop = await staffGate();
  if (stop) return stop;
  const { results } = await db().prepare(`SELECT d.id, d.chapter, d.question, d.has_photo, d.answer, d.created_at, d.answered_at, d.solved_by, u.name, u.cls, u.board,
      EXISTS(SELECT 1 FROM solutions s WHERE s.doubt_id = d.id) AS has_solution, (SELECT t.name FROM users t WHERE t.id = d.solved_by) AS solver
    FROM doubts d JOIN users u ON u.id = d.user_id
    ORDER BY (d.answered_at = 0) DESC, CASE WHEN d.answered_at = 0 THEN d.created_at END ASC, d.answered_at DESC LIMIT 200`).all();
  return json({ doubts: results });
}
