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

// One online test. id: 'class-10/real-numbers'. test: { minutes, qs: [{ q, o: [options], a: index of the answer, w: why }] }.
export default function Test({ id, title, test, back }) {
  const total = test.qs.length;
  const [stage, setStage] = useState('intro');       // intro, running, done
  const [picked, setPicked] = useState({});
  const [left, setLeft] = useState(test.minutes * 60);
  const [saved, setSaved] = useState('');
  const top = useRef(null);
  const score = test.qs.filter((q, i) => picked[i] === q.a).length;

  useEffect(() => {
    if (stage !== 'running') return;
    if (left <= 0) { finish(); return; }
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  });

  function start() { setPicked({}); setLeft(test.minutes * 60); setSaved(''); setStage('running'); }
  async function finish() {
    setStage('done');
    top.current?.scrollIntoView();
    const s = test.qs.filter((q, i) => picked[i] === q.a).length;
    try {
      const r = await fetch('/api/results', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ test: id, score: s }) });
      setSaved(r.ok ? 'yes' : r.status === 401 ? 'login' : 'no');
    } catch { setSaved('no'); }
  }

  if (stage === 'intro') return (<div className="card auth">
    <h2>{title}</h2>
    <ul>
      <li>{total} multiple-choice questions, 1 mark each</li>
      <li>Time allowed: {test.minutes} minutes. The test is submitted automatically when time is over.</li>
      <li>No negative marking. You see the answers and explanations after you submit.</li>
    </ul>
    <button className="btn" onClick={start}>Start test</button>
  </div>);

  const done = stage === 'done';
  return (<div ref={top}>
    {done
      ? <div className="card auth result">
          <h2>Your score: {score} / {total}</h2>
          <p className="muted">{score === total ? 'Full marks. Well done!' : score >= total * 0.7 ? 'Good work. Check the questions you missed below.' : 'Go through the explanations below, revise the notes, and try again.'}</p>
          {saved === 'yes' && <p className="muted small">Saved to <Link href="/account">My tests</Link>.</p>}
          {saved === 'login' && <p className="muted small"><Link href="/login">Log in</Link> before the next test to keep your scores.</p>}
          <div className="cta-row">
            <button className="btn" onClick={start}>Try again</button>
            <Link className="btn btn-outline" href={back}>Back to the chapter</Link>
            <Link className="btn btn-outline" href="/tests">All tests</Link>
          </div>
        </div>
      : <div className="timer" aria-live="off"><span>Answered {Object.keys(picked).length} of {total}</span><b className={left < 60 ? 'low' : ''}>{clock(left)}</b></div>}
    <ol className="quiz">
      {test.qs.map((q, i) => (<li key={i}>
        <p className="qtext"><Tex text={q.q} /></p>
        {q.o.map((opt, j) => {
          const cls = done ? (j === q.a ? 'right' : picked[i] === j ? 'wrong' : '') : picked[i] === j ? 'on' : '';
          return (<label key={j} className={`opt ${cls}`}>
            <input type="radio" name={`q${i}`} checked={picked[i] === j} disabled={done} onChange={() => setPicked({ ...picked, [i]: j })} />
            <Tex text={opt} />
          </label>);
        })}
        {done && <p className="why"><b>{picked[i] === q.a ? 'Correct.' : picked[i] === undefined ? 'Not answered.' : 'Incorrect.'}</b> <Tex text={q.w} /></p>}
      </li>))}
    </ol>
    {!done && <button className="btn" onClick={finish}>Submit test</button>}
  </div>);
}
