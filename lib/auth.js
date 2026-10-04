// Student accounts: password hashing and login sessions, stored in the D1 database (see schema.sql).
// Server only: used by the routes under app/api/.
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { cookies } from 'next/headers';
import { BOARDS, CLASSES } from '@/lib/data';

const COOKIE = 'ms_session', DAYS = 30, enc = new TextEncoder();
const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
const unhex = s => new Uint8Array(s.match(/../g).map(h => parseInt(h, 16)));

export const db = () => getCloudflareContext().env.DB;
export const now = () => Math.floor(Date.now() / 1000);
export const randomHex = n => hex(crypto.getRandomValues(new Uint8Array(n)));
export const json = (data, status = 200) => Response.json(data, { status, headers: { 'cache-control': 'no-store' } });

// Passwords are never stored. Only a salted PBKDF2 hash is kept.
export async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: unhex(salt), iterations: 100000 }, key, 256));
}
// Compares two hashes without stopping at the first difference.
export function same(a, b) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
const sha256 = async s => hex(await crypto.subtle.digest('SHA-256', enc.encode(s)));

// The browser holds a random token in an HttpOnly cookie; the database holds only its hash.
export async function startSession(userId) {
  const token = randomHex(32);
  await db().prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').bind(await sha256(token), userId, now() + DAYS * 86400).run();
  (await cookies()).set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: DAYS * 86400 });
}
export async function endSession() {
  const jar = await cookies(), token = jar.get(COOKIE)?.value;
  if (token) await db().prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256(token)).run();
  jar.delete(COOKIE);
}
export async function currentUser() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token || !/^[0-9a-f]{64}$/.test(token)) return null;
  return await db().prepare('SELECT u.id, u.name, u.mobile, u.cls, u.board, u.is_admin FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?')
    .bind(await sha256(token), now()).first();
}

// Requests that change something must come from this site's own pages.
export function sameOrigin(request) {
  try { return new URL(request.headers.get('origin')).host === request.headers.get('host'); } catch { return false; }
}

// Checks the fields of the registration form. Returns an error message, or '' if all is well.
export function checkSignup({ name, mobile, cls, board, password }) {
  if (typeof name !== 'string' || name.trim().length < 2 || name.length > 60) return 'Please enter your name.';
  if (!/^[6-9]\d{9}$/.test(mobile || '')) return 'Please enter a 10-digit mobile number.';
  if (!CLASSES[cls]) return 'Please choose your class.';
  if (!BOARDS.includes(board)) return 'Please choose your board.';
  if (typeof password !== 'string' || password.length < 8 || password.length > 72) return 'The password must have at least 8 characters.';
  return '';
}
