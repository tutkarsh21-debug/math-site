import { CLASSES } from '@/lib/data';
import { adminGate, db, json, now, sameOrigin } from '@/lib/auth';
import { playlistId } from '@/lib/studio';

export const dynamic = 'force-dynamic';

// POST: { cls: 'class-9' or '', title, playlist: a YouTube playlist link or id }
export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const stop = await adminGate();
  if (stop) return stop;
  const b = await request.json().catch(() => ({}));
  const cls = typeof b.cls === 'string' ? b.cls : '', title = typeof b.title === 'string' ? b.title.trim() : '';
  const id = playlistId(b.playlist);
  if (cls && !CLASSES[cls]) return json({ error: 'Please choose a class from the list.' }, 400);
  if (title.length < 3 || title.length > 100) return json({ error: 'Please give the playlist a name of 3 to 100 characters.' }, 400);
  if (!id) return json({ error: 'That is not a YouTube playlist link. It looks like youtube.com/playlist?list=PL...' }, 400);
  await db().prepare('INSERT INTO studio_playlists (cls, title, playlist, created_at) VALUES (?, ?, ?, ?)').bind(cls, title, id, now()).run();
  return json({ ok: true });
}

// DELETE: { id }
export async function DELETE(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const stop = await adminGate();
  if (stop) return stop;
  const { id } = await request.json().catch(() => ({}));
  if (!Number.isInteger(id)) return json({ error: 'Nothing to delete.' }, 400);
  await db().prepare('DELETE FROM studio_playlists WHERE id = ?').bind(id).run();
  return json({ ok: true });
}
