import { currentUser, db, json, now, sameOrigin } from '@/lib/auth';
import { MAX_CHARS, MAX_PHOTO, MIN_CHARS, PER_DAY, chapterTitle } from '@/lib/doubts';

export const dynamic = 'force-dynamic';

// The logged-in student's own doubts, newest first. The AI draft is never sent here; only the approved answer.
export async function GET() {
  const u = await currentUser();
  if (!u) return json({ error: 'Please log in.' }, 401);
  const { results } = await db().prepare('SELECT id, chapter, question, has_photo, answer, created_at, answered_at FROM doubts WHERE user_id = ? ORDER BY created_at DESC LIMIT 100').bind(u.id).all();
  return json({ doubts: results });
}

// A new doubt: { question, chapter: 'class-10/real-numbers' or '', photo: a JPEG as base64 or '' }.
export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const u = await currentUser();
  if (!u) return json({ error: 'Please log in.' }, 401);
  const body = await request.json().catch(() => ({}));
  const question = typeof body.question === 'string' ? body.question.trim() : '';
  const chapter = typeof body.chapter === 'string' ? body.chapter : '', photo = typeof body.photo === 'string' ? body.photo : '';
  if (question.length < MIN_CHARS) return json({ error: 'Please write your doubt in a sentence or two.' }, 400);
  if (question.length > MAX_CHARS) return json({ error: `Please keep your doubt under ${MAX_CHARS} characters.` }, 400);
  if (chapter && !chapterTitle(chapter)) return json({ error: 'Please choose a chapter from the list.' }, 400);
  // Only a JPEG is accepted: base64 text that starts with the JPEG signature.
  if (photo && (photo.length > MAX_PHOTO || !photo.startsWith('/9j/') || !/^[A-Za-z0-9+/]+=*$/.test(photo))) return json({ error: 'The photo could not be used. Please try another photo.' }, 400);
  const t = now();
  const { n } = await db().prepare('SELECT COUNT(*) AS n FROM doubts WHERE user_id = ? AND created_at > ?').bind(u.id, t - 86400).first();
  if (n >= PER_DAY) return json({ error: `You can ask ${PER_DAY} doubts in a day. Please ask the next one tomorrow.` }, 429);
  const { meta } = await db().prepare('INSERT INTO doubts (user_id, chapter, question, has_photo, created_at) VALUES (?, ?, ?, ?, ?)').bind(u.id, chapter, question, photo ? 1 : 0, t).run();
  if (photo) await db().prepare('INSERT INTO doubt_photos (doubt_id, data) VALUES (?, ?)').bind(meta.last_row_id, photo).run();
  return json({ ok: true });
}
