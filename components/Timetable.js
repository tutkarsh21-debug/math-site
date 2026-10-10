'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { clock, until } from '@/lib/studio';

const CLS = { 'class-8': 'Class 8', 'class-9': 'Class 9', 'class-10': 'Class 10' };
const dayName = (t, today) => {
  const d = new Date(t * 1000), n = new Date(today * 1000), key = x => `${x.getFullYear()}-${x.getMonth()}-${x.getDate()}`;
  const tomorrow = new Date(n.getTime() + 86400000);
  if (key(d) === key(n)) return 'Today';
  if (key(d) === key(tomorrow)) return 'Tomorrow';
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
};

// A timetable box. scope 'live': the coming live classes, for everyone. scope 'mine': a logged-in student's live classes and 1-to-1 classes
// (for the owner, every class). Statuses ("live now", "starts in 20 min") update by themselves.
export default function Timetable({ scope = 'mine', title = 'Timetable', only = '', empty = 'No classes are scheduled yet.' }) {
  const [state, setState] = useState({ loading: true });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let dead = false;
    const load = () => fetch(`/api/timetable?scope=${scope}`).then(async r => {
      if (r.status === 401) { if (!dead) setState({ login: true }); return; }
      const d = await r.json();
      if (!dead) setState(r.ok ? { now: d.now, base: Date.now(), items: d.items, owner: !!d.owner } : { error: true });
    }).catch(() => { if (!dead) setState({ error: true }); });
    load();
    const t = setInterval(() => { setTick(x => x + 1); if (document.visibilityState === 'visible') load(); }, 30000);
    return () => { dead = true; clearInterval(t); };
  }, [scope]);

  const body = () => {
    if (state.loading) return <p className="muted">Loading the timetable…</p>;
    if (state.login) return <p className="muted"><Link href="/login">Log in</Link> to see your own timetable, with your live and 1-to-1 classes.</p>;
    if (state.error) return <p className="muted">The timetable could not be loaded. Please refresh the page.</p>;
    const now = state.now + Math.round((Date.now() - state.base) / 1000);
    const items = state.items.filter(i => !only || i.kind === only);
    if (!items.length) return <p className="muted">{empty}</p>;
    const days = [];
    for (const i of items) { const k = dayName(i.starts_at, now); const last = days[days.length - 1]; if (last && last.k === k) last.list.push(i); else days.push({ k, list: [i] }); }
    return days.map(d => (<div key={d.k} className="tt-day"><h4>{d.k}</h4>
      {d.list.map(i => {
        const status = until(i.starts_at, i.minutes, now), live = status === 'live now', soon = now >= i.starts_at - 900 && now < i.starts_at + i.minutes * 60;
        return (<div key={i.id} className={`tt-row${live ? ' on' : ''}`}>
          <b className="tt-time">{clock(i.starts_at)}</b>
          <div className="tt-main">
            <span className="tt-title">{i.title}</span>
            <span className="tt-meta"><span className={`badge ${i.kind === 'one' ? 'rec' : 'live'}`}>{i.kind === 'one' ? '1-TO-1' : 'LIVE'}</span>{' '}
              {i.kind === 'live' ? `${i.cls ? CLS[i.cls] : 'All classes'}${i.board ? ` · ${i.board}` : ''}` : (i.student ? `with ${i.student}` : 'your class')} · {i.minutes} min · <i className={live ? 'tt-live' : ''}>{status}</i></span>
            {i.notes && <span className="tt-note">{i.notes}</span>}
          </div>
          {status !== 'finished' && (i.kind === 'one'
            ? <a className={`btn btn-sm${soon ? '' : ' btn-outline'}`} href={`/studio/one-to-one?class=${i.id}`}>{soon ? 'Join class' : 'Details'}</a>
            : <Link className={`btn btn-sm${live ? '' : ' btn-outline'}`} href="/studio/live">{live ? 'Watch live' : 'Open studio'}</Link>)}
        </div>);
      })}</div>));
  };
  return (<section className="tt card" aria-label={title}><h3>{title}</h3>{body()}</section>);
}
