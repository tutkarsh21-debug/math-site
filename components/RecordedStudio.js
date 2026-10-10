'use client';
import { useEffect, useState } from 'react';

const CLS = { 'class-8': 'Class 8', 'class-9': 'Class 9', 'class-10': 'Class 10', '': 'All classes' };

// The recorded studio: the playlists of the MathSetu YouTube channel, by class. The owner adds playlists in the Studio manager.
export default function RecordedStudio() {
  const [lists, setLists] = useState(null);
  const [cls, setCls] = useState('all');
  const [open, setOpen] = useState(null);
  useEffect(() => { fetch('/api/playlists').then(r => r.json()).then(d => setLists(d.playlists)).catch(() => setLists([])); }, []);
  if (lists === null) return <p className="muted">Loading the lectures…</p>;
  if (!lists.length) return (<div className="card auth" style={{ maxWidth: 'none' }}>
    <h3>Lectures are being added</h3>
    <p className="muted">The recorded lectures will appear here, class by class, as soon as the first playlists are ready on the MathSetu YouTube channel.</p>
    <p><a className="btn" href="https://www.youtube.com/@MathSetu2026" target="_blank" rel="noopener">Open the YouTube channel</a></p>
  </div>);
  const classes = [...new Set(lists.map(l => l.cls))];
  const shown = lists.filter(l => cls === 'all' || l.cls === cls || l.cls === '');
  const current = shown.find(l => l.id === open) || shown[0];
  return (<div className="rec-studio">
    <div className="chips" role="tablist" aria-label="Class">
      <button type="button" className={`chip${cls === 'all' ? ' on' : ''}`} onClick={() => { setCls('all'); setOpen(null); }}>All</button>
      {classes.filter(c => c).map(c => <button key={c} type="button" className={`chip${cls === c ? ' on' : ''}`} onClick={() => { setCls(c); setOpen(null); }}>{CLS[c] || c}</button>)}
    </div>
    <div className="rec-grid">
      <div className="player"><iframe key={current?.playlist} src={`https://www.youtube.com/embed/videoseries?list=${current?.playlist}&rel=0`} title={current?.title} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen loading="lazy" /></div>
      <ul className="rec-list">
        {shown.map(l => (<li key={l.id}><button type="button" className={current?.id === l.id ? 'on' : ''} onClick={() => setOpen(l.id)}><b>{l.title}</b><small>{CLS[l.cls] || l.cls}</small></button></li>))}
      </ul>
    </div>
  </div>);
}
