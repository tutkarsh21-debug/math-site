'use client';
import { useEffect, useState } from 'react';
import { Lines } from '@/components/Doubts';
import SolutionPlayer from '@/components/SolutionPlayer';
import Whiteboard from '@/components/Whiteboard';

const when = t => new Date(t * 1000).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

// The teacher's desk: the doubts students have sent, and the whiteboard to solve them on.
// classLabels: { 'class-8': 'Class 8' }, titles: { 'class-10/real-numbers': 'Real Numbers' }.
export default function TeacherDesk({ classLabels, titles }) {
  const [state, setState] = useState({ loading: true });
  const [filter, setFilter] = useState('open');       // open, solved, all
  const [solving, setSolving] = useState(null);        // the doubt on the whiteboard
  const [watching, setWatching] = useState({});        // solutions being played, by doubt id
  const [message, setMessage] = useState('');

  async function load() {
    const r = await fetch('/api/teacher/doubts').catch(() => null);
    if (r?.status === 401) { window.location.href = '/login'; return; }
    if (!r?.ok) { setState({ error: r?.status === 403 ? 'This page is only for the site owner.' : 'Could not load the doubts. Please try again.' }); return; }
    setState({ doubts: (await r.json()).doubts });
  }
  useEffect(() => { load(); const t = setInterval(() => { if (!document.hidden && !solving) load(); }, 60000); return () => clearInterval(t); }, [solving]);

  if (state.loading) return <p className="muted">Loading…</p>;
  if (state.error) return <p className="error">{state.error}</p>;

  if (solving) return (<>
    <p><button type="button" className="pr-link" onClick={() => setSolving(null)}>← Back to the doubts</button></p>
    <Whiteboard key={solving.id} doubt={solving} onCancel={() => setSolving(null)}
      onSent={async () => { setSolving(null); setMessage('Sent. The student will see "Doubt resolved" the next time they open the site.'); await load(); }} />
  </>);

  const all = state.doubts, open = all.filter(d => !d.answered_at).length;
  const list = all.filter(d => filter === 'all' || (filter === 'open' ? !d.answered_at : !!d.answered_at));
  return (<>
    <div className="chips" role="tablist" style={{ marginTop: 0 }}>
      {[['open', `Waiting (${open})`], ['solved', `Solved (${all.length - open})`], ['all', 'All']].map(([k, l]) => <button key={k} type="button" role="tab" aria-selected={filter === k} className={`chip${filter === k ? ' on' : ''}`} onClick={() => setFilter(k)}>{l}</button>)}
    </div>
    {message && <p className="muted" role="status" style={{ marginTop: '1rem' }}>{message}</p>}
    {!list.length && <p className="muted" style={{ marginTop: '1rem' }}>{filter === 'open' ? 'No doubts are waiting. Well done!' : 'Nothing here yet.'}</p>}
    {list.map(d => (<div key={d.id} className="card doubt">
      <p className="muted small">{when(d.created_at)} · {d.name} · {classLabels[d.cls] || d.cls} {d.board}{titles[d.chapter] ? ` · ${titles[d.chapter]}` : ''} · <span className={`tag${d.answered_at ? ' ready' : ''}`}>{d.answered_at ? 'Solved' : 'Waiting'}</span>{d.solver ? ` by ${d.solver}` : ''}</p>
      <div className="doubt-q"><Lines text={d.question} /></div>
      {!!d.has_photo && <a href={`/api/doubts/photo?id=${d.id}`} target="_blank" rel="noopener"><img className="doubt-photo" src={`/api/doubts/photo?id=${d.id}`} alt="Photo attached to the doubt" loading="lazy" /></a>}
      {!!d.answered_at && !d.has_solution && <div className="why"><b>Typed answer</b><Lines text={d.answer} /></div>}
      {!!d.has_solution && (watching[d.id]
        ? <SolutionPlayer doubtId={d.id} photo={d.has_photo ? `/api/doubts/photo?id=${d.id}` : ''} />
        : <p><button type="button" className="btn btn-sm btn-outline" onClick={() => setWatching(w => ({ ...w, [d.id]: true }))}>Watch the solution</button></p>)}
      <div className="cta-row">
        <button type="button" className="btn btn-sm" onClick={() => { setMessage(''); setSolving(d); }}>{d.has_solution ? 'Solve again on the whiteboard' : 'Solve on the whiteboard'}</button>
      </div>
    </div>))}
  </>);
}
