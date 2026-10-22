'use client';
import Link from 'next/link';
import { useState } from 'react';

// The owner sets a new password with the secret code (see app/api/owner-reset/route.js).
export default function OwnerReset() {
  const [msg, setMsg] = useState({ ok: false, error: '' });
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    if (f.password !== f.again) { setMsg({ ok: false, error: 'The two passwords are not the same.' }); return; }
    setBusy(true); setMsg({ ok: false, error: '' });
    try {
      const r = await fetch('/api/owner-reset', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ mobile: f.mobile, code: f.code, password: f.password }) });
      const d = await r.json();
      setMsg(r.ok ? { ok: true, error: '' } : { ok: false, error: d.error || 'Something went wrong. Please try again.' });
    } catch { setMsg({ ok: false, error: 'Could not reach the server. Check your connection and try again.' }); }
    finally { setBusy(false); }
  }
  if (msg.ok) return (<div className="card auth"><p><strong>Your password is changed.</strong></p><p><Link className="btn" href="/login">Go to login</Link></p></div>);
  return (<div className="card auth">
    <form onSubmit={submit} autoComplete="off">
      <label>Owner mobile number<input name="mobile" required inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength={10} /></label>
      <label>Secret code<input name="code" type="password" required maxLength={200} autoComplete="off" /></label>
      <label>New password<input name="password" type="password" required minLength={8} maxLength={72} autoComplete="new-password" /></label>
      <label>New password again<input name="again" type="password" required minLength={8} maxLength={72} autoComplete="new-password" /></label>
      {msg.error && <p className="error" role="alert">{msg.error}</p>}
      <button className="btn" disabled={busy}>{busy ? 'Please wait…' : 'Set new password'}</button>
    </form>
  </div>);
}
