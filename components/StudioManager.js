'use client';
import { useEffect, useState } from 'react';
import { when } from '@/lib/studio';

const send = (url, method, body) => fetch(url, { method, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
const CLS = { 'class-8': 'Class 8', 'class-9': 'Class 9', 'class-10': 'Class 10' };

// The owner's Studio manager: add and remove classes of the timetable (live and 1-to-1) and the playlists of the recorded studio.
export default function StudioManager() {
  const [data, setData] = useState({ loading: true });
  const [lists, setLists] = useState([]);
  const [kind, setKind] = useState('live');
  const [msg, setMsg] = useState(''), [err, setErr] = useState(''), [busy, setBusy] = useState(false);

  async function load() {
    const r = await fetch('/api/admin/timetable').catch(() => null);
    if (r?.status === 401) { window.location.href = '/login'; return; }
    if (!r?.ok) { setData({ error: r?.status === 403 ? 'This page is only for the site owner.' : 'Could not load the studio. Please try again.' }); return; }
    const d = await r.json();
    setData(d);
    setLists((await fetch('/api/playlists').then(x => x.json()).catch(() => ({ playlists: [] }))).playlists);
  }
  useEffect(() => { load(); }, []);

  async function run(fn, ok) {
    setErr(''); setMsg(''); setBusy(true);
    try { const r = await fn(), d = await r.json(); if (!r.ok) { setErr(d.error || 'Something went wrong.'); return false; } setMsg(ok); await load(); return true; }
    catch { setErr('Could not reach the server.'); return false; }
    finally { setBusy(false); }
  }

  async function addClass(e) {
    e.preventDefault();
    const f = e.target, v = Object.fromEntries(new FormData(f));
    const startsAt = Math.floor(new Date(v.when).getTime() / 1000);
    if (!Number.isFinite(startsAt)) { setErr('Please choose the date and time.'); return; }
    const body = { kind, title: v.title, startsAt, minutes: Number(v.minutes), notes: v.notes, link: v.link };
    if (kind === 'live') { body.cls = v.cls; body.board = v.board; } else body.studentId = Number(v.student);
    if (await run(() => send('/api/admin/timetable', 'POST', body), 'Class added. Students will see it in their timetable.')) f.reset();
  }
  async function addList(e) {
    e.preventDefault();
    const f = e.target, v = Object.fromEntries(new FormData(f));
    if (await run(() => send('/api/admin/playlists', 'POST', { cls: v.cls, title: v.title, playlist: v.playlist }), 'Playlist added to the recorded studio.')) f.reset();
  }

  if (data.loading) return <p className="muted">Loading…</p>;
  if (data.error) return <p className="error">{data.error}</p>;
  return (<>
    {err && <p className="error" role="alert">{err}</p>}{msg && <p className="muted" role="status">{msg}</p>}
    <div className="card auth" style={{ maxWidth: 'none' }}>
      <h2>Add a class to the timetable</h2>
      <div className="chips" role="tablist">
        <button type="button" className={`chip${kind === 'live' ? ' on' : ''}`} onClick={() => setKind('live')}>Live class (for a class)</button>
        <button type="button" className={`chip${kind === 'one' ? ' on' : ''}`} onClick={() => setKind('one')}>1-to-1 class (for one student)</button>
      </div>
      <form onSubmit={addClass}>
        <label>Name of the class<input name="title" required minLength={3} maxLength={100} placeholder={kind === 'live' ? 'Quadratic Equations, lecture 3' : 'Trigonometry doubts and practice'} /></label>
        <div className="row">
          <label>Date and time<input name="when" type="datetime-local" required /></label>
          <label>Length (minutes)<input name="minutes" type="number" min="10" max="360" step="5" defaultValue={60} required /></label>
        </div>
        {kind === 'live' ? (<>
          <div className="row">
            <label>Class<select name="cls" defaultValue=""><option value="">All classes</option>{Object.entries(CLS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
            <label>Board<select name="board" defaultValue=""><option value="">CBSE and ICSE</option><option>CBSE</option><option>ICSE</option></select></label>
          </div>
          <label>YouTube link of this live stream (optional)<input name="link" placeholder="https://www.youtube.com/watch?v=... Leave empty to show the channel's live stream" /></label>
        </>) : (<>
          <label>Student<select name="student" required defaultValue=""><option value="" disabled>Choose a student</option>
            {data.students.map(s => <option key={s.id} value={s.id}>{s.name} · {CLS[s.cls] || s.cls} {s.board} · {s.mobile}</option>)}</select></label>
          <label>Google Meet or Zoom link (optional)<input name="link" placeholder="https://meet.google.com/... Leave empty to use the video room inside the website" /></label>
        </>)}
        <label>Notes for the student (optional)<input name="notes" maxLength={500} placeholder="Bring your notebook and the last test paper" /></label>
        <button className="btn" disabled={busy}>{busy ? 'Please wait…' : 'Add to the timetable'}</button>
      </form>
    </div>

    <h2 style={{ marginTop: '2rem' }}>Timetable</h2>
    {!data.items.length ? <p className="muted">No classes yet.</p> : (<ul className="pr-recent">
      {data.items.map(i => (<li key={i.id}>
        <span><b>{i.title}</b> · {i.kind === 'one' ? `1-to-1 with ${i.student || 'a student'}` : `Live · ${i.cls ? CLS[i.cls] : 'All classes'}${i.board ? ` · ${i.board}` : ''}`}<br /><small className="muted">{when(i.starts_at)} · {i.minutes} min</small></span>
        <button type="button" className="pr-link" disabled={busy} onClick={() => { if (window.confirm(`Delete "${i.title}"?`)) run(() => send('/api/admin/timetable', 'DELETE', { id: i.id }), 'Class deleted.'); }}>Delete</button>
      </li>))}</ul>)}

    <div className="card auth" style={{ maxWidth: 'none', marginTop: '2.4rem' }}>
      <h2>Recorded studio: add a YouTube playlist</h2>
      <p className="muted small">On YouTube, open your playlist and copy its address, for example <code>youtube.com/playlist?list=PL...</code>. Make the playlist public or unlisted, otherwise it will not play here.</p>
      <form onSubmit={addList}>
        <div className="row">
          <label>Class<select name="cls" defaultValue=""><option value="">All classes</option>{Object.entries(CLS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
          <label>Name shown to students<input name="title" required minLength={3} maxLength={100} placeholder="Class 10 · Quadratic Equations" /></label>
        </div>
        <label>Playlist link<input name="playlist" required placeholder="https://www.youtube.com/playlist?list=PL..." /></label>
        <button className="btn" disabled={busy}>{busy ? 'Please wait…' : 'Add playlist'}</button>
      </form>
    </div>
    <h2 style={{ marginTop: '2rem' }}>Playlists</h2>
    {!lists.length ? <p className="muted">No playlists yet.</p> : (<ul className="pr-recent">
      {lists.map(l => (<li key={l.id}><span><b>{l.title}</b> · {l.cls ? CLS[l.cls] : 'All classes'}</span>
        <button type="button" className="pr-link" disabled={busy} onClick={() => { if (window.confirm(`Remove "${l.title}"?`)) run(() => send('/api/admin/playlists', 'DELETE', { id: l.id }), 'Playlist removed.'); }}>Remove</button></li>))}</ul>)}
  </>);
}
