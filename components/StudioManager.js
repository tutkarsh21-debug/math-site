'use client';
import { useEffect, useState } from 'react';
import Timetable from '@/components/Timetable';
import { when } from '@/lib/studio';

const send = (url, method, body) => fetch(url, { method, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
const CLS = { 'class-8': 'Class 8', 'class-9': 'Class 9', 'class-10': 'Class 10' };
const pad = n => String(n).padStart(2, '0');
// A unix time as the value of a datetime-local field (in the browser's own time).
const local = t => { const d = new Date(t * 1000); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`; };

// The owner's Studio manager: the weekly timetable (click a class to change, move or cancel it), adding classes (once or every week),
// and the playlists of the recorded studio.
export default function StudioManager() {
  const [students, setStudents] = useState(null);
  const [lists, setLists] = useState([]);
  const [kind, setKind] = useState('live');
  const [pick, setPick] = useState(null);            // the class being changed
  const [refresh, setRefresh] = useState(0);
  const [msg, setMsg] = useState(''), [err, setErr] = useState(''), [busy, setBusy] = useState(false), [fatal, setFatal] = useState('');

  async function boot() {
    const r = await fetch('/api/admin/timetable').catch(() => null);
    if (r?.status === 401) { window.location.href = '/login'; return; }
    if (!r?.ok) { setFatal(r?.status === 403 ? 'This page is only for the site owner.' : 'Could not load the studio. Please try again.'); return; }
    setStudents((await r.json()).students);
    setLists((await fetch('/api/playlists').then(x => x.json()).catch(() => ({ playlists: [] }))).playlists);
  }
  useEffect(() => { boot(); }, []);

  async function run(fn, ok) {
    setErr(''); setMsg(''); setBusy(true);
    try { const r = await fn(), d = await r.json(); if (!r.ok) { setErr(d.error || 'Something went wrong.'); return false; } setMsg(ok); setRefresh(x => x + 1); return true; }
    catch { setErr('Could not reach the server.'); return false; }
    finally { setBusy(false); }
  }

  async function addClass(e) {
    e.preventDefault();
    const f = e.target, v = Object.fromEntries(new FormData(f));
    const startsAt = Math.floor(new Date(v.when).getTime() / 1000);
    if (!Number.isFinite(startsAt)) { setErr('Please choose the date and time.'); return; }
    const weeks = Number(v.repeat) || 1;
    const body = { kind, title: v.title, startsAt, minutes: Number(v.minutes), notes: v.notes, link: v.link, repeat: weeks };
    if (kind === 'live') { body.cls = v.cls; body.board = v.board; } else body.studentId = Number(v.student);
    if (await run(() => send('/api/admin/timetable', 'POST', body), weeks > 1 ? `Added: this class every week for ${weeks} weeks. Students see it in their timetable.` : 'Class added. Students will see it in their timetable.')) f.reset();
  }
  async function addList(e) {
    e.preventDefault();
    const f = e.target, v = Object.fromEntries(new FormData(f));
    if (await run(() => send('/api/admin/playlists', 'POST', { cls: v.cls, title: v.title, playlist: v.playlist }), 'Playlist added to the recorded studio.')) { f.reset(); setLists((await fetch('/api/playlists').then(x => x.json())).playlists); }
  }

  // Saves the changes made to one class, to this one or to this and all the following weeks.
  async function save(e, scope) {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(e.target.closest('form')));
    const startsAt = Math.floor(new Date(v.when).getTime() / 1000);
    if (!Number.isFinite(startsAt)) { setErr('Please choose the date and time.'); return; }
    const body = { id: pick.id, scope, title: v.title, startsAt, minutes: Number(v.minutes), notes: v.notes, link: v.link };
    if (await run(() => send('/api/admin/timetable', 'PATCH', body), scope === 'following' ? 'Changed this class and all the following weeks.' : 'Class changed.')) setPick(null);
  }
  const cancel = async (scope, off) => {
    let reason = '';
    if (off) { reason = window.prompt('Reason for cancelling (students will see this; you can leave it empty):', '') ?? null; if (reason === null) return; }
    if (await run(() => send('/api/admin/timetable', 'PATCH', { id: pick.id, scope, cancel: off, reason }), off ? (scope === 'following' ? 'Cancelled this class and all the following weeks.' : 'Class cancelled. Students see it marked as cancelled.') : 'Class restored.')) setPick(null);
  };
  const remove = async scope => {
    if (!window.confirm(scope === 'following' ? `Delete "${pick.title}" and every following week? This cannot be undone.` : `Delete "${pick.title}"? This cannot be undone.`)) return;
    if (await run(() => send('/api/admin/timetable', 'DELETE', { id: pick.id, scope }), 'Deleted.')) setPick(null);
  };

  if (fatal) return <p className="error">{fatal}</p>;
  if (!students) return <p className="muted">Loading…</p>;
  const series = pick?.series;
  return (<>
    {err && <p className="error" role="alert">{err}</p>}{msg && <p className="muted" role="status">{msg}</p>}

    <Timetable scope="admin" title="Weekly timetable" empty="No classes this week. Add one below." selected={pick?.id || 0} refresh={refresh} onSelect={c => { setErr(''); setMsg(''); setPick(c); }} />
    <p className="muted small" style={{ marginTop: '.5rem' }}>Click a class to change its time, cancel it for one day, or delete it.</p>

    {pick && (<div className="card auth wk-edit" style={{ maxWidth: 'none' }}>
      <h2>{pick.status === 'cancelled' ? 'Cancelled class' : 'Change this class'}</h2>
      <p className="muted small">{pick.kind === 'one' ? `1-to-1 with ${pick.student || 'a student'}` : `Live · ${pick.cls ? CLS[pick.cls] : 'All classes'}${pick.board ? ` · ${pick.board}` : ''}`} · {when(pick.starts_at)}{series ? ' · part of a weekly series' : ''}</p>
      <form key={pick.id} onSubmit={e => e.preventDefault()}>
        <label>Name<input name="title" required minLength={3} maxLength={100} defaultValue={pick.title} /></label>
        <div className="row">
          <label>Date and time<input name="when" type="datetime-local" required defaultValue={local(pick.starts_at)} /></label>
          <label>Length (minutes)<input name="minutes" type="number" min="10" max="360" step="5" defaultValue={pick.minutes} required /></label>
        </div>
        <label>{pick.kind === 'live' ? 'YouTube link of this stream (optional)' : 'Meeting link (optional)'}<input name="link" defaultValue={pick.kind === 'live' && pick.link ? `https://youtu.be/${pick.link}` : pick.link || ''} /></label>
        <label>Notes for students<input name="notes" maxLength={500} defaultValue={pick.notes} /></label>
        <div className="cta-row">
          <button type="button" className="btn" disabled={busy} onClick={e => save(e, 'one')}>Save this class</button>
          {series && <button type="button" className="btn btn-outline" disabled={busy} onClick={e => save(e, 'following')}>Save this and all following weeks</button>}
        </div>
        <div className="cta-row wk-danger">
          {pick.status === 'cancelled'
            ? <button type="button" className="btn btn-sm btn-outline" disabled={busy} onClick={() => cancel('one', false)}>Restore this class</button>
            : <button type="button" className="btn btn-sm btn-outline" disabled={busy} onClick={() => cancel('one', true)}>Cancel this class</button>}
          {series && pick.status !== 'cancelled' && <button type="button" className="btn btn-sm btn-outline" disabled={busy} onClick={() => cancel('following', true)}>Cancel this and all following weeks</button>}
          <button type="button" className="btn btn-sm btn-outline" disabled={busy} onClick={() => remove('one')}>Delete</button>
          {series && <button type="button" className="btn btn-sm btn-outline" disabled={busy} onClick={() => remove('following')}>Delete this and all following weeks</button>}
          <button type="button" className="pr-link" onClick={() => setPick(null)}>Close</button>
        </div>
      </form>
    </div>)}

    <div className="card auth" style={{ maxWidth: 'none', marginTop: '2rem' }}>
      <h2>Add a class</h2>
      <div className="chips" role="tablist">
        <button type="button" className={`chip${kind === 'live' ? ' on' : ''}`} onClick={() => setKind('live')}>Live class (for a class)</button>
        <button type="button" className={`chip${kind === 'one' ? ' on' : ''}`} onClick={() => setKind('one')}>1-to-1 class (for one student)</button>
      </div>
      <form onSubmit={addClass}>
        <label>Name of the class<input name="title" required minLength={3} maxLength={100} placeholder={kind === 'live' ? 'Class 10: Quadratic Equations' : 'Trigonometry doubts and practice'} /></label>
        <div className="row">
          <label>First date and time<input name="when" type="datetime-local" required /></label>
          <label>Length (minutes)<input name="minutes" type="number" min="10" max="360" step="5" defaultValue={60} required /></label>
        </div>
        <label>Repeat every week for<select name="repeat" defaultValue="1">
          <option value="1">This day only (no repeat)</option>
          {[2, 4, 8, 12, 16, 20, 26].map(n => <option key={n} value={n}>{n} weeks (same weekday and time)</option>)}</select></label>
        {kind === 'live' ? (<>
          <div className="row">
            <label>Class<select name="cls" defaultValue=""><option value="">All classes</option>{Object.entries(CLS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
            <label>Board<select name="board" defaultValue=""><option value="">CBSE and ICSE</option><option>CBSE</option><option>ICSE</option></select></label>
          </div>
          <label>YouTube link of this live stream (optional, first class only)<input name="link" placeholder="https://www.youtube.com/watch?v=... Leave empty to show the channel's live stream" /></label>
        </>) : (<>
          <label>Student<select name="student" required defaultValue=""><option value="" disabled>Choose a student</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name} · {CLS[s.cls] || s.cls} {s.board} · {s.mobile}</option>)}</select></label>
          <label>Google Meet or Zoom link (optional)<input name="link" placeholder="https://meet.google.com/... Leave empty to use the video room inside the website" /></label>
        </>)}
        <label>Notes for the student (optional)<input name="notes" maxLength={500} placeholder="Bring your notebook and the last test paper" /></label>
        <button className="btn" disabled={busy}>{busy ? 'Please wait…' : 'Add to the timetable'}</button>
      </form>
    </div>

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
        <button type="button" className="pr-link" disabled={busy} onClick={async () => { if (window.confirm(`Remove "${l.title}"?`)) { if (await run(() => send('/api/admin/playlists', 'DELETE', { id: l.id }), 'Playlist removed.')) setLists((await fetch('/api/playlists').then(x => x.json())).playlists); } }}>Remove</button></li>))}</ul>)}
  </>);
}
