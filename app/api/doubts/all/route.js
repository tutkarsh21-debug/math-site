import { currentUser, db, json, now, sameOrigin } from '@/lib/auth';
import { MAX_ANSWER, draftAnswer } from '@/lib/doubts';

export const dynamic = 'force-dynamic';

// Everything here is only for accounts marked as admin (users.is_admin = 1).
async function admin() {
  const u = await currentUser();
  return !u ? json({ error: 'Please log in.' }, 401) : !u.is_admin ? json({ error: 'Not allowed.' }, 403) : null;
}

// All doubts with the student's name and class: unanswered first, then newest first.
export async function GET() {
  const stop = await admin();
  if (stop) return stop;
  const { results } = await db().prepare('SELECT d.id, d.chapter, d.question, d.has_photo, d.draft, d.answer, d.created_at, d.answered_at, u.name, u.cls, u.board FROM doubts d JOIN users u ON u.id = d.user_id ORDER BY (d.answered_at = 0) DESC, d.created_at DESC LIMIT 200').all();
  return json({ doubts: results });
}

// { id, action: 'draft' } asks the AI for a draft and saves it. { id, action: 'answer', answer } sends the answer to the student.
export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const stop = await admin();
  if (stop) return stop;
  const { id, action, answer } = await request.json().catch(() => ({}));
  const d = Number.isInteger(id) ? await db().prepare('SELECT d.id, d.chapter, d.question, u.cls, u.board FROM doubts d JOIN users u ON u.id = d.user_id WHERE d.id = ?').bind(id).first() : null;
  if (!d) return json({ error: 'Doubt not found.' }, 404);
  if (action === 'draft') {
    const photo = await db().prepare('SELECT data FROM doubt_photos WHERE doubt_id = ?').bind(id).first();
    const out = await draftAnswer(d, photo?.data || '');
    if (out.error) return json(out, 502);
    await db().prepare('UPDATE doubts SET draft = ? WHERE id = ?').bind(out.draft, id).run();
    return json(out);
  }
  if (action === 'answer') {
    const text = typeof answer === 'string' ? answer.trim() : '';
    if (!text) return json({ error: 'Please write the answer first.' }, 400);
    if (text.length > MAX_ANSWER) return json({ error: `Please keep the answer under ${MAX_ANSWER} characters.` }, 400);
    await db().prepare('UPDATE doubts SET answer = ?, answered_at = ?, seen_at = 0 WHERE id = ?').bind(text, now(), id).run();
    return json({ ok: true });
  }
  return json({ error: 'Unknown action.' }, 400);
}
