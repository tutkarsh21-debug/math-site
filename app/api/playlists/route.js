import { db, json } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// The YouTube playlists of the recorded studio. Public: they are public on YouTube as well.
export async function GET() {
  const { results } = await db().prepare('SELECT id, cls, title, playlist FROM studio_playlists ORDER BY cls, id').all();
  return json({ playlists: results });
}
