'use client';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { clock, until } from '@/lib/studio';

const CLS = { 'class-8': 'Class 8', 'class-9': 'Class 9', 'class-10': 'Class 10' };
const DAY = 86400;
// Monday 00:00 of the week that is `offset` weeks from this one, as unix seconds (the week starts on Monday).
const weekStart = offset => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + offset * 7); return Math.floor(d.getTime() / 1000); };
const dayKey = t => { const d = new Date(t * 1000); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };
const fmtDay = (t, o) => new Date(t * 1000).toLocaleDateString('en-IN', o);

// The weekly timetable. scope 'live': the live classes, for everyone. scope 'mine': a logged-in student's live and 1-to-1 classes (the owner sees
// every class). scope 'admin': the owner's manager (every class, click one to change it: onSelect). The whole week is shown, with the
// arrows to move between weeks; cancelled and moved classes are marked. Wide boxes show seven columns, narrow ones a list by day.
export default function Timetable({ scope = 'mine', title = 'Timetable', only = '', empty = 'No classes this week.', onSelect, refresh = 0, selected = 0 }) {
  const [offset, setOffset] = useState(0);
  const [state, setState] = useState({ loading: true });
  const [wide, setWide] = useState(false);
  const [, setTick] = useState(0);
  const box = useRef(null);
  const from = weekStart(offset), to = from + 7 * DAY;

  const load = useCallback(() => {
    const url = scope === 'admin' ? `/api/admin/timetable?from=${from}&to=${to}` : `/api/timetable?scope=${scope}&from=${from}&to=${to}`;
    return fetch(url).then(async r => {
      if (r.status === 401) { setState({ login: true }); return; }
      const d = await r.json().catch(() => ({}));
      setState(r.ok ? { now: d.now, base: Date.now(), items: d.items } : { error: true });
    }).catch(() => setState({ error: true }));
  }, [scope, from, to]);
  useEffect(() => { setState(s => (s.items ? { ...s, busy: true } : { loading: true })); load(); }, [load, refresh]);
  useEffect(() => {
    const t = setInterval(() => { setTick(x => x + 1); if (document.visibilityState === 'visible') load(); }, 30000);
    return () => clearInterval(t);
  }, [load]);
  useEffect(() => {
    if (!box.current || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => setWide(e.contentRect.width >= 780));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  const now = state.items ? state.now + Math.round((Date.now() - state.base) / 1000) : 0;
  const items = (state.items || []).filter(i => !only || i.kind === only);
  const days = Array.from({ length: 7 }, (_, i) => ({ t: from + i * DAY, list: [] }));
  for (const i of items) { const d = days.find(x => dayKey(x.t) === dayKey(i.starts_at)); if (d) d.list.push(i); }
  const todayKey = dayKey(now || Math.floor(Date.now() / 1000));

  const card = i => {
    const off = i.status === 'cancelled', status = until(i.starts_at, i.minutes, now), live = !off && status === 'live now';
    const soon = !off && now >= i.starts_at - 900 && now < i.starts_at + i.minutes * 60, done = status === 'finished';
    const who = i.kind === 'live' ? `${i.cls ? CLS[i.cls] : 'All classes'}${i.board ? ` · ${i.board}` : ''}` : (i.student ? `with ${i.student}` : 'your class');
    const inner = (<>
      <span className="wk-time">{clock(i.starts_at)} – {clock(i.starts_at + i.minutes * 60)}</span>
      <b className="wk-title">{i.title}</b>
      <span className="wk-meta">{who}</span>
      <span className="wk-tags">
        <span className={`badge ${i.kind === 'one' ? 'rec' : 'live'}`}>{i.kind === 'one' ? '1-TO-1' : 'LIVE'}</span>
        {off && <span className="wk-flag off">CANCELLED</span>}
        {!off && i.moved ? <span className="wk-flag moved">RESCHEDULED</span> : null}
        {live && <span className="wk-flag on">LIVE NOW</span>}
        {!off && !live && !done && <span className="wk-since">{status}</span>}
      </span>
      {off && i.reason && <span className="wk-reason">{i.reason}</span>}
      {!off && i.notes && <span className="wk-note">{i.notes}</span>}
    </>);
    const cls = `wk-card ${i.kind}${off ? ' off' : ''}${live ? ' now' : ''}${done && !off ? ' done' : ''}${selected === i.id ? ' picked' : ''}`;
    if (scope === 'admin') return <button type="button" key={i.id} className={cls} onClick={() => onSelect?.(i)}>{inner}</button>;
    return (<div key={i.id} className={cls}>{inner}
      {!off && !done && (i.kind === 'one'
        ? <a className={`btn btn-sm${soon ? '' : ' btn-outline'}`} href={`/studio/one-to-one?class=${i.id}`}>{soon ? 'Join class' : 'Details'}</a>
        : <Link className={`btn btn-sm${live ? '' : ' btn-outline'}`} href="/studio/live">{live ? 'Watch live' : 'Open studio'}</Link>)}
    </div>);
  };

  const body = () => {
    if (state.loading) return <p className="muted">Loading the timetable…</p>;
    if (state.login) return <p className="muted"><Link href="/login">Log in</Link> to see your own timetable, with your live and 1-to-1 classes.</p>;
    if (state.error) return <p className="muted">The timetable could not be loaded. Please refresh the page.</p>;
    return (<>
      <div className={`wk-grid${wide ? ' wide' : ''}${state.busy ? ' busy' : ''}`}>
        {days.map(d => {
          const today = dayKey(d.t) === todayKey;
          return (<div key={d.t} className={`wk-day${today ? ' today' : ''}${!d.list.length ? ' empty' : ''}`}>
            <h4><span>{fmtDay(d.t, { weekday: 'short' })}</span><b>{fmtDay(d.t, { day: 'numeric' })}</b>{today && <i>Today</i>}</h4>
            {d.list.length ? d.list.map(card) : <p className="wk-none">No class</p>}
          </div>);
        })}
      </div>
      {!items.length && <p className="muted wk-empty">{offset === 0 ? empty : 'No classes this week.'}</p>}
    </>);
  };

  const range = `${fmtDay(from, { day: 'numeric', month: 'short' })} – ${fmtDay(from + 6 * DAY, { day: 'numeric', month: 'short', year: 'numeric' })}`;
  return (<section className="tt card wk" aria-label={title} ref={box}>
    <div className="wk-head">
      <h3>{title}</h3>
      <div className="wk-nav" role="group" aria-label="Week">
        <button type="button" className="fs-arrow" onClick={() => setOffset(o => o - 1)} aria-label="Previous week">‹</button>
        <span className="wk-range" aria-live="polite">{offset === 0 ? 'This week · ' : offset === 1 ? 'Next week · ' : offset === -1 ? 'Last week · ' : ''}{range}</span>
        <button type="button" className="fs-arrow" onClick={() => setOffset(o => o + 1)} aria-label="Next week">›</button>
        {offset !== 0 && <button type="button" className="pr-link" onClick={() => setOffset(0)}>This week</button>}
      </div>
    </div>
    {body()}
  </section>);
}
