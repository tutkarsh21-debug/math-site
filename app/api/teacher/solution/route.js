import { currentUser, db, json, now, sameOrigin } from '@/lib/auth';
import { MAX_ANSWER } from '@/lib/doubts';
import { AUDIO_TYPES, CHUNK, MAX_AUDIO, MAX_MS, cleanEvents } from '@/lib/solutions';

export const dynamic = 'force-dynamic';
const DEFAULT_NOTE = 'Your teacher has solved this doubt on the whiteboard. Press Play to watch the solution.';

// A teacher sends the solution of one doubt: { id, events, duration, audio: base64 or '', mime, note }.
// The doubt becomes answered, and the student sees a "doubt resolved" notification.
export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const u = await currentUser();
  if (!u) return json({ error: 'Please log in.' }, 401);
  if (!u.is_admin && !u.is_teacher) return json({ error: 'Not allowed.' }, 403);
  const body = await request.json().catch(() => ({}));
  const { id } = body;
  const doubt = Number.isInteger(id) ? await db().prepare('SELECT id, answer, answered_at, solved_by FROM doubts WHERE id = ?').bind(id).first() : null;
  if (!doubt) return json({ error: 'Doubt not found.' }, 404);
  // Another teacher's finished solution is not replaced by accident; the owner may always replace it.
  if (doubt.solved_by && doubt.solved_by !== u.id && !u.is_admin && (await db().prepare('SELECT 1 FROM solutions WHERE doubt_id = ?').bind(id).first())) return json({ error: 'Another teacher has already solved this doubt.' }, 409);

  const clean = cleanEvents(body.events);
  if (clean.error) return json({ error: clean.error }, 400);
  const duration = Math.round(Math.min(MAX_MS, Math.max(0, Number(body.duration) || 0)));
  const audio = typeof body.audio === 'string' ? body.audio : '';
  const mime = typeof body.mime === 'string' ? body.mime.split(';')[0].trim().toLowerCase() : '';
  if (audio && (audio.length > MAX_AUDIO || !/^[A-Za-z0-9+/]+=*$/.test(audio) || !AUDIO_TYPES.includes(mime))) return json({ error: 'The voice recording could not be used. You can send the solution without it.' }, 400);
  const note = typeof body.note === 'string' ? body.note.trim() : '';
  if (note.length > MAX_ANSWER) return json({ error: `Please keep the written note under ${MAX_ANSWER} characters.` }, 400);

  const t = now(), d = db();
  const steps = [
    d.prepare('INSERT OR REPLACE INTO solutions (doubt_id, teacher_id, strokes, duration_ms, audio_mime, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(id, u.id, JSON.stringify(clean.events), duration, audio ? mime : '', t),
    d.prepare('DELETE FROM solution_audio WHERE doubt_id = ?').bind(id),
  ];
  for (let i = 0, seq = 0; i < audio.length; i += CHUNK, seq++) steps.push(d.prepare('INSERT INTO solution_audio (doubt_id, seq, data) VALUES (?, ?, ?)').bind(id, seq, audio.slice(i, i + CHUNK)));
  // The written part: the teacher's note if there is one; otherwise a typed answer already sent by the owner is kept; otherwise a short pointer to the video.
  const keep = !note && doubt.answered_at && doubt.answer && !doubt.solved_by ? doubt.answer : '';
  steps.push(d.prepare('UPDATE doubts SET answer = ?, answered_at = ?, seen_at = 0, solved_by = ? WHERE id = ?').bind(note || keep || DEFAULT_NOTE, t, u.id, id));
  await d.batch(steps);
  return json({ ok: true });
}
