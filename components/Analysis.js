'use client';
import Link from 'next/link';
import { useMemo } from 'react';
import AiReport from '@/components/AiReport';
import { analyse, reportPayload } from '@/lib/analysis';
import { notesFor } from '@/lib/practice/links';

const clock = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const band = p => (p >= 75 ? 'good' : p >= 50 ? 'mid' : 'low');
const ICON = { weak: '!', basics: 'i', good: '★', skip: '→', time: '◷', rush: '»', info: 'i' };

// The analysis under a finished test: where marks were won and lost, how the time went, and what to do next.
// items: one for each question { ch, label, lv, ok, skipped, q, yours, right }. meta: { cls, kind, title, minutes, secs }.
// kind 'practice': links to the notes of a topic come from the practice list. kind 'chapter': the chapter is the page the test belongs to.
export default function Analysis({ items, meta, chapterHref }) {
  const a = useMemo(() => analyse(items, meta), [items, meta]);
  const payload = useMemo(() => reportPayload(items, meta, a), [items, meta, a]);
  const attempted = a.total - a.skipped;
  const needs = a.weak.length ? a.weak : a.topics.filter(t => t.pct < 80).slice(0, 2);

  return (<section className="analysis">
    <h2>Your test analysis</h2>
    <div className="dash-cards">
      <div className="dash-card"><b>{a.acc}%</b><span>Accuracy</span><small>{a.right} right · {a.wrong} wrong · {a.skipped} blank</small></div>
      <div className="dash-card"><b>{attempted}/{a.total}</b><span>Attempted</span></div>
      <div className="dash-card"><b>{clock(a.used)}</b><span>Time used</span><small>{meta.minutes ? `of ${meta.minutes}:00 allowed` : 'no timer'}{a.per ? ` · ${a.per} sec per question` : ''}</small></div>
    </div>

    {a.notes.length > 0 && <ul className="an-notes">{a.notes.map((n, i) => <li key={i} className={`an-${n.kind}`}><span aria-hidden="true">{ICON[n.kind]}</span><p>{n.text}</p></li>)}</ul>}

    <h3>Topic by topic</h3>
    <ul className="pr-bars">{a.topics.map(t => (<li key={t.ch}>
      <div className="pr-bar">
        <span className="pr-name">{t.label}</span>
        <span className="pr-track"><span className={`pr-fill ${band(t.pct)}`} style={{ width: `${Math.max(t.pct, 4)}%` }} /></span>
        <span className="pr-pct">{t.pct}% <span className="muted small">({t.c}/{t.n})</span></span>
      </div>
      <p className="dash-tag small">{!t.enough ? <span className="muted">Only {t.n} question{t.n > 1 ? 's' : ''}, too few to judge.</span>
        : t.pct >= 80 ? <span className="tag ready">Strong</span> : t.pct >= 60 ? <span className="tag">Getting there</span> : <span className="tag weak">Needs more work</span>}</p>
    </li>))}</ul>

    {a.levels.length > 1 && <>
      <h3>By difficulty</h3>
      <div className="an-levels">{a.levels.map(l => (<div key={l.lv} className={`an-level ${band(l.pct)}`}><b>{l.c}/{l.n}</b><span>{l.name}</span></div>))}</div>
    </>}

    {needs.length > 0 && a.acc < 100 && <>
      <h3>What to do next</h3>
      <ul className="an-next">{needs.map(t => {
        const pages = meta.kind === 'chapter' ? (chapterHref ? [{ href: chapterHref, label: 'Notes, formulas and DPP' }] : []) : notesFor(meta.cls, t.ch);
        return (<li key={t.ch}>
          <b>{t.label}</b> <span className="muted small">({t.c}/{t.n} right)</span>
          <div className="cta-row">
            {pages.map(p => <Link key={p.href} className="btn btn-sm btn-outline" href={p.href}>{p.label}</Link>)}
            {meta.kind !== 'chapter' && <Link className="btn btn-sm" href={`/practice?cls=${meta.cls}&ch=${t.ch}`}>Practise this topic</Link>}
          </div>
        </li>);
      })}</ul>
    </>}

    <AiReport payload={payload} title="AI report on this test" />
  </section>);
}
