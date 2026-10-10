'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import DashboardView from '@/components/Dashboard';
import Timetable from '@/components/Timetable';
import { PARENT_LOGIN } from '@/lib/flags';

const post = (url, body) => fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

// Parent access: the student makes a code and gives it, with their mobile number, to a parent, who opens /parent.
// The code is shown only once. A new code replaces the old one at once; "Switch off" ends parent access.
function ParentAccess({ has, since, onChange }) {
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function act(action) {
    if (action === 'off' && !window.confirm('Switch off parent access? The parent will be logged out and the code will stop working.')) return;
    if (action === 'make' && has && !window.confirm('Make a new code? The old code will stop working.')) return;
    setBusy(true); setError('');
    try {
      const r = await post('/api/parent/code', { action }), d = await r.json();
      if (!r.ok) { setError(d.error || 'Something went wrong. Please try again.'); return; }
      setCode(d.code || ''); onChange(action === 'make');
    } catch { setError('Could not reach the server.'); }
    finally { setBusy(false); }
  }
  return (<section className="dash-sec card parent-box">
    <h2>Parent access</h2>
    <p className="muted">Give your parent a code, and they can see how you are doing: your tests, scores, strong and weak topics and what you have opened. They can only look; they cannot change anything or see your password.</p>
    {code && <div className="parent-code" role="status">
      <p className="small muted">Your parent code. Copy it now: it is shown only once.</p>
      <b>{code}</b>
      <p className="small">Your parent opens <Link href="/parent">mathsetu.in/parent</Link> and enters your mobile number and this code.</p>
    </div>}
    {!code && has && <p className="small">A parent code is active{since ? ` (made on ${new Date(since * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })})` : ''}. For safety, it cannot be shown again.</p>}
    {error && <p className="error" role="alert">{error}</p>}
    <div className="cta-row">
      <button className="btn" disabled={busy} onClick={() => act('make')}>{has ? 'Make a new code' : 'Make a parent code'}</button>
      {has && <button className="btn btn-outline" disabled={busy} onClick={() => act('off')}>Switch off parent access</button>}
    </div>
  </section>);
}

// The student's own dashboard.
export default function Account() {
  const [state, setState] = useState({ loading: true });
  const [me, setMe] = useState(null);
  const load = async () => {
    const [m, d] = await Promise.all([fetch('/api/me').then(r => r.json()).catch(() => ({})), fetch('/api/dashboard').then(r => (r.ok ? r.json() : null)).catch(() => null)]);
    if (!m.user) { window.location.href = '/login'; return; }
    setMe(m.user); setState(d ? { data: d } : { error: true });
  };
  useEffect(() => { load(); }, []);

  async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    window.dispatchEvent(new Event('ms-auth'));
    window.location.href = '/';
  }

  if (state.loading) return <p className="muted">Loading…</p>;
  if (state.error) return <p className="error">Could not load your dashboard. Please refresh the page.</p>;
  const { data } = state;
  return (<>
    {me.teacherRequest && !me.teacher && <div className="card auth" style={{ maxWidth: 'none', marginBottom: '1rem', borderColor: 'var(--sun)' }} role="status"><b>Your teacher request is waiting for approval.</b><p className="muted small" style={{ margin: '.3rem 0 0' }}>The site owner will approve it soon. Once approved, a Teacher desk button appears here, and you will see the doubts students have sent.</p></div>}
    <div className="card auth dash-head" style={{ maxWidth: 'none' }}>
      <div>
        <h2>Hello, {data.user.name.split(' ')[0]}</h2>
        <p className="muted">{me.teacher ? 'Teacher account' : me.teacherRequest ? 'Teacher request pending' : `${data.user.clsLabel} · ${data.user.board}`} · {me.mobile}</p>
      </div>
      <div className="cta-row">
        <Link className="btn" href="/practice">Make a practice test</Link>
        <Link className="btn btn-outline" href="/tests">Chapter tests</Link>
        <Link className="btn btn-outline" href={`/${data.user.cls}`}>My class chapters</Link>
        <Link className="btn btn-outline" href="/doubts">Ask a doubt</Link>
        {(me.teacher || me.admin) && <Link className="btn btn-sun" href="/teacher">Teacher desk</Link>}
        {me.admin && <Link className="btn btn-sun" href="/admin">Owner dashboard</Link>}
        <button className="btn btn-outline" onClick={logout}>Logout</button>
      </div>
    </div>
    <DashboardView data={data} mode="student" />
    <div style={{ margin: '1rem 0' }}><Timetable scope="mine" title="My timetable" empty="No classes are scheduled for you yet. New live classes and 1-to-1 classes appear here, with the time and a Join button." /></div>
    {PARENT_LOGIN && <ParentAccess has={data.user.hasParentCode} since={data.user.parentCodeAt} onChange={on => setState(s => ({ data: { ...s.data, user: { ...s.data.user, hasParentCode: on, parentCodeAt: on ? Math.floor(Date.now() / 1000) : 0 } } }))} />}
  </>);
}
