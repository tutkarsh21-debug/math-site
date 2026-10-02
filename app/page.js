import Link from 'next/link';
import { CLASSES, SITE } from '@/lib/data';

const FEATURES = [
  { icon: '▶', title: 'Video lessons', text: 'Every chapter is taught on video, step by step, the way it is asked in the exam.' },
  { icon: 'ƒ', title: 'Key formulas', text: 'All the formulas of a chapter on one page for quick revision.' },
  { icon: '✓', title: 'Solved examples', text: 'Board-style questions solved in full, with the common mistakes pointed out.' },
  { icon: '✎', title: 'Practice questions', text: 'Questions to try on your own after each lesson, plus daily problems on Telegram.' },
  { icon: 'Aa', title: 'Taught in Hinglish', text: 'Video lessons are explained in simple Hinglish. Notes and practice are in English, as in the exam.' },
  { icon: '★', title: 'CBSE, ICSE and Olympiad', text: 'Both boards are covered, with extra preparation for SOF IMO.' },
];

const STEPS = [
  { title: 'Pick your class', text: 'Choose Class 8, 9 or 10 and open the chapter you are studying in school.' },
  { title: 'Watch and read', text: 'Watch the video, then go through the formulas, concept notes and solved examples.' },
  { title: 'Practise daily', text: 'Solve the practice questions and join Telegram for a new problem every day.' },
];

const FAQ = [
  { q: 'Which classes and boards are covered?', a: 'Class 8, 9 and 10 Maths for both CBSE and ICSE. ICSE-only chapters such as GST and Shares and Dividend are marked separately.' },
  { q: 'Which language are the lessons in?', a: 'Video lessons are taught in Hinglish, a mix of Hindi and English. The notes, solved examples and practice questions on this site are written in English, as they appear in the exam.' },
  { q: 'What do I get on a chapter page?', a: 'The video lesson, key formulas, the concept explained, solved examples, common mistakes, practice questions and FAQs.' },
  { q: 'Do you help with Olympiad preparation?', a: 'Yes. The Olympiad page explains how to prepare for SOF IMO, and practice sets are shared on Telegram.' },
];

export default function Home() {
  const classes = Object.entries(CLASSES);
  const all = classes.flatMap(([k, c]) => c.chapters.map(ch => ({ ...ch, cls: k, label: c.label })));
  const featured = [...all.filter(ch => ch.summary), ...all.filter(ch => !ch.summary)].slice(0, 6);
  const stats = [
    { n: classes.length, t: 'Classes (8 to 10)' },
    { n: all.length, t: 'Chapters' },
    { n: 2, t: 'Boards: CBSE and ICSE' },
    { n: 'Hinglish', t: 'Language of video lessons' },
  ];
  return (<>
    <section className="hero"><div className="wrap hero-grid">
      <div>
        <span className="eyebrow">CBSE · ICSE · Olympiad</span>
        <h1>Class 8-10 Maths in Hinglish, from Basics to Olympiad</h1>
        <p>Understand once, score full marks.</p>
        <div className="cta-row">
          <Link className="btn btn-sun" href="/class-10">Start with Class 10</Link>
          <a className="btn btn-ghost" href={SITE.telegram}>Join Telegram</a>
        </div>
      </div>
      <div className="picker">
        <h2>Which class are you in?</h2>
        {classes.map(([k, c]) => (
          <Link key={k} href={`/${k}`}><span>{c.label}<small>{c.chapters.length} chapters</small></span><span className="arrow">→</span></Link>))}
        <Link href="/olympiad"><span>Olympiad<small>SOF IMO prep</small></span><span className="arrow">→</span></Link>
      </div>
    </div></section>

    <div className="wrap"><div className="stats">
      {stats.map(s => <div key={s.t} className="stat"><b>{s.n}</b><span>{s.t}</span></div>)}
    </div></div>

    <section className="section"><div className="wrap">
      <div className="section-head"><h2>Explore by class</h2><p>Chapter-wise lessons for the class you are in.</p></div>
      <div className="grid">
        {classes.map(([k, c]) => (
          <Link key={k} href={`/${k}`} className="tile"><h3>{c.label}</h3>
            <span>{c.chapters.length} chapters</span><span className="go">View chapters →</span></Link>))}
        <Link href="/olympiad" className="tile"><h3>Olympiad</h3><span>SOF IMO prep</span><span className="go">How to prepare →</span></Link>
      </div>
    </div></section>

    <section className="section soft"><div className="wrap">
      <div className="section-head"><h2>Everything you need for each chapter</h2><p>One page per chapter, built for school exams and boards.</p></div>
      <div className="grid">
        {FEATURES.map(f => (
          <div key={f.title} className="card"><div className="icon" aria-hidden="true">{f.icon}</div><h3>{f.title}</h3><p>{f.text}</p></div>))}
      </div>
    </div></section>

    <section className="section"><div className="wrap">
      <div className="section-head"><h2>Start with these chapters</h2><p>Open any chapter and begin today.</p></div>
      <div className="grid">
        {featured.map(ch => (
          <Link key={`${ch.cls}/${ch.slug}`} href={`/${ch.cls}/${ch.slug}`} className="card">
            <span className="tag">{ch.label} {ch.boards[0]}</span>{ch.summary && <span className="tag ready">Notes + practice</span>}
            <h3 style={{marginTop:'.6rem'}}>{ch.title}</h3>
          </Link>))}
      </div>
    </div></section>

    <section className="section soft"><div className="wrap">
      <div className="section-head"><h2>How it works</h2></div>
      <div className="grid steps">
        {STEPS.map(s => <div key={s.title} className="step"><h3>{s.title}</h3><p>{s.text}</p></div>)}
      </div>
    </div></section>

    <section className="section"><div className="wrap">
      <div className="banner">
        <div><h2>Preparing for SOF IMO?</h2><p>See how to prepare alongside your school syllabus.</p></div>
        <Link className="btn btn-sun" href="/olympiad">Olympiad preparation</Link>
      </div>
    </div></section>

    <section className="section soft"><div className="wrap">
      <div className="section-head"><h2>Frequently asked questions</h2></div>
      {FAQ.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
    </div></section>

    <section className="section"><div className="wrap">
      <div className="banner">
        <div><h2>A new problem every day</h2><p>Daily problems and mock tests are posted on Telegram. Video lessons are on YouTube.</p></div>
        <div className="cta-row">
          <a className="btn btn-sun" href={SITE.telegram}>Join Telegram</a>
          <a className="btn btn-ghost" href={SITE.youtube}>Watch on YouTube</a>
        </div>
      </div>
    </div></section>
  </>);
}
