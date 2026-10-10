'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import TalkToUs from '@/components/TalkToUs';
import { O2O_FEATURES } from '@/lib/oneToOne';

const TAGS = ['Live 1-to-1 class', 'A plan from the gaps', 'Doubts between classes', 'Practice that fits', 'Progress you can see'];

// A small drawing for each feature, made of HTML and CSS only. The numbers and names are samples.
function Visual({ i }) {
  if (i === 0) return (<div className="fsv fsv-class" aria-hidden="true">
    <span className="fsv-pill"><i /> LIVE 1:1</span>
    <div className="fsv-people"><b className="av">T</b><svg viewBox="0 0 160 60" preserveAspectRatio="none"><path d="M4 56 Q80 -22 156 56" /></svg><b className="av s">S</b></div>
    <div className="fsv-sheet"><i /><i className="s" /><i /><em>2x² − 7x + 3 = 0</em></div>
  </div>);
  if (i === 1) return (<div className="fsv fsv-plan" aria-hidden="true">
    <div className="fsv-chips"><span className="ok">Fractions</span><span className="ok">Algebra basics</span><span className="gap">Factorising<small>missing idea</small></span><span>Quadratics</span></div>
    <ol className="fsv-steps"><li><b>1</b> Fix factorising</li><li><b>2</b> Solve quadratics</li><li><b>3</b> Word problems</li></ol>
  </div>);
  if (i === 2) return (<div className="fsv fsv-doubt" aria-hidden="true">
    <div className="fsv-phone">
      <small>Doubt · Quadratic Equations</small>
      <div className="fsv-photo"><i /><i className="s" /><i /></div>
      <span className="fsv-ok">Doubt resolved</span>
      <span className="fsv-play">▶ Watch your teacher's solution</span>
    </div>
  </div>);
  if (i === 3) return (<div className="fsv fsv-quiz" aria-hidden="true">
    <small>Chapter test · Quadratic Equations</small>
    <p>The roots of x² − 5x + 6 = 0 are</p>
    <span>1 and 6</span><span className="on">2 and 3</span><span>−2 and −3</span>
    <em>New practice test ↻</em>
  </div>);
  return (<div className="fsv fsv-bars" aria-hidden="true">
    <small>Your topics · weakest first</small>
    <div><span>Trigonometry</span><i><b style={{ width: '46%' }} className="low" /></i><em>46%</em></div>
    <div><span>Quadratics</span><i><b style={{ width: '78%' }} className="mid" /></i><em>78%</em></div>
    <div><span>Probability</span><i><b style={{ width: '91%' }} className="good" /></i><em>91%</em></div>
    <p>Read the notes on Trigonometry next</p>
  </div>);
}

// The 1-to-1 features as a stack of cards: one in front, two waiting behind. They turn by themselves every few seconds
// (not when the pointer is on them, and not for people who asked for less motion), or when a dot or button is pressed.
export default function FeatureStack() {
  const n = O2O_FEATURES.length;
  const [i, setI] = useState(0), [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI(x => (x + 1) % n), 6500);
    return () => clearInterval(t);
  }, [paused, n]);
  return (<div className="fs" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
    <div className="fs-stack">
      {O2O_FEATURES.map((f, k) => {
        const d = (k - i + n) % n;
        return (<article key={f.title} className="fs-card" data-d={d > 2 ? 3 : d} aria-hidden={d !== 0} aria-label={`${k + 1} of ${n}`}>
          <Visual i={k} />
          <div className="fs-text">
            <span className="fs-tag">{TAGS[k]}</span>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        </article>);
      })}
    </div>
    <div className="fs-nav">
      <button type="button" className="fs-arrow" onClick={() => setI((i + n - 1) % n)} aria-label="Previous feature">‹</button>
      <div className="fs-dots" role="tablist" aria-label="Choose a feature">
        {O2O_FEATURES.map((f, k) => <button key={f.title} type="button" role="tab" aria-selected={k === i} aria-label={f.title} className={k === i ? 'on' : ''} onClick={() => setI(k)} />)}
      </div>
      <button type="button" className="fs-arrow" onClick={() => setI((i + 1) % n)} aria-label="Next feature">›</button>
    </div>
    <div className="cta-row fs-cta">
      <TalkToUs>Ask about a trial class</TalkToUs>
      <Link className="btn h4-soft" href="/one-to-one">How 1-to-1 works</Link>
    </div>
  </div>);
}
