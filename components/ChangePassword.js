'use client';
import { useState } from 'react';

// A logged-in student changes the password.
export default function ChangePassword() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState({ ok: '', error: '' });
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    const form = e.target, f = Object.fromEntries(new FormData(form));
    if (f.next !== f.again) { setMsg({ ok: '', error: 'The two new passwords are not the same.' }); return; }
    setBusy(true); setMsg({ ok: '', error: '' });
    try {
      const r = await fetch('/api/account/password', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ current: f.current, next: f.next }) });
      const d = await r.json();
      if (!r.ok) setMsg({ ok: '', error: d.error || 'Something went wrong. Please try again.' });
      else { setMsg({ ok: 'Your password is changed. You are logged out on your other devices.', error: '' }); form.reset(); }
    } catch { setMsg({ ok: '', error: 'Could not reach the server. Check your connection and try again.' }); }
    finally { setBusy(false); }
  }
  if (!open) return <p className="muted small"><button type="button" className="pr-link" onClick={() => setOpen(true)}>Change password</button></p>;
  return (<section className="dash-sec card auth" style={{ maxWidth: '26rem' }}>
    <h2>Change password</h2>
    <form onSubmit={submit}>
      <label>Current password<input name="current" type="password" required maxLength={72} autoComplete="current-password" /></label>
      <label>New password<input name="next" type="password" required minLength={8} maxLength={72} autoComplete="new-password" /></label>
      <label>New password again<input name="again" type="password" required minLength={8} maxLength={72} autoComplete="new-password" /></label>
      {msg.error && <p className="error" role="alert">{msg.error}</p>}
      {msg.ok && <p role="status"><strong>{msg.ok}</strong></p>}
      <button className="btn" disabled={busy}>{busy ? 'Please wait…' : 'Change password'}</button>
    </form>
  </section>);
}
