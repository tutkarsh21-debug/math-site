'use client';
import Link from 'next/link';

// The picture of one student, used by all three dashboards. data comes from lib/dashboard.js (studentOverview).
// mode: 'student' (the student's own, with links to act), 'parent' (read only) or 'admin' (the owner looking at one student).
export const when = t => new Date(t * 1000).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
export const dateOnly = t => new Date(t * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const dayShort = k => new Date(`${k}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
export const band = p => (p >= 75 ? 'good' : p >= 50 ? 'mid' : 'low');
const clock = s => (s >= 60 ? `${Math.floor(s / 60)} min ${s % 60} sec` : `${s} sec`);
// A chapter needs at least this many questions before it is called strong or weak; fewer is too little to judge.
const ENOUGH = 5;

export function Cards({ items }) {
  return <div className="dash-cards">{items.map(([n, label, hint]) => (
    <div key={label} className="dash-card"><b>{n}</b><span>{label}</span>{hint && <small>{hint}</small>}</div>))}</div>;
}

export function Bars({ rows, link }) {
  return (<ul className="pr-bars">{rows.map(r => {
    const few = r.n < ENOUGH;
    const inner = (<>
      <span className="pr-name">{r.label}</span>
      <span className="pr-track"><span className={`pr-fill ${band(r.pct)}`} style={{ width: `${Math.max(r.pct, 4)}%` }} /></span>
      <span className="pr-pct">{r.pct}% <span className="muted small">({r.c}/{r.n})</span></span>
    </>);
    return (<li key={`${r.cls}${r.ch}`}>
      {link ? <Link className="pr-bar" href={link(r)}>{inner}</Link> : <div className="pr-bar">{inner}</div>}
      <p className="dash-tag small">{few ? <span className="muted">Only {r.n} question{r.n > 1 ? 's' : ''} so far, too few to judge.</span>
        : r.pct >= 75 ? <span className="tag ready">Strong</span> : r.pct >= 50 ? <span className="tag">Getting there</span> : <span className="tag weak">Needs more work</span>}</p>
    </li>);
  })}</ul>);
}

export default function DashboardView({ data, mode = 'student' }) {
  const { summary: s, topics, chapterTests, practice, days, recent } = data;
  const who = mode === 'student' ? 'You have' : `${data.user.name.split(' ')[0]} has`;
  const peak = Math.max(1, ...days.map(d => d.n));
  const weak = topics.filter(t => t.n >= ENOUGH && t.pct < 50);

  return (<div className="dash">
    <Cards items={[
      [s.testsTaken, 'Tests taken', `${s.chapterTests} chapter · ${s.practiceTests} practice`],
      [s.avgPct == null ? '–' : `${s.avgPct}%`, 'Average score', s.questions ? `over ${s.questions} questions` : 'No test yet'],
      [s.chaptersOpened, 'Chapters opened'],
      [s.pdfsOpened, 'PDFs opened'],
      [`${s.activeDays}/14`, 'Active days', 'in the last 14 days'],
    ]} />

    <section className="dash-sec">
      <h2>Activity in the last 14 days</h2>
      <div className="dash-chart" role="img" aria-label={`Activity on each of the last 14 days. ${s.activeDays} days had some activity.`}>
        {days.map(d => (<div key={d.day} className="dash-col" title={`${dayShort(d.day)}: ${d.n}`}>
          <span className="dash-bar" style={{ height: `${d.n ? Math.max(8, (100 * d.n) / peak) : 3}%` }} />
          <small>{dayShort(d.day).split(' ')[0]}</small>
        </div>))}
      </div>
      {s.activeDays === 0 && <p className="muted small">{who} not opened anything in the last 14 days.</p>}
    </section>

    <section className="dash-sec">
      <h2>Strong and weak topics</h2>
      {topics.length === 0
        ? <p className="muted">{mode === 'student' ? <>No practice test taken yet. <Link href="/practice">Make a practice test</Link> and your topics will be ranked here, weakest first.</> : 'No practice test taken yet.'}</p>
        : <>
          <p className="muted small">From practice tests, weakest first. A topic is judged only after {ENOUGH} or more questions.</p>
          {weak.length > 0 && <p className="dash-note">{mode === 'student' ? 'Work on' : 'Needs more work:'} <b>{weak.slice(0, 3).map(t => t.label).join(', ')}</b>.</p>}
          <Bars rows={topics} link={mode === 'student' ? r => `/practice?cls=${r.cls}&ch=${r.ch}` : null} />
        </>}
    </section>

    <section className="dash-sec">
      <h2>Chapter tests</h2>
      {chapterTests.length === 0 ? <p className="muted">No chapter test finished yet.</p> : (
        <div className="scroll-x"><table className="scores"><thead><tr><th>Chapter</th><th>Score</th><th>Date</th></tr></thead><tbody>
          {chapterTests.map((r, i) => (<tr key={i}>
            <td>{mode === 'student' ? <Link href={`/tests/${r.test}`}>{r.title}</Link> : r.title}</td>
            <td><span className={`pill ${band(r.pct)}`}>{r.score} / {r.total}</span></td>
            <td>{dateOnly(r.at)}</td>
          </tr>))}
        </tbody></table></div>)}
    </section>

    <section className="dash-sec">
      <h2>Practice tests</h2>
      {practice.length === 0 ? <p className="muted">No practice test finished yet.</p> : (
        <div className="scroll-x"><table className="scores"><thead><tr><th>Date</th><th>Topics</th><th>Level</th><th>Score</th><th>Time</th></tr></thead><tbody>
          {practice.map(r => (<tr key={r.id}>
            <td>{when(r.at)}</td>
            <td>{r.chapters.length > 2 ? `${r.chapters.slice(0, 2).join(', ')} and ${r.chapters.length - 2} more` : r.chapters.join(', ')}</td>
            <td>{r.level}</td>
            <td><span className={`pill ${band(r.pct)}`}>{r.score} / {r.total}</span>{r.skipped > 0 && <small className="muted"> · {r.skipped} skipped</small>}</td>
            <td>{r.secs ? clock(r.secs) : '–'}{r.minutes ? <small className="muted"> of {r.minutes} min</small> : null}</td>
          </tr>))}
        </tbody></table></div>)}
    </section>

    <section className="dash-sec">
      <h2>{mode === 'student' ? 'Recently opened' : 'What was opened'}</h2>
      {recent.length === 0 ? <p className="muted">Nothing opened yet.</p> : (
        <ul className="dash-recent">{recent.map((r, i) => (<li key={i}>
          <span className="badge soon">{r.group}</span>
          {mode === 'student' && r.kind === 'view' ? <Link href={r.path}>{r.label}</Link> : <span>{r.label}</span>}
          <small className="muted">{when(r.at)}</small>
        </li>))}</ul>)}
    </section>
  </div>);
}
