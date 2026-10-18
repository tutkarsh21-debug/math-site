'use client';
import { useEffect, useState } from 'react';
import { when } from '@/components/Dashboard';

// Students who forgot the password and asked for a reset. The owner sets a temporary password and sends it to the student's own number.
export default function PasswordRequests() {
  const [list, setList] = useState(null);
  const [shown, setShown] = useState(null);   // { name, mobile, password } for the reset just made
  const [error, setError] = useState('');
  const load = async () => { const r = await fetch('/api/admin/password').catch(() => null); if (r?.ok) setList((await r.json()).requests); };
  useEffect(() => { load(); }, []);

  async function reset(id, name) {
    if (!window.confirm(`Set a new temporary password for ${name}? Their old password will stop working and they will be logged out.`)) return;
    setError('');
    const r = await fetch('/api/admin/password', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }) }).catch(() => null);
    const d = await r?.json().catch(() => ({}));
    if (!r?.ok) { setError(d?.error || 'Could not reset. Please try again.'); return; }
    setShown(d); load();
  }

  if (!list || (list.length === 0 && !shown)) return null;
  const text = s => `Hello ${s.name.split(' ')[0]}, your MathSetu temporary password is ${s.password} . Please log in at https://mathsetu.in/login and change it in My Account.`;
  return (<section className="dash-sec card" style={{ maxWidth: 'none' }}>
    <h2>Password reset requests ({list.length})</h2>
    <p className="muted small">A student who forgot the password asked for help. Reply only on the mobile number shown, which is the one they registered with.</p>
    {error && <p className="error">{error}</p>}
    {shown && (<div className="parent-code">
      <p><strong>Temporary password for {shown.name}</strong> (shown only now):</p>
      <p><code style={{ fontSize: '1.4rem', letterSpacing: '.08em' }}>{shown.password}</code></p>
      <p className="cta-row">
        <a className="btn btn-sm" href={`https://wa.me/91${shown.mobile}?text=${encodeURIComponent(text(shown))}`} target="_blank" rel="noopener">Send on WhatsApp to {shown.mobile}</a>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => setShown(null)}>Done</button>
      </p>
    </div>)}
    {list.length > 0 && <div className="scroll-x"><table className="scores"><thead><tr><th>Student</th><th>Mobile</th><th>Asked</th><th></th></tr></thead><tbody>
      {list.map(r => (<tr key={r.id}><td>{r.name}</td><td><a href={`tel:${r.mobile}`}>{r.mobile}</a></td><td>{when(r.created_at)}</td>
        <td><button type="button" className="btn btn-sm" onClick={() => reset(r.user_id, r.name)}>Reset password</button></td></tr>))}
    </tbody></table></div>}
  </section>);
}
