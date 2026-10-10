import { currentUser, db, json } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// The whiteboard solution of a doubt. Only the student who asked and teachers or the owner may open it.
//   /api/doubts/solution?id=12              the pen strokes and the length, as JSON
//   /api/doubts/solution?id=12&audio=1      the teacher's voice, as an audio file (ranges are supported, which Safari needs)
async function allowed(id) {
  const u = await currentUser();
  if (!u) return { stop: json({ error: 'Please log in.' }, 401) };
  if (!Number.isInteger(id) || id < 1) return { stop: json({ error: 'Not found.' }, 404) };
  const row = await db().prepare('SELECT d.user_id, s.strokes, s.duration_ms, s.audio_mime FROM doubts d JOIN solutions s ON s.doubt_id = d.id WHERE d.id = ?').bind(id).first();
  if (!row || (row.user_id !== u.id && !u.is_admin && !u.is_teacher)) return { stop: json({ error: 'Not found.' }, 404) };
  return { row };
}

export async function GET(request) {
  const url = new URL(request.url), id = Number(url.searchParams.get('id'));
  const { stop, row } = await allowed(id);
  if (stop) return stop;
  if (!url.searchParams.get('audio')) return json({ events: JSON.parse(row.strokes), duration: row.duration_ms, audio: !!row.audio_mime });
  if (!row.audio_mime) return json({ error: 'Not found.' }, 404);
  const { results } = await db().prepare('SELECT data FROM solution_audio WHERE doubt_id = ? ORDER BY seq').bind(id).all();
  const bytes = Uint8Array.from(atob(results.map(r => r.data).join('')), c => c.charCodeAt(0));
  const headers = { 'content-type': row.audio_mime, 'accept-ranges': 'bytes', 'cache-control': 'private, no-store', 'x-content-type-options': 'nosniff' };
  const m = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get('range') || '');
  if (m && (m[1] || m[2])) {
    const total = bytes.length;
    let start = m[1] ? Number(m[1]) : total - Number(m[2]), end = m[1] && m[2] ? Number(m[2]) : total - 1;
    start = Math.max(0, start); end = Math.min(total - 1, end);
    if (start > end) return new Response(null, { status: 416, headers: { ...headers, 'content-range': `bytes */${total}` } });
    return new Response(bytes.slice(start, end + 1), { status: 206, headers: { ...headers, 'content-range': `bytes ${start}-${end}/${total}`, 'content-length': String(end - start + 1) } });
  }
  return new Response(bytes, { headers: { ...headers, 'content-length': String(bytes.length) } });
}
