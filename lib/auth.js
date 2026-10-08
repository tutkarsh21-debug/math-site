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

// Only for accounts marked as admin (users.is_admin = 1). Returns a ready error response to send back, or null if all is well.
export async function adminGate() {
  const u = await currentUser();
  return !u ? json({ error: 'Please log in.' }, 401) : !u.is_admin ? json({ error: 'Not allowed.' }, 403) : null;
}

// ---- Parent access --------------------------------------------------------------------------------------------
// A student makes a parent code on the dashboard and gives it to a parent. The parent enters the student's mobile number and
// the code at /parent and can then only READ that one student's dashboard. This is a separate cookie and a separate table from
// the student's own login, so a parent session can never be mistaken for a student session.
const PARENT_COOKIE = 'ms_parent', PARENT_DAYS = 7;
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';   // no 0, O, 1, I or L, which are easy to mix up

// A new code such as "K7MQ-4XD9" (8 characters, about 40 bits: far too many to guess).
export function newParentCode() {
  const b = crypto.getRandomValues(new Uint8Array(8));
  const s = [...b].map(x => CODE_CHARS[x % CODE_CHARS.length]).join('');
  return `${s.slice(0, 4)}-${s.slice(4)}`;
}
// What the parent types is tidied up (capitals, no dash or spaces) before it is hashed.
export const parentCodeHash = code => sha256(String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, ''));

export async function startParentSession(userId) {
  const token = randomHex(32);
  await db().prepare('INSERT INTO parent_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').bind(await sha256(token), userId, now() + PARENT_DAYS * 86400).run();
  (await cookies()).set(PARENT_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: PARENT_DAYS * 86400 });
}
export async function endParentSession() {
  const jar = await cookies(), token = jar.get(PARENT_COOKIE)?.value;
  if (token) await db().prepare('DELETE FROM parent_sessions WHERE token_hash = ?').bind(await sha256(token)).run();
  jar.delete(PARENT_COOKIE);
}
// The id of the student whose dashboard the logged-in parent may read, or null.
export async function parentStudentId() {
  const token = (await cookies()).get(PARENT_COOKIE)?.value;
  if (!token || !/^[0-9a-f]{64}$/.test(token)) return null;
  const row = await db().prepare('SELECT user_id FROM parent_sessions WHERE token_hash = ? AND expires_at > ?').bind(await sha256(token), now()).first();
  return row ? row.user_id : null;
}
