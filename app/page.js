import { Fragment } from 'react';
import Link from 'next/link';
import { BOARDS, CLASSES, MODES, SITE } from '@/lib/data';
import PDFS from '@/lib/pdfs.json';
import TESTS from '@/lib/tests.json';

// Icons are drawn as line paths on a 24 x 24 grid.
const ICONS = {
  notes: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5',
  formulas: 'M17 5H7l6 7-6 7h10',
  dpp: 'M4 20l1-4L16 5l3 3L8 19zM14 7l3 3',
  pyq: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
  test: 'M12 7v5l3 2M12 21a9 9 0 100-18 9 9 0 000 18z',
  video: 'M4 6h12v12H4zM16 10l5-3v10l-5-3z',
};
const Icon = ({ name }) => (<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8"
  strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICONS[name]} /></svg>);

const FEATURES = [
  { icon: 'notes', title: 'Short Notes', text: 'Topic-wise notes with solved examples for every chapter, as a PDF you can read or download.' },
  { icon: 'formulas', title: 'Formula Bank', text: 'All the formulas of a chapter on one page, for quick revision before a test.' },
  { icon: 'dpp', title: 'DPP Sheets', text: 'A daily practice sheet for each chapter, with the answer key at the end.' },
  { icon: 'pyq', title: 'PYQ for Class 10', text: 'Previous year board questions arranged topic-wise, with step-by-step solutions.' },
  { icon: 'test', title: 'Chapter Tests', text: 'Timed online tests with your score and an explanation for every question.' },
  { icon: 'video', title: 'Video Lectures', text: 'Lessons in simple Hinglish, being added chapter by chapter.' },
];

const STEPS = [
  { title: 'Pick your class', text: 'Choose Class 8, 9 or 10 and your board, then open the chapter you are studying in school.' },
  { title: 'Read and revise', text: 'Go through the short notes and solved examples, then learn the formula bank.' },
  { title: 'Practise and test', text: 'Solve the DPP sheet, take the chapter test and join Telegram for a new problem every day.' },
];

const FAQ = [
  { q: 'Which classes and boards are covered?', a: 'Class 8, 9 and 10 Maths for both CBSE and ICSE. Each board has its own chapter list, so you only see the chapters of your syllabus.' },
  { q: 'Is the study material free?', a: 'Yes. The notes, formula banks, DPP sheets, previous year questions and online tests are free and can be used without an account. A free account is needed only to save your test scores.' },
  { q: 'What do I get on a chapter page?', a: 'Short notes, a formula bank and a DPP sheet as PDFs. Class 10 chapters also have previous year questions with solutions. Every chapter has a timed online test of 10 questions. Video lectures are being added chapter by chapter.' },
  { q: 'Which language are the lessons in?', a: 'Video lessons are taught in Hinglish, a mix of Hindi and English. The notes and practice sheets are written in English, as questions appear in the exam.' },
  { q: 'Do you help with Olympiad preparation?', a: 'Yes. The Olympiad page explains how to prepare for SOF IMO alongside your school syllabus.' },
];

// A sample question for the "Try a question" block. It works without JavaScript: the chosen option is coloured by CSS.
const SAMPLE = {
  q: 'Two bells ring every 18 minutes and every 24 minutes. If they ring together at 9:00 am, when do they next ring together?',
  o: ['9:42 am', '10:00 am', '10:12 am', '10:48 am'], a: 2,
  w: 'The LCM of 18 and 24 is 72 minutes, that is 1 hour 12 minutes after 9:00 am.',
};

export default function Home() {
  const classes = Object.entries(CLASSES);
  const all = classes.flatMap(([k, c]) => c.chapters.map(ch => ({ ...ch, cls: k, label: c.label })));
  // The first chapter of every class in each board.
  const featured = BOARDS.flatMap(b => classes.map(([k]) => all.find(ch => ch.cls === k && ch.boards[0] === b))).filter(Boolean);
  // Every fourth chapter, for the moving strip of chapter names.
  const strip = all.filter((ch, i) => i % 4 === 0);
  const pdfs = Object.values(PDFS).reduce((n, kinds) => n + kinds.length, 0);
  const stats = [
    { n: all.length, t: 'Chapters covered' },
    { n: pdfs, t: 'Free PDFs' },
    { n: classes.length, t: 'Classes: 8, 9 and 10' },
    { n: BOARDS.length, t: 'Boards: CBSE and ICSE' },
  ];
  const chips = (hidden) => strip.map(ch => (
    <Link key={`${ch.cls}/${ch.slug}`} href={`/${ch.cls}/${ch.slug}`} className="chip" tabIndex={hidden ? -1 : undefined}>{ch.title}</Link>));
  return (<>
    <section className="hero"><div className="wrap hero-grid">
      <div>
        <span className="eyebrow">Class 8 · 9 · 10 &nbsp;|&nbsp; CBSE · ICSE · Olympiad</span>
        <h1>Maths made <em>simple</em>, from basics to boards</h1>
        <p>Notes, formulas, daily practice and tests for every chapter, with lessons in easy Hinglish. Understand once, score full marks.</p>
        <div className="cta-row">
          <Link className="btn btn-sun" href="#explore">Explore courses</Link>
          <Link className="btn btn-ghost" href="/self-study">Start free self study</Link>
        </div>
        <ul className="ticks">
          <li>Free PDF notes</li><li>CBSE and ICSE</li><li>No login needed to study</li>
        </ul>
      </div>
      <div className="hero-art">
        <span className="fx fx1" aria-hidden="true">a² + b² = c²</span>
        <span className="fx fx2" aria-hidden="true">sin²θ + cos²θ = 1</span>
        <span className="fx fx3" aria-hidden="true">A = πr²</span>
        <div className="picker">
          <h2>Which class are you in?</h2>
          {classes.map(([k, c]) => (
            <Link key={k} href={`/${k}`}><b className="cls-no" aria-hidden="true">{c.label.replace(/\D/g, '')}</b>
              <span>{c.label}<small>{c.chapters.length} chapters · CBSE and ICSE</small></span><span className="arrow">→</span></Link>))}
          <Link href="/olympiad"><b className="cls-no" aria-hidden="true">★</b><span>Olympiad<small>SOF IMO preparation</small></span><span className="arrow">→</span></Link>
        </div>
      </div>
    </div></section>

    <div className="wrap"><div className="stats">
      {stats.map(s => <div key={s.t} className="stat"><b>{s.n}</b><span>{s.t}</span></div>)}
    </div></div>

    <div className="marquee"><div>
      {chips(false)}<span aria-hidden="true" style={{display:'contents'}}>{chips(true)}</span>
    </div></div>

    <section className="section" id="explore"><div className="wrap">
      <div className="section-head center reveal"><span className="kicker">Courses</span><h2>Choose how you want to study</h2><p>Pick a study mode, then your class.</p></div>
      <div className="tabs center">
        {MODES.map((m, i) => (<Fragment key={m.kind}>
          <input type="radio" name="mode" id={`mode-${m.kind}`} defaultChecked={i === 0} />
          <label htmlFor={`mode-${m.kind}`}>{m.label}</label>
        </Fragment>))}
        {MODES.map(m => (<div key={m.kind} className="tab-panel">
          <p className="muted"><span className={`badge ${m.kind}`}>{m.badge}</span> {m.text}</p>
          <div className="grid">
            {classes.map(([k, c]) => (
              <Link key={k} href={m.kind === 'self' ? `/${k}` : `${m.href}#${k}`} className="tile big" data-no={c.label.replace(/\D/g, '')}><h3>{c.label}</h3>
                <span>CBSE and ICSE · {c.chapters.length} chapters</span><span className="go">{m.label} →</span></Link>))}
            <Link href={m.href} className="tile big" data-no="∑"><h3>All classes</h3><span>See everything in {m.label}</span><span className="go">Open →</span></Link>
          </div>
        </div>))}
      </div>
    </div></section>

    <section className="section soft"><div className="wrap">
      <div className="section-head center reveal"><span className="kicker">Inside every chapter</span><h2>Everything you need, in one place</h2><p>Built for school exams and board exams.</p></div>
      <div className="grid">
        {FEATURES.map((f, i) => (
          <div key={f.title} className={`card feat f${i % 4 + 1} reveal`}><div className="icon"><Icon name={f.icon} /></div><h3>{f.title}</h3><p>{f.text}</p></div>))}
      </div>
    </div></section>

    <section className="section"><div className="wrap try-grid">
      <div className="reveal">
        <span className="kicker">Test Series</span>
        <h2>Try a question right now</h2>
        <p className="muted">Chapter tests are timed, and you get your score with an explanation for every question as soon as you submit. Pick an answer to see how it works.</p>
        <div className="cta-row">
          <Link className="btn" href="/tests">Open Test Series</Link>
          <Link className="btn btn-outline" href="/sample-papers">Sample Papers</Link>
        </div>
        <p className="muted small" style={{marginTop:'1rem'}}>{Object.keys(TESTS).length} chapter tests are ready, one for every chapter of Class 8, 9 and 10.</p>
      </div>
      <form className="card try reveal">
        <span className="tag">Class 10 · Real Numbers</span>
        <p className="qtext">{SAMPLE.q}</p>
        {SAMPLE.o.map((o, i) => (
          <label key={o} className={`opt ${i === SAMPLE.a ? 'ok' : 'no'}`}><input type="radio" name="sample" />{o}</label>))}
        <p className="why"><b>Answer: {SAMPLE.o[SAMPLE.a]}.</b> {SAMPLE.w}</p>
      </form>
    </div></section>

    <section className="section soft"><div className="wrap">
      <div className="section-head center reveal"><span className="kicker">Start here</span><h2>Begin with these chapters</h2><p>Open any chapter and start today.</p></div>
      <div className="grid">
        {featured.map(ch => (
          <Link key={`${ch.cls}/${ch.slug}`} href={`/${ch.cls}/${ch.slug}`} className="card reveal">
            <span className="tag">{ch.label} {ch.boards[0]}</span>{PDFS[`${ch.cls}/${ch.slug}`] && <span className="tag ready">PDF notes</span>}
            <h3 style={{marginTop:'.6rem'}}>{ch.title}</h3>
            <span className="go">Open chapter →</span>
          </Link>))}
      </div>
    </div></section>

    <section className="section"><div className="wrap">
      <div className="section-head center reveal"><span className="kicker">How it works</span><h2>Three steps for every chapter</h2></div>
      <div className="grid steps">
        {STEPS.map(s => <div key={s.title} className="step reveal"><h3>{s.title}</h3><p>{s.text}</p></div>)}
      </div>
    </div></section>

    <section className="section soft"><div className="wrap">
      <div className="banner reveal">
        <div><h2>Preparing for SOF IMO?</h2><p>See how to prepare alongside your school syllabus.</p></div>
        <Link className="btn btn-sun" href="/olympiad">Olympiad preparation</Link>
      </div>
    </div></section>

    <section className="section"><div className="wrap narrow">
      <div className="section-head center reveal"><span className="kicker">FAQ</span><h2>Frequently asked questions</h2></div>
      {FAQ.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
    </div></section>

    <section className="section soft"><div className="wrap">
      <div className="banner reveal">
        <div><h2>A new problem every day</h2><p>Daily problems are posted on Telegram. Video lessons are on YouTube.</p></div>
        <div className="cta-row">
          <a className="btn btn-sun" href={SITE.telegram}>Join Telegram</a>
          <a className="btn btn-ghost" href={SITE.youtube}>Watch on YouTube</a>
          <Link className="btn btn-ghost" href="/enquiry">Enquire about live classes</Link>
        </div>
      </div>
    </div></section>
  </>);
}
