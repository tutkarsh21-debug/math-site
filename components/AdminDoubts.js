'use client';
import { useEffect, useRef, useState } from 'react';
import { Lines } from '@/components/Doubts';

const when = t => new Date(t * 1000).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });
const post = body => fetch('/api/doubts/all', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

// The doubts sent by students, for admin accounts. The AI writes a draft for each new doubt; nothing reaches
// the student until the owner presses "Send answer". classLabels: { 'class-8': 'Class 8' }, titles: { 'class-10/real-numbers': 'Real Numbers' }.
export default function AdminDoubts({ classLabels, titles }) {
  const [state, setState] = useState({ loading: true });
  const [text, setText] = useState({});      // the answer being edited, by doubt id
  const [note, setNote] = useState({});      // the status line under each doubt, by doubt id
  const [busy, setBusy] = useState({});
  const started = useRef(false);

  useEffect(() => {
    (async () => {
      const r = await fetch('/api/doubts/all').catch(() => null);
      if (r?.status === 401) { window.location.href = '/login'; return; }
      if (!r?.ok) { setState({ error: r?.status === 403 ? 'This page is only for the site owner.' : 'Could not load the doubts. Please try again.' }); return; }
      const { doubts } = await r.json();
      setText(Object.fromEntries(doubts.map(d => [d.id, d.answer || d.draft])));
      setState({ doubts });
    })();
  }, []);

  // Asks the AI for a draft of one doubt and puts it in the answer box. Returns false if it failed.
  async function draft(id) {
    setBusy(b => ({ ...b, [id]: true })); setNote(n => ({ ...n, [id]: 'The AI is writing a draft…' }));
    try {
      const r = await post({ id, action: 'draft' }), d = await r.json();
      if (!r.ok) { setNote(n => ({ ...n, [id]: d.error || 'The draft failed.' })); return false; }
      setText(t => ({ ...t, [id]: d.draft })); setNote(n => ({ ...n, [id]: 'AI draft ready. Check it, correct it and send.' }));
      return true;
    } catch { setNote(n => ({ ...n, [id]: 'Could not reach the server.' })); return false; }
    finally { setBusy(b => ({ ...b, [id]: false })); }
  }
  // New doubts that have no draft yet get one automatically, one after another. The queue stops at the first failure.
  useEffect(() => {
    if (!state.doubts || started.current) return;
    started.current = true;
    (async () => { for (const d of state.doubts) if (!d.answered_at && !d.draft && !(await draft(d.id))) break; })();
  }, [state.doubts]);

  async function send(id) {
    setBusy(b => ({ ...b, [id]: true }));
    try {
      const r = await post({ id, action: 'answer', answer: text[id] || '' }), d = await r.json();
      if (!r.ok) { setNote(n => ({ ...n, [id]: d.error || 'The answer was not sent.' })); return; }
      setState(s => ({ doubts: s.doubts.map(x => x.id === id ? { ...x, answer: text[id].trim(), answered_at: Math.floor(Date.now() / 1000) } : x) }));
      setNote(n => ({ ...n, [id]: 'Sent. The student can now see this answer.' }));
    } catch { setNote(n => ({ ...n, [id]: 'Could not reach the server.' })); }
    finally { setBusy(b => ({ ...b, [id]: false })); }
  }

  if (state.loading) return <p className="muted">Loading…</p>;
  if (state.error) return <p className="error">{state.error}</p>;
  const list = state.doubts;
  if (!list.length) return <p className="muted">No doubts yet.</p>;
  const open = list.filter(d => !d.answered_at).length;
  return (<>
    <p className="muted">{open} waiting for an answer, {list.length - open} answered. Students see an answer only after you press Send.</p>
    {list.map(d => (<div key={d.id} className="card doubt">
      <p className="muted small">{when(d.created_at)} · {d.name} · {classLabels[d.cls] || d.cls} {d.board}{titles[d.chapter] ? ` · ${titles[d.chapter]}` : ''} · <span className={`tag${d.answered_at ? ' ready' : ''}`}>{d.answered_at ? 'Answered' : 'Waiting'}</span></p>
      <div className="doubt-q"><Lines text={d.question} /></div>
      {!!d.has_photo && <a href={`/api/doubts/photo?id=${d.id}`} target="_blank" rel="noopener"><img className="doubt-photo" src={`/api/doubts/photo?id=${d.id}`} alt="Photo attached to the doubt" loading="lazy" /></a>}
      <label className="doubt-edit">Answer (maths between $ signs, **bold** for the final answer, one step per line)
        <textarea rows={8} maxLength={4000} value={text[d.id] || ''} onChange={e => setText({ ...text, [d.id]: e.target.value })} /></label>
      {text[d.id]?.trim() && <div className="why"><b>Preview</b><Lines text={text[d.id]} /></div>}
      {note[d.id] && <p className="muted small" role="status">{note[d.id]}</p>}
      <div className="cta-row">
        <button className="btn btn-sm" disabled={busy[d.id] || !text[d.id]?.trim()} onClick={() => send(d.id)}>{d.answered_at ? 'Update answer' : 'Send answer'}</button>
        <button className="btn btn-sm btn-outline" disabled={busy[d.id]} onClick={() => draft(d.id)}>{d.draft || text[d.id] ? 'New AI draft' : 'AI draft'}</button>
      </div>
    </div>))}
  </>);
}
