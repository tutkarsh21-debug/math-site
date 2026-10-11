'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// The picture beside the home page headline: four animated cards that take turns, each showing one part of how MathSetu teaches.
// Every card has a small label (top left), a note (top right), a moving drawing, and a caption that leads to the page about it.
// The motion is plain CSS (see "Hero cards" in globals.css), so it stays sharp and light, and stops for people who prefer less motion.
const TEAL = '#2aa5b5', ORANGE = '#f4a868', GOLD = '#faac00', INK = '#1e2430';
const F = 'Manrope, Inter, sans-serif';

function Live() {
  return (<svg viewBox="0 0 400 250" className="h5-svg">
    <rect className="a-pulse" style={{ animationDelay: '0s' }} x="22" y="40" width="30" height="30" rx="9" fill="#fff4d6" /><rect className="a-pulse" style={{ animationDelay: '.7s' }} x="22" y="80" width="30" height="30" rx="9" fill="#bdeadd" /><rect className="a-pulse" style={{ animationDelay: '1.4s' }} x="22" y="120" width="30" height="30" rx="9" fill="#ffd9a8" />
    <rect x="64" y="14" width="290" height="176" rx="24" fill="#fff" stroke="#8fdad2" strokeWidth="6" />
    <rect x="72" y="22" width="274" height="160" rx="18" fill="#fdf3dc" />
    <rect x="86" y="40" width="46" height="62" rx="6" fill="#f7e2b4" /><path d="M92 58h34M92 70h34M92 82h24" stroke="#e8c887" strokeWidth="3" strokeLinecap="round" />
    <g className="a-bob">
      <path d="M118 182c2-40 22-58 52-58s50 18 52 58z" fill="#3fa7a0" />
      <rect x="160" y="108" width="20" height="22" rx="8" fill="#e8b690" />
      <circle cx="170" cy="92" r="27" fill="#f1c9a5" />
      <path d="M142 90c-2-26 14-38 30-38s30 12 28 36c-6-12-14-18-30-18s-22 8-28 20z" fill="#3a2a2a" />
      <circle className="a-blink" cx="160" cy="94" r="2.6" fill={INK} /><circle className="a-blink" cx="181" cy="94" r="2.6" fill={INK} />
      <path className="a-talk" d="M162 104q9 8 18 0" stroke="#a5523b" strokeWidth="2.8" fill="none" strokeLinecap="round" />
    </g>
    <g className="a-pop"><rect x="206" y="40" width="58" height="30" rx="15" fill="#fff" stroke="#e6dcc2" strokeWidth="2" /><circle className="a-dot" cx="223" cy="55" r="3.4" fill={TEAL} /><circle className="a-dot d2" cx="235" cy="55" r="3.4" fill={TEAL} /><circle className="a-dot d3" cx="247" cy="55" r="3.4" fill={TEAL} /></g>
    <g className="a-nod">
      <rect x="248" y="104" width="104" height="78" rx="14" fill="#d3e5ff" stroke="#8db8f2" strokeWidth="5" />
      <path d="M268 182c1-20 12-28 32-28s31 8 32 28z" fill="#5b8fd8" />
      <circle cx="300" cy="136" r="16" fill="#e3b58f" /><path d="M284 134c-2-14 8-22 16-22s18 8 16 22c-4-8-8-10-16-10s-12 2-16 10z" fill="#2c2222" />
    </g>
    <g><circle className="a-pulse" style={{ animationDelay: '0s' }} cx="150" cy="170" r="11" fill="#cfe1ff" /><circle className="a-pulse" style={{ animationDelay: '.5s' }} cx="182" cy="170" r="11" fill="#ffd9a8" /><circle className="a-pulse" style={{ animationDelay: '1s' }} cx="214" cy="170" r="11" fill="#bdeadd" /></g>
    <rect x="74" y="204" width="200" height="22" rx="11" fill="#fdf0d0" />
    <rect className="a-grow" style={{ animationDelay: '0s' }} x="84" y="211" width="40" height="8" rx="4" fill={TEAL} /><rect className="a-grow" style={{ animationDelay: '.6s' }} x="132" y="211" width="40" height="8" rx="4" fill={GOLD} /><rect className="a-grow" style={{ animationDelay: '1.2s' }} x="180" y="211" width="40" height="8" rx="4" fill="#8fdad2" />
    <g className="a-beat"><rect x="290" y="200" width="62" height="30" rx="15" fill={GOLD} /><path d="M312 208l12 7-12 7z" fill="#fff" /></g>
  </svg>);
}

const LINES = [{ y: 58, t: 'x² − 5x + 6 = 0', c: INK, s: 26 }, { y: 100, t: '(x − 2)(x − 3) = 0', c: '#2f6fd0', s: 22 }, { y: 142, t: 'x = 2   or   x = 3', c: '#1c8a55', s: 22 }];
function Board() {
  return (<svg viewBox="0 0 400 250" className="h5-svg">
    <defs>{LINES.map((l, k) => <clipPath key={k} id={`h5w${k}`}><rect className={`h5-wipe w${k}`} x="46" y={l.y - 32} width="0" height="46" /></clipPath>)}</defs>
    <rect x="34" y="16" width="332" height="190" rx="22" fill="#fff" stroke="#f0e3c0" strokeWidth="4" />
    <path d="M52 66h296M52 108h296M52 150h296M52 192h296" stroke="#f1ead8" strokeWidth="2" />
    {LINES.map((l, k) => <text key={k} clipPath={`url(#h5w${k})`} x="54" y={l.y} fontSize={l.s} fontWeight="800" fill={l.c} fontFamily={F}>{l.t}</text>)}
    <path clipPath="url(#h5w2)" d="M52 150q60 8 150 0" stroke="#d94a3a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <g className="h5-pen"><path d="M0 0l14-14 8 8-14 14-10 2z" fill={ORANGE} /><path d="M14 -14l8 8" stroke="#c97d3a" strokeWidth="3" /></g>
    <g className="a-beat"><circle cx="86" cy="190" r="24" fill={GOLD} /><path d="M80 179l18 11-18 11z" fill="#fff" /></g>
    <g fill={TEAL}>{[8, 18, 12, 26, 16, 30, 10, 22, 14, 28, 12, 20, 8, 16].map((h, i) => <rect key={i} className="a-wave" style={{ animationDelay: `${(i % 7) * 0.12}s` }} x={126 + i * 15} y={190 - h / 2} width="7" height={h} rx="3.5" />)}</g>
  </svg>);
}

function Practice() {
  return (<svg viewBox="0 0 400 250" className="h5-svg">
    <rect className="a-sway" x="80" y="30" width="250" height="170" rx="20" fill="#ffe7b8" transform="rotate(7 205 115)" />
    <rect className="a-sway b" x="66" y="26" width="250" height="170" rx="20" fill="#cfe9e4" transform="rotate(-5 191 111)" />
    <rect x="64" y="28" width="262" height="186" rx="22" fill="#fff" stroke="#f0e3c0" strokeWidth="4" />
    <text x="86" y="60" fontSize="15" fontWeight="800" fill="#8f5500" fontFamily={F}>QUESTION 7</text>
    <rect x="86" y="72" width="200" height="9" rx="4.5" fill="#e6e1d3" /><rect x="86" y="90" width="150" height="9" rx="4.5" fill="#e6e1d3" />
    {['A', 'B', 'C', 'D'].map((l, i) => (<g key={l}>
      <rect className={`a-opt o${i}`} x={86 + (i % 2) * 112} y={116 + Math.floor(i / 2) * 44} width="100" height="34" rx="17" fill="#f6f1e4" stroke="#e6dcc2" strokeWidth="2.5" />
      <text x={104 + (i % 2) * 112} y={139 + Math.floor(i / 2) * 44} fontSize="15" fontWeight="800" fill={INK} fontFamily={F}>{l}</text></g>))}
    <path className="a-check" pathLength="1" d="M170 147l8 8 14-16" stroke="#1c8a55" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <g className="a-spin"><circle cx="326" cy="40" r="26" fill={GOLD} /><path d="M314 40a12 12 0 0 1 20-9M338 40a12 12 0 0 1-20 9" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" /><path d="M334 24v8h-8M318 56v-8h8" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
  </svg>);
}

function Progress() {
  return (<svg viewBox="0 0 400 250" className="h5-svg">
    <path d="M40 176c0-14 40-22 160-22s160 8 160 22-40 30-160 30-160-16-160-30z" fill="#ece8de" /><path d="M40 184c0 14 40 30 160 30s160-16 160-30" fill="none" stroke={ORANGE} strokeWidth="8" />
    {[[116, 44], [166, 70], [216, 98], [266, 126]].map(([x, h], i) => <rect key={x} className="a-barg" style={{ animationDelay: `${0.3 + i * 0.45}s` }} x={x} y={150 - h} width="30" height={h} rx="8" fill={ORANGE} opacity={0.55 + i * 0.15} />)}
    <path className="a-draw" pathLength="1" d="M70 150c40 4 56-30 96-30s56 16 86-8 50-52 82-70" stroke={TEAL} strokeWidth="14" fill="none" strokeLinecap="round" />
    <path className="a-late" d="M326 28l30-4-12 28z" fill={TEAL} />
    <g className="a-twinkle" fill={GOLD}><path d="M92 70l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" /><path d="M350 110l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" /></g>
  </svg>);
}

const CARDS = [
  { label: 'Live now', big: '1:1', note: 'One teacher, one student', cap: 'Live 1-to-1 class', href: '/one-to-one', art: Live },
  { label: 'Whiteboard', big: 'Pen + voice', note: 'Recorded for you', cap: 'Doubt solved on a whiteboard', href: '/doubts', art: Board },
  { label: 'Practice', big: 'Always new', note: 'A fresh test every time', cap: 'Practice that never repeats', href: '/practice', art: Practice },
  { label: 'Progress', big: 'Tracked', note: 'Every test and chapter', cap: 'Improvement over time', href: '/tests', art: Progress },
];

export default function HeroArt() {
  const [i, setI] = useState(0), [hold, setHold] = useState(false);
  useEffect(() => {
    if (hold || (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    const t = setInterval(() => setI(n => (n + 1) % CARDS.length), 6200);
    return () => clearInterval(t);
  }, [hold]);
  return (<div className="hero5-art" role="group" aria-roledescription="carousel" aria-label="How MathSetu teaches"
    onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
    <div className="h5-back" />
    {CARDS.map((c, k) => {
      const Art = c.art, on = k === i;
      return (<div key={c.label} className={`h5-scene${on ? ' on' : ''}`} aria-hidden={!on}>
        <span className="h5-lab"><i />{c.label}</span>
        <span className="h5-chip"><b>{c.big}</b><small>{c.note}</small></span>
        <div className="h5-ill">{on && <Art />}</div>
        <Link className="h5-cap" href={c.href} tabIndex={on ? 0 : -1}>{c.cap}<span aria-hidden="true">→</span></Link>
      </div>);
    })}
    <div className="h5-dots">{CARDS.map((c, k) => <button key={c.label} type="button" className={k === i ? 'on' : ''} aria-label={`Show: ${c.cap}`} onClick={() => setI(k)} />)}</div>
  </div>);
}
