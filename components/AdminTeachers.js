'use client';
import { useEffect, useState } from 'react';

const post = body => fetch('/api/admin/teachers', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

// The owner adds or removes teachers. A teacher registers on the Login page like any student; the owner then adds that mobile number here.
export default function AdminTeachers() {
  const [state, setState] = useState({ loading: true });
  const [mobile, setMobile] = useState('');
  const [note, setNote] = useState(''), [error, setError] = useState(''), [busy, setBusy] = useState(false);

  async function load() {
    const r = await fetch('/api/admin/teachers').catch(() => null);
    if (r?.status === 401) { window.location.href = '/login'; return; }
    if (!r?.ok) { setState({ error: r?.status === 403 ? 'This page is only for the site owner.' : 'Could not load the teachers. Please try again.' }); return; }
    setState({ teachers: (await r.json()).teachers });
  }
  useEffect(() => { load(); }, []);

  async function change(number, teacher) {
    setError(''); setNote(''); setBusy(true);
    try {
      const r = await post({ mobile: number, teacher }), d = await r.json();
      if (!r.ok) { setError(d.error || 'Something went wrong.'); return; }
      setNote(teacher ? 'Added. This person can now open the Teacher desk from My Account.' : 'Removed. This person is an ordinary student account again.');
      if (teacher) setMobile('');
      await load();
    } catch { setError('Could not reach the server.'); }
    finally { setBusy(false); }
  }

  if (state.loading) return <p className="muted">Loading…</p>;
  if (state.error) return <p className="error">{state.error}</p>;
  return (<>
    <div className="card auth">
      <h2>Add a teacher</h2>
      <p className="muted small">The teacher first registers on the <a href="/login">Login page</a> with their own mobile number and password. Then type that mobile number here.</p>
      <form onSubmit={e => { e.preventDefault(); change(mobile.trim(), true); }}>
        <label>Teacher's mobile number<input inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength={10} required value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ''))} /></label>
        {error && <p className="error" role="alert">{error}</p>}
        {note && <p className="muted" role="status">{note}</p>}
        <button className="btn" disabled={busy || mobile.length !== 10}>{busy ? 'Please wait…' : 'Make this account a teacher'}</button>
      </form>
    </div>
    <h2 style={{ marginTop: '2rem' }}>Teachers</h2>
    {!state.teachers.length ? <p className="muted">No teachers yet.</p>
      : <ul className="pr-recent">{state.teachers.map(t => (<li key={t.id}><span>{t.name} · {t.mobile}</span>
          <button type="button" className="pr-link" disabled={busy} onClick={() => { if (window.confirm(`Remove ${t.name} as a teacher?`)) change(t.mobile, false); }}>Remove</button></li>))}</ul>}
  </>);
}
