'use client';
import Link from 'next/link';
import { useState } from 'react';

// The enquiry form. classes: [[key, label]], boards: ['CBSE', 'ICSE'].
export default function EnquiryForm({ classes, boards }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const r = await fetch('/api/enquiry', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(e.target))) });
      const d = await r.json();
      if (!r.ok) { setError(d.error || 'Something went wrong. Please try again.'); return; }
      setSent(true);
    } catch { setError('Could not reach the server. Check your connection and try again.'); }
    finally { setBusy(false); }
  }

  if (sent) return (<div className="card auth" role="status">
    <h2>Thank you</h2>
    <p className="muted">We have received your enquiry and will get back to you on the mobile number you gave.</p>
    <div className="cta-row"><Link className="btn" href="/self-study">Start free self study</Link><Link className="btn btn-outline" href="/">Home</Link></div>
  </div>);

  return (<div className="card auth">
    <h2>Enquiry form</h2>
    <form onSubmit={submit}>
      <label>Student's name<input name="name" required minLength={2} maxLength={60} autoComplete="name" /></label>
      <label>Mobile number (parent or student)<input name="mobile" required inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength={10} title="10-digit mobile number" autoComplete="tel-national" /></label>
      <div className="row">
        <label>Class<select name="cls" required defaultValue="">
          <option value="" disabled>Choose</option>
          {classes.map(([k, label]) => <option key={k} value={k}>{label}</option>)}
        </select></label>
        <label>Board<select name="board" required defaultValue="">
          <option value="" disabled>Choose</option>
          {boards.map(b => <option key={b} value={b}>{b}</option>)}
        </select></label>
      </div>
      <label>Your question (optional)<textarea name="message" rows={3} maxLength={500} /></label>
      <label className="hp" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <p className="muted small">We use these details only to reply to you. See the <Link href="/privacy">privacy policy</Link>.</p>
      {error && <p className="error" role="alert">{error}</p>}
      <button className="btn" disabled={busy}>{busy ? 'Please wait…' : 'Send enquiry'}</button>
    </form>
  </div>);
}
