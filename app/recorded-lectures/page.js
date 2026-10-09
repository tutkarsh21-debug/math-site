import Link from 'next/link';
import { BOARDS, CLASSES, SITE } from '@/lib/data';

export const metadata = { title: 'Recorded Maths Video Lectures for Class 8, 9, 10 | CBSE & ICSE',
  description: 'Chapter-wise recorded Maths lectures in Hinglish for Class 8, 9 and 10, CBSE and ICSE. Watch any time.',
  alternates: { canonical: '/recorded-lectures' } };

const POINTS = [
  { t: 'One chapter, one lecture', d: 'Each video follows the chapter in the order of the textbook, so you never wonder what to watch next.' },
  { t: 'In Hinglish', d: 'Explained the way a teacher talks in class. Notes and questions stay in English, as in the exam.' },
  { t: 'Pause, rewind, repeat', d: 'Watch at your own speed, as many times as you need, at any hour.' },
  { t: 'Then test yourself', d: 'Every chapter page also has short notes, a formula bank, a DPP sheet and a timed test.' },
];

export default function RecordedLectures() {
  const classes = Object.entries(CLASSES);
  const all = classes.flatMap(([, c]) => c.chapters);
  const uploaded = all.filter(ch => ch.youtube).length;
  return (<>
    <section className="sp-hero"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>Recorded Lectures</div>
      <span className="sp-eyebrow">Class 8 · 9 · 10 · CBSE · ICSE</span>
      <h1>Learn at your pace, <span className="h3-grad">one chapter at a time</span></h1>
      <p>{uploaded
        ? `Chapter-wise video lectures in Hinglish. ${uploaded} of ${all.length} chapters have a video so far, and more are added as they are recorded.`
        : 'Chapter-wise video lectures in Hinglish are being recorded. The first lectures will be announced here, on YouTube and on Telegram.'}</p>
      <div className="cta-row" style={{ marginTop: '1.4rem' }}>
        <a className="btn btn-sun" href={SITE.youtube}>Open YouTube channel</a>
        <a className="btn h3-ghost" href={SITE.telegram}>Join Telegram</a>
      </div>
    </div></section>

    <section className="section"><div className="wrap">
      <div className="section-head center"><span className="kicker">How the lectures work</span><h2>Built to be watched, then practised</h2></div>
      <div className="sp-steps">
        {POINTS.map((s, i) => (<div key={s.t} className="sp-step"><b>{i + 1}</b><h3>{s.t}</h3><p>{s.d}</p></div>))}
      </div>
    </div></section>

    <section className="section soft"><div className="wrap">
      <div className="section-head center"><span className="kicker">Choose your class</span><h2>Lectures by class</h2></div>
      <div className="rl-classes">
        {classes.map(([k, c]) => {
          const n = c.chapters.filter(ch => ch.youtube).length;
          return (<Link key={k} href={`#${k}`} className="rl-class reveal">
            <h3>{c.label}</h3>
            <p>{BOARDS.filter(b => c.chapters.some(ch => ch.boards.includes(b))).join(' · ')}</p>
            <span className={`rl-status${n ? ' on' : ''}`}>{n ? `${n} video${n > 1 ? 's' : ''} ready` : 'Recording soon'}</span>
          </Link>);
        })}
      </div>
    </div></section>

    {uploaded > 0 && <section className="section"><div className="wrap">
      {classes.map(([k, c]) => {
        const boards = BOARDS.map(b => ({ b, list: c.chapters.filter(ch => ch.boards.includes(b) && ch.youtube) })).filter(x => x.list.length);
        if (!boards.length) return null;
        return (<div key={k} id={k} className="part">
          <h2>{c.label}</h2>
          {boards.map(({ b, list }) => (<details key={b} open>
            <summary>{c.label} {b} <span className="muted">· {list.length} videos</span></summary>
            <ol className="lectures">{list.map(ch => (
              <li key={ch.slug}>
                <Link href={`/${k}/${ch.slug}#video`}>{ch.title}</Link>
                <span className="badge rec">WATCH</span>
              </li>))}
            </ol>
          </details>))}
        </div>);
      })}
    </div></section>}

    <section className="section"><div className="wrap">
      <div className="rl-wait">
        <div><h2>Do not wait for the video</h2><p>Every chapter already has short notes, a formula bank, a DPP sheet and an online test. Start there today, and add the lecture when it arrives.</p></div>
        <div className="cta-row">
          <Link className="btn btn-sun" href="/self-study">Go to Self Study</Link>
          <Link className="btn btn-outline" href="/tests">Take a chapter test</Link>
        </div>
      </div>
    </div></section>
  </>);
}
