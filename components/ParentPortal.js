'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import DashboardView from '@/components/Dashboard';

const post = (url, body) => fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

// The parent's page: a form for the student's mobile number and parent code, then a read-only dashboard of that one student.
export default function ParentPortal() {
  const [state, setState] = useState({ loading: true });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const r = await fetch('/api/parent/overview').catch(() => null);
    setState(r?.ok ? { data: await r.json() } : { login: true });
  };
  useEffect(() => { load(); }, []);

  async function submit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const r = await post('/api/parent/login', Object.fromEntries(new FormData(e.target))), d = await r.json();
      if (!r.ok) { setError(d.error || 'Something went wrong. Please try again.'); return; }
      await load();
    } catch { setError('Could not reach the server. Check your connection and try again.'); }
    finally { setBusy(false); }
  }
  async function leave() { await post('/api/parent/logout', {}); setState({ login: true }); }

  if (state.loading) return <p className="muted">Loading…</p>;
  if (state.data) {
    const d = state.data;
    return (<>
      <div className="card auth dash-head" style={{ maxWidth: 'none' }}>
        <div>
          <h2>{d.user.name}</h2>
          <p className="muted">{d.user.clsLabel} · {d.user.board} · you are viewing this as a parent (read only)</p>
        </div>
        <div className="cta-row"><button className="btn btn-outline" onClick={leave}>Log out</button></div>
      </div>
      <DashboardView data={d} mode="parent" />
    </>);
  }
  return (<div className="card auth">
    <h2>Parent login</h2>
    <p className="muted">Enter your child's mobile number and the parent code. Your child makes the code on their own dashboard, under "Parent access".</p>
    <form onSubmit={submit}>
      <label>Child's mobile number<input name="mobile" required inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength={10} title="10-digit mobile number" autoComplete="off" /></label>
      <label>Parent code<input name="code" required maxLength={12} autoComplete="off" autoCapitalize="characters" placeholder="XXXX-XXXX" style={{ textTransform: 'uppercase', letterSpacing: '.1em' }} /></label>
      {error && <p className="error" role="alert">{error}</p>}
      <button className="btn" disabled={busy}>{busy ? 'Please wait…' : 'See my child\'s progress'}</button>
    </form>
    <p className="muted small">You can only look. You cannot change anything or see the password. Is your child not yet registered? <Link href="/login">Register here</Link>.</p>
  </div>);
}
