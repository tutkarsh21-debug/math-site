'use client';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

// Text with $maths$ and **bold**, as in the notes.
export function Tex({ text }) {
  let bold = false;
  const html = text.split(/(\$[^$]+\$)/).map(part =>
    part.startsWith('$') && part.endsWith('$') && part.length > 2
      ? katex.renderToString(part.slice(1, -1).replace(/°/g, '^\\circ'), { throwOnError: false, strict: 'ignore' })
      : part.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\*\*/g, () => (bold = !bold) ? '<strong>' : '</strong>')).join('');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

const clock = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
// A test in progress is kept in the browser, so a refresh or a dropped connection does not lose the answers.
const keep = id => `ms-test-${id}`;
const load = id => { try { const d = JSON.parse(localStorage.getItem(keep(id))); return d && d.endsAt > Date.now() ? d : null; } catch { return null; } };
const store = (id, d) => { try { d ? localStorage.setItem(keep(id), JSON.stringify(d)) : localStorage.removeItem(keep(id)); } catch {} };

// One online test. id: 'class-10/real-numbers'. test: { minutes, qs: [{ q, o: [options], a: index of the answer, w: why }] }.
export default function Test({ id, title, test, back }) {
  const [stage, setStage] = useState('intro');       // intro, running, done
  const [only, setOnly] = useState(null);            // null for the whole test, or the numbers of the questions being retried
  const [picked, setPicked] = useState({});          // by position in the questions shown
  const [endsAt, setEndsAt] = useState(0);
  const [left, setLeft] = useState(test.minutes * 60);
  const [saved, setSaved] = useState('');
  const [resume, setResume] = useState(null);
  const top = useRef(null), pickedRef = useRef({}), finished = useRef(false);

  const idx = only || test.qs.map((_, i) => i);      // numbers of the questions shown
  const qs = idx.map(i => test.qs[i]);
  const total = qs.length;
  const score = qs.filter((q, i) => picked[i] === q.a).length;
  const answered = Object.keys(picked).length;

  useEffect(() => { setResume(load(id)); }, [id]);

  useEffect(() => {
    if (stage !== 'running') return;
    const tick = () => { const s = Math.ceil((endsAt - Date.now()) / 1000); setLeft(Math.max(0, s)); if (s <= 0) finish(); };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [stage, endsAt]);

  function begin(subset, answers, end) {
    finished.current = false;
    setOnly(subset); setPicked(answers); pickedRef.current = answers;
    setEndsAt(end); setLeft(Math.ceil((end - Date.now()) / 1000)); setSaved(''); setStage('running');
    if (!subset) store(id, { picked: answers, endsAt: end });
  }
  function start(subset = null) {
    const mins = subset ? Math.max(3, Math.ceil(subset.length * 1.5)) : test.minutes;
    begin(subset, {}, Date.now() + mins * 60000);
  }
  function resumeTest() { begin(null, resume.picked, resume.endsAt); setResume(null); }
  function choose(i, j) {
    const next = { ...pickedRef.current, [i]: j };
    pickedRef.current = next; setPicked(next);
    if (!only) store(id, { picked: next, endsAt });
  }
  function submit() {
    const open = total - Object.keys(pickedRef.current).length;
    if (open > 0 && !window.confirm(`You have ${open} unanswered question${open > 1 ? 's' : ''}. Submit the test now?`)) return;
    finish();
  }
  async function finish() {
    if (finished.current) return;
    finished.current = true;
    store(id, null);
    setStage('done');
    top.current?.scrollIntoView();
    if (only) { setSaved('retry'); return; }                  // only the whole test is saved to My tests
    const s = test.qs.filter((q, i) => pickedRef.current[i] === q.a).length;
    try {
      const r = await fetch('/api/results', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ test: id, score: s }) });
      setSaved(r.ok ? 'yes' : r.status === 401 ? 'login' : 'no');
    } catch { setSaved('no'); }
  }

  if (stage === 'intro') return (<div className="card auth">
    <h2>{title}</h2>
    <ul>
      <li>{test.qs.length} multiple-choice questions, 1 mark each</li>
      <li>Time allowed: {test.minutes} minutes. The test is submitted automatically when time is over.</li>
      <li>No negative marking. You see the answers and explanations after you submit.</li>
      <li>Your answers are kept on this device, so a refresh will not lose them.</li>
    </ul>
    <div className="cta-row">
      {resume && <button className="btn" onClick={resumeTest}>Resume your test ({clock(Math.ceil((resume.endsAt - Date.now()) / 1000))} left)</button>}
      <button className={resume ? 'btn btn-outline' : 'btn'} onClick={() => start()}>{resume ? 'Start again' : 'Start test'}</button>
    </div>
  </div>);

  const done = stage === 'done';
  const wrong = idx.filter((n, i) => picked[i] !== test.qs[n].a);
  return (<div ref={top}>
    {done
      ? <div className="card auth result">
          <h2>Your score: {score} / {total}</h2>
          <p className="muted">{score === total ? 'Full marks. Well done!' : score >= total * 0.7 ? 'Good work. Check the questions you missed below.' : 'Go through the explanations below, revise the notes, and try again.'}</p>
          {saved === 'yes' && <p className="muted small">Saved to <Link href="/account">My tests</Link>.</p>}
          {saved === 'login' && <p className="muted small"><Link href="/login">Log in</Link> before the next test to keep your scores.</p>}
          {saved === 'retry' && <p className="muted small">This was a practice round, so it is not saved to My tests.</p>}
          <div className="cta-row">
            {wrong.length > 0 && <button className="btn" onClick={() => start(wrong)}>Retry the {wrong.length} I missed</button>}
            <button className={wrong.length > 0 ? 'btn btn-outline' : 'btn'} onClick={() => start()}>{only ? 'Take the full test' : 'Try the full test again'}</button>
            <Link className="btn btn-outline" href={back}>Back to the chapter</Link>
            <Link className="btn btn-outline" href="/tests">All tests</Link>
          </div>
        </div>
      : <>
          <div className="timer" aria-live="off"><span>Answered {answered} of {total}</span><b className={left < 60 ? 'low' : ''}>{clock(left)}</b></div>
          <nav className="qnav" aria-label="Jump to a question">
            {qs.map((_, i) => <a key={i} href={`#q${i}`} className={picked[i] !== undefined ? 'on' : ''}>{i + 1}</a>)}
          </nav>
        </>}
    <ol className="quiz">
      {qs.map((q, i) => (<li key={idx[i]} id={`q${i}`}>
        <p className="qtext"><Tex text={q.q} /></p>
        {q.o.map((opt, j) => {
          const cls = done ? (j === q.a ? 'right' : picked[i] === j ? 'wrong' : '') : picked[i] === j ? 'on' : '';
          return (<label key={j} className={`opt ${cls}`}>
            <input type="radio" name={`q${i}`} checked={picked[i] === j} disabled={done} onChange={() => choose(i, j)} />
            <Tex text={opt} />
          </label>);
        })}
        {done && <p className="why"><b>{picked[i] === q.a ? 'Correct.' : picked[i] === undefined ? 'Not answered.' : 'Incorrect.'}</b> <Tex text={q.w} /></p>}
      </li>))}
    </ol>
    {!done && <button className="btn" onClick={submit}>Submit test</button>}
  </div>);
}
