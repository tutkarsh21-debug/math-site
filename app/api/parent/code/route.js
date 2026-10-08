import { currentUser, db, json, newParentCode, now, parentCodeHash, sameOrigin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// A student makes (or replaces) the code that lets a parent see the dashboard, or switches parent access off.
// { action: 'make' } returns the new code once; only its hash is stored, so it can never be shown again.
// Making a new code or switching off also ends every parent session that was open.
export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);
  const u = await currentUser();
  if (!u) return json({ error: 'Please log in.' }, 401);
  const { action } = await request.json().catch(() => ({}));
  if (action !== 'make' && action !== 'off') return json({ error: 'Invalid request.' }, 400);
  const code = action === 'make' ? newParentCode() : '';
  await db().batch([
    db().prepare('UPDATE users SET parent_code_hash = ?, parent_code_at = ?, parent_fails = 0, parent_locked_until = 0 WHERE id = ?').bind(code ? await parentCodeHash(code) : '', code ? now() : 0, u.id),
    db().prepare('DELETE FROM parent_sessions WHERE user_id = ?').bind(u.id),
  ]);
  return json(code ? { code } : { ok: true });
}
