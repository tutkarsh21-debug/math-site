'use client';
import { useEffect, useMemo, useState } from 'react';
import Test from '@/components/Test';
import { ALL, PRACTICE_CLASSES, chaptersOf } from '@/lib/practice';
import { buildTest } from '@/lib/practice/util';

const LEVELS = [['0', 'Easy'], ['1', 'Medium'], ['2', 'Hard'], ['mixed', 'Mixed']];
const COUNTS = [5, 10, 15, 20, 30];
const KEY = 'ms-practice-history';
const readHistory = () => { try { const h = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(h) ? h : []; } catch { return []; } };
const writeHistory = h => { try { localStorage.setItem(KEY, JSON.stringify(h.slice(-200))); } catch {} };
const LV = ['Easy', 'Medium', 'Hard'];

// Test generator for self practice: pick class, chapters, difficulty and length; every test is built fresh from templates.
export default function PracticeBuilder() {
  const [cls, setCls] = useState(PRACTICE_CLASSES[0].key);
  const [picked, setPicked] = useState([]);              // chapter slugs
  const [level, setLevel] = useState('1');
  const [count, setCount] = useState(10);
  const [timed, setTimed] = useState(true);
  const [run, setRun] = useState(null);                  // { test, key, title } while a test is on screen
  const [history, setHistory] = useState([]);

  const chapters = useMemo(() => chaptersOf(cls), [cls]);
  useEffect(() => { setHistory(readHistory()); }, []);

  const toggle = slug => setPicked(p => (p.includes(slug) ? p.filter(s => s !== slug) : [...p, slug]));
  const chosen = chapters.filter(c => picked.includes(c.slug));

  function generate() {
    if (!chosen.length) return;
    const seed = (Date.now() ^ Math.floor(Math.random() * 4294967296)) >>> 0;
    const qs = buildTest(chosen, level === 'mixed' ? 'mixed' : +level, count, seed);
    if (!qs.length) return;
    const mins = timed ? Math.ceil(qs.length * 1.5) : 0;
    const lvName = level === 'mixed' ? 'Mixed levels' : LV[+level];
    setRun({ test: { minutes: mins, qs }, key: seed, title: `Practice test: ${chosen.length === 1 ? chosen[0].label : `${chosen.length} chapters`} (${lvName})` });
    window.scrollTo({ top: 0 });
  }

  function onFinish(results, meta = {}) {
    const byCh = {};
    results.forEach(r => { const e = byCh[r.ch] || (byCh[r.ch] = { ch: r.ch, label: r.label, n: 0, c: 0 }); e.n++; if (r.ok) e.c++; });
    const entry = { t: Date.now(), cls, level, score: results.filter(r => r.ok).length, total: results.length, items: Object.values(byCh) };
    const next = [...readHistory(), entry];
    writeHistory(next); setHistory(next);
    // A logged-in student's test is also saved on the server, for the dashboards. Anyone else keeps it on this device only.
    if (window.__msUser) fetch('/api/practice', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ cls, level, minutes: meta.minutes || 0, secs: meta.secs || 0, skipped: meta.skipped || 0, items: Object.values(byCh).map(({ ch, label, n, c }) => ({ ch, label, n, c })) }), keepalive: true }).catch(() => {});
  }

  if (run) return (<>
    <p className="small muted" style={{ marginBottom: '.8rem' }}>Every question in this test was generated just now, so you will not see the same test twice.</p>
    <Test key={run.key} id={`practice-${run.key}`} title={run.title} test={run.test} back="/practice"
      practice={{ onFinish, onNew: generate, onBack: () => setRun(null) }} />
    <History history={history} cls={cls} onPick={slug => { setPicked([slug]); setRun(null); }} onClear={() => { writeHistory([]); setHistory([]); }} />
  </>);

  return (<>
    <div className="card pr-form">
      <h2>Build your test</h2>
      <div className="pr-step"><b>1. Class</b>
        <div className="chips">{PRACTICE_CLASSES.map(c => <button key={c.key} type="button" className={`chip${cls === c.key ? ' on' : ''}`} onClick={() => { setCls(c.key); setPicked([]); }}>{c.label}</button>)}</div>
      </div>
      <div className="pr-step"><b>2. Chapters <span className="muted small">({chosen.length} selected)</span></b>
        <div className="chips">
          {chapters.map(c => <button key={c.slug} type="button" aria-pressed={picked.includes(c.slug)} className={`chip${picked.includes(c.slug) ? ' on' : ''}`} onClick={() => toggle(c.slug)}>{c.label}</button>)}
        </div>
        <p className="small"><button type="button" className="pr-link" onClick={() => setPicked(chapters.map(c => c.slug))}>Select all</button> · <button type="button" className="pr-link" onClick={() => setPicked([])}>Clear</button></p>
      </div>
      <div className="pr-step"><b>3. Difficulty</b>
        <div className="chips">{LEVELS.map(([v, l]) => <button key={v} type="button" className={`chip${level === v ? ' on' : ''}`} onClick={() => setLevel(v)}>{l}</button>)}</div>
        <p className="small muted">{level === '0' ? 'Direct formula and one-step questions.' : level === '1' ? 'Standard board-exam style, two or three steps.' : level === '2' ? 'Multi-step, application and HOTS style questions.' : 'A blend of easy, medium and hard questions.'}</p>
      </div>
      <div className="pr-step"><b>4. Length</b>
        <div className="chips">{COUNTS.map(n => <button key={n} type="button" className={`chip${count === n ? ' on' : ''}`} onClick={() => setCount(n)}>{n} questions</button>)}</div>
        <label className="pr-check"><input type="checkbox" checked={timed} onChange={e => setTimed(e.target.checked)} /> Timed test ({Math.ceil(count * 1.5)} minutes)</label>
      </div>
      <div className="cta-row">
        <button type="button" className="btn pr-go" disabled={!chosen.length} onClick={generate}>Generate my test</button>
        {!chosen.length && <span className="muted small" style={{ alignSelf: 'center' }}>Pick at least one chapter.</span>}
      </div>
    </div>
    <History history={history} cls={cls} onPick={slug => setPicked([slug])} onClear={() => { writeHistory([]); setHistory([]); }} />
  </>);
}

function History({ history, cls, onPick, onClear }) {
  const stats = useMemo(() => {
    const by = {};
    history.forEach(h => h.items.forEach(i => { const e = by[i.ch] || (by[i.ch] = { ch: i.ch, label: i.label, n: 0, c: 0 }); e.n += i.n; e.c += i.c; }));
    return Object.values(by).map(e => ({ ...e, pct: Math.round((100 * e.c) / e.n) })).sort((a, b) => a.pct - b.pct);
  }, [history]);
  if (!history.length) return (<div className="card pr-hist"><h2>Your progress</h2><p className="muted">Take a test and your scores will show up here, with the chapters that need more practice at the top. Saved on this device only.</p></div>);
  const recent = history.slice(-5).reverse();
  return (<div className="card pr-hist">
    <h2>Your progress</h2>
    <p className="muted small">Weakest chapters first. Tap one to practise it again.</p>
    <ul className="pr-bars">
      {stats.map(s => (<li key={s.ch}>
        <button type="button" className="pr-bar" onClick={() => onPick(s.ch)} aria-label={`${s.label}: ${s.pct} percent. Practise this chapter.`}>
          <span className="pr-name">{s.label}</span>
          <span className="pr-track"><span className={`pr-fill ${s.pct >= 75 ? 'good' : s.pct >= 50 ? 'mid' : 'low'}`} style={{ width: `${Math.max(s.pct, 4)}%` }} /></span>
          <span className="pr-pct">{s.pct}% <span className="muted small">({s.c}/{s.n})</span></span>
        </button>
      </li>))}
    </ul>
    <h3 style={{ marginTop: '1.2rem' }}>Recent tests</h3>
    <ul className="pr-recent">
      {recent.map(h => (<li key={h.t}><span>{new Date(h.t).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {h.items.length === 1 ? h.items[0].label : `${h.items.length} chapters`}</span><b>{h.score} / {h.total}</b></li>))}
    </ul>
    <p className="small"><button type="button" className="pr-link" onClick={() => { if (window.confirm('Clear your practice history from this device?')) onClear(); }}>Clear history</button></p>
  </div>);
}
