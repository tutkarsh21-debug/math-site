'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const STEPS = [
  { t: 'Send your doubt', c: 'Take a photo of the question and add a line about where you are stuck. Only you and your teacher can see it.' },
  { t: 'Your teacher writes it out', c: 'The teacher opens your doubt and solves it on a whiteboard with a pen, one step at a time.' },
  { t: 'It is recorded, with voice', c: 'Every stroke and the teacher\'s voice are saved, so you can pause, go back and watch it again.' },
  { t: 'You are told it is done', c: 'A bell and a "Doubt resolved" card appear in your account. Press play whenever you like.' },
];
const LINES = [['2x² − 7x + 3 = 0', ''], ['2x² − 6x − x + 3 = 0', ''], ['2x(x − 3) − 1(x − 3) = 0', 'r'], ['(2x − 1)(x − 3) = 0', 'b'], ['x = ½  or  x = 3', 'g']];

// "Watch a doubt get solved": four steps that play by themselves (a sample, not a real student's doubt).
export default function WhiteboardStory() {
  const [s, setS] = useState(0), [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setS(x => (x + 1) % STEPS.length), 5200);
    return () => clearInterval(t);
  }, [paused]);
  return (<div className="wbs" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
    <div className="wbs-step" aria-live="polite"><b>STEP {String(s + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}</b><span>{STEPS[s].t}</span></div>
    <div className="wbs-card">
      <div className="wbs-scene" key={s} aria-hidden="true">
        {s === 0 && <div className="wbs-send"><div className="wbs-photo"><em>Q5. Solve 2x² − 7x + 3 = 0</em><i /><i className="s" /></div><span className="wbs-btn">Send doubt ➤</span></div>}
        {s >= 1 && s <= 2 && (<div className="wbs-board">
          {s === 2 && <span className="wbs-rec"><i />REC 0:42<span className="wbs-wave"><u /><u /><u /><u /><u /><u /><u /></span></span>}
          {LINES.map(([txt, col], k) => <p key={txt} className={`wbs-line ${col}`} style={{ animationDelay: `${s === 1 ? k * 0.8 : 0}s`, animationDuration: s === 1 ? '.9s' : '0s' }}>{txt}</p>)}
          {s === 1 && <span className="wbs-pen" />}
        </div>)}
        {s === 3 && <div className="wbs-done"><span className="wbs-bell"><svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor"><path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 0 0-5.5-6.84V3.5a1.5 1.5 0 0 0-3 0v.66A7 7 0 0 0 5 11v5l-2 2v1h18v-1l-2-2Z" /></svg><b>1</b></span>
          <div className="wbs-note"><b>Doubt resolved</b><span>Quadratic Equations · just now</span><em>▶ Watch your teacher's solution</em></div></div>}
      </div>
      <div className="wbs-caption"><span className="wbs-dot" />{STEPS[s].c}</div>
    </div>
    <div className="fs-dots wbs-dots" role="tablist" aria-label="Choose a step">
      {STEPS.map((x, k) => <button key={x.t} type="button" role="tab" aria-selected={k === s} aria-label={`Step ${k + 1}: ${x.t}`} className={k === s ? 'on' : ''} onClick={() => setS(k)} />)}
    </div>
    <p className="center wbs-more"><Link className="btn btn-sun" href="/doubts">Ask a doubt</Link></p>
  </div>);
}
