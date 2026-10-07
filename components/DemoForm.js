'use client';
import Link from 'next/link';
import { useState } from 'react';

// The "Book a free demo class" form, for parents. It saves a request in the same list as the enquiries
// (see /admin/enquiries), marked as a demo request. classes: [[key, label]], boards: ['CBSE', 'ICSE'].
export const DEMO_NOTE = 'FREE DEMO CLASS REQUEST';

export default function DemoForm({ classes, boards, id }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const body = { ...Object.fromEntries(new FormData(e.target)), message: DEMO_NOTE };
      const r = await fetch('/api/enquiry', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      const d = await r.json();
      if (!r.ok) { setError(d.error || 'Something went wrong. Please try again.'); return; }
      setSent(true);
    } catch { setError('Could not reach the server. Check your connection and try again.'); }
    finally { setBusy(false); }
  }

  if (sent) return (<div className="card auth demo" id={id} role="status">
    <h2>Your demo is requested</h2>
    <p className="muted">Thank you. We will call you on the number you gave to fix a time for the free demo class.</p>
    <p className="muted">Until then, your child can start with the free notes and tests.</p>
    <div className="cta-row"><Link className="btn" href="/self-study">Start free self study</Link></div>
  </div>);

  return (<div className="card auth demo" id={id}>
    <h2>Book a <em>free</em> demo class</h2>
    <p className="muted">It takes less than a minute.</p>
    <form onSubmit={submit}>
      <label>Child's name<input name="name" required minLength={2} maxLength={60} autoComplete="off" /></label>
      <label>Parent's mobile number<input name="mobile" required inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength={10} title="10-digit mobile number" autoComplete="tel-national" /></label>
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
      <label className="hp" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      {error && <p className="error" role="alert">{error}</p>}
      <button className="btn btn-sun" disabled={busy}>{busy ? 'Please wait…' : 'Book my free demo'}</button>
      <p className="muted small">We use these details only to call you about the demo. See the <Link href="/privacy">privacy policy</Link>.</p>
    </form>
  </div>);
}
