import Link from 'next/link';
import ChapterSearch from '@/components/ChapterSearch';
import DemoForm from '@/components/DemoForm';
import { Continue } from '@/components/Progress';
import JsonLd from '@/components/JsonLd';
import { APPROACH, BOARDS, CLASSES, JOIN, PROGRAMMES, SITE, TEACHER, TESTIMONIALS } from '@/lib/data';
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

// Common worries about maths, each with what the site does about it. These are general worries, not quotes from students.
const FEARS = [
  { worry: 'I did not understand what was done on the board.', title: 'We start from the basics', text: 'Short notes explain every idea in plain words with solved examples, so you can go at your own speed and read a step again.', href: '/self-study', go: 'See the notes' },
  { worry: 'I understand in class but go blank in the exam.', title: 'Practice makes it stay', text: 'A daily practice sheet and a timed test for every chapter show you what you really know, well before the exam does.', href: '/tests', go: 'Try a test' },
  { worry: 'There are too many formulas to remember.', title: 'One page per chapter', text: 'The formula bank puts every formula of a chapter on a single sheet, ready for a quick revision the night before.', href: '/self-study', go: 'Open a formula bank' },
  { worry: 'I feel shy to ask my doubt in class.', title: 'Ask in private', text: 'Send your doubt with a photo and get a step-by-step answer from your teacher. Only you can see it.', href: '/doubts', go: 'Ask a doubt' },
];

// The path shown in the hero, from fear to confidence.
const PATH = [
  { title: 'Understand', text: 'Notes that start from the basics' },
  { title: 'Practise', text: 'A few questions a day, with answers' },
  { title: 'Check', text: 'A short test for every chapter' },
  { title: 'Ask', text: 'Your doubt, answered step by step' },
];

const STEPS = [
  { title: 'Pick your class', text: 'Choose Class 8, 9 or 10 and your board, then open the chapter you are studying in school.' },
  { title: 'Read and revise', text: 'Go through the short notes and solved examples, then learn the formula bank.' },
  { title: 'Practise and test', text: 'Solve the DPP sheet, take the chapter test and join Telegram for a new problem every day.' },
];

const FAQ = [
  { q: 'How do I book a free demo class?', a: 'Fill in the short form on this page or on the Free Demo page with your child\'s class and board. We call you to fix a time. There is nothing to pay for the demo.' },
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
  const finder = all.map(ch => ({ cls: ch.cls, label: ch.label, boards: ch.boards, title: ch.title, slug: ch.slug }));
  const pdfs = Object.values(PDFS).reduce((n, kinds) => n + kinds.length, 0);
  const stats = [
    { n: all.length, t: 'Chapters covered' },
    { n: pdfs, t: 'Free PDFs' },
    { n: Object.values(TESTS).reduce((n, t) => n + t.qs.length, 0), t: 'Practice test questions' },
    { n: BOARDS.length, t: 'Boards: CBSE and ICSE' },
  ];
  return (<>
    <section className="hero"><div className="wrap hero-grid">
      <div>
        <span className="eyebrow">Class 8 · 9 · 10 &nbsp;|&nbsp; CBSE · ICSE · Olympiad</span>
        <h1>Maths fear ends where <em>understanding</em> begins</h1>
        <p>Online Maths classes for Class 8, 9 and 10, taught from the basics in simple Hinglish. Most children who fear maths are not weak at it: they missed one idea somewhere. {SITE.name} goes back to that idea and builds up from there.</p>
        <div className="cta-row">
          <Link className="btn btn-sun" href="#demo">Book a free demo class</Link>
          <Link className="btn btn-ghost" href="#classes">I am a student</Link>
        </div>
        <ul className="ticks">
          <li>Free demo class</li><li>CBSE and ICSE</li><li>Free notes and tests</li>
        </ul>
      </div>
      <div className="hero-art">
        <DemoForm id="demo" classes={classes.map(([k, c]) => [k, c.label])} boards={BOARDS} />
      </div>
    </div></section>

    <div className="wrap"><div className="stats">
      {stats.map(s => <div key={s.t} className="stat"><b>{s.n}</b><span>{s.t}</span></div>)}
    </div></div>

    <Continue />

    <section className="section"><div className="wrap">
      <div className="section-head center reveal"><span className="kicker">How we teach</span><h2>The {SITE.name} approach</h2><p>Six habits that take a child from “I can’t do maths” to “I can do this”.</p></div>
      <div className="grid">
        {APPROACH.map((a, i) => (
          <div key={a.title} className={`card approach f${i % 4 + 1} reveal`}><b className="no" aria-hidden="true">{i + 1}</b><h3>{a.title}</h3><p>{a.text}</p></div>))}
      </div>
    </div></section>

    <section className="section soft"><div className="wrap">
      <div className="section-head center reveal"><span className="kicker">The journey</span><h2>From fear to confidence, one step at a time</h2></div>
      <ol className="road reveal">
        <li className="from">“I can’t do maths.”</li>
        {PATH.map(s => <li key={s.title}><b>{s.title}</b><span>{s.text}</span></li>)}
        <li className="to">“I can do this.”</li>
      </ol>
    </div></section>

    <section className="section" id="programmes"><div className="wrap">
      <div className="section-head center reveal"><span className="kicker">Programmes</span><h2>Choose how your child learns</h2><p>Start free. Move to classes with a teacher when you are ready.</p></div>
      <div className="grid plans">
        {PROGRAMMES.map(p => (
          <div key={p.name} className={`card plan reveal${p.hot ? ' hot' : ''}`}>
            <span className={`badge ${p.hot ? 'live' : 'self'}`}>{p.tag}</span>
            <h3>{p.name}</h3>
            <p>{p.line}</p>
            <ul>{p.gets.map(g => <li key={g}>{g}</li>)}</ul>
            <Link className={`btn ${p.hot ? 'btn-sun' : 'btn-outline'}`} href={p.href}>{p.go}</Link>
          </div>))}
      </div>
    </div></section>

    <section className="section soft"><div className="wrap">
      <div className="section-head center reveal"><span className="kicker">Getting started</span><h2>Join in three easy steps</h2></div>
      <div className="grid steps">
        {JOIN.map(s => <div key={s.title} className="step reveal"><h3>{s.title}</h3><p>{s.text}</p></div>)}
      </div>
      <p className="center" style={{marginTop:'1.8rem'}}><Link className="btn btn-sun" href="/demo">Book a free demo class</Link></p>
    </div></section>

    {TEACHER.name && <section className="section"><div className="wrap teacher reveal">
      {TEACHER.photo && <img src={TEACHER.photo} alt={TEACHER.name} width="220" height="220" />}
      <div>
        <span className="kicker">Your teacher</span>
        <h2>{TEACHER.name}</h2>
        {TEACHER.title && <p className="muted">{TEACHER.title}</p>}
        {TEACHER.about && <p>{TEACHER.about}</p>}
        {TEACHER.points.length > 0 && <div className="chips">{TEACHER.points.map(p => <span key={p} className="chip">{p}</span>)}</div>}
      </div>
    </div></section>}

    {TESTIMONIALS.length > 0 && <section className="section soft"><div className="wrap">
      <div className="section-head center reveal"><span className="kicker">In their words</span><h2>What parents and students say</h2></div>
      <div className="grid">
        {TESTIMONIALS.map(t => <figure key={t.words} className="card quote reveal"><blockquote>{t.words}</blockquote><figcaption>{t.by}</figcaption></figure>)}
      </div>
    </div></section>}

    <section className="section"><div className="wrap">
      <div className="section-head center reveal"><span className="kicker">Maths fear</span><h2>Why maths feels hard, and what we do about it</h2><p>If any of these sounds like you, you are not alone, and it can be fixed.</p></div>
      <div className="grid">
        {FEARS.map((f, i) => (
          <Link key={f.title} href={f.href} className={`card fear f${i % 4 + 1} reveal`}>
            <q>{f.worry}</q>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
            <span className="go">{f.go} →</span>
          </Link>))}
      </div>
    </div></section>

    <section className="section soft" id="classes"><div className="wrap">
      <div className="section-head center reveal"><span className="kicker">Start here</span><h2>Which class are you in?</h2><p>Pick your class to see everything for it: chapters, tests, live classes and help with doubts.</p></div>
      <ChapterSearch chapters={finder} />
      <div className="grid">
        {classes.map(([k, c]) => (
          <Link key={k} href={`/${k}`} className="tile big" data-no={c.label.replace(/\D/g, '')}><h3>{c.label}</h3>
            <span>CBSE and ICSE · {c.chapters.length} chapters</span><span className="go">Open {c.label} →</span></Link>))}
        <Link href="/olympiad" className="tile big" data-no="★"><h3>Olympiad</h3><span>SOF IMO preparation</span><span className="go">Open Olympiad →</span></Link>
      </div>
    </div></section>

    <section className="section"><div className="wrap">
      <div className="section-head center reveal"><span className="kicker">Inside every chapter</span><h2>Everything you need, in one place</h2><p>Built for school exams and board exams.</p></div>
      <div className="grid">
        {FEATURES.map((f, i) => (
          <div key={f.title} className={`card feat f${i % 4 + 1} reveal`}><div className="icon"><Icon name={f.icon} /></div><h3>{f.title}</h3><p>{f.text}</p></div>))}
      </div>
    </div></section>

    <section className="section soft"><div className="wrap try-grid">
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

    <section className="section"><div className="wrap">
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

    <section className="section soft"><div className="wrap">
      <div className="section-head center reveal"><span className="kicker">How it works</span><h2>Three steps for every chapter</h2></div>
      <div className="grid steps">
        {STEPS.map(s => <div key={s.title} className="step reveal"><h3>{s.title}</h3><p>{s.text}</p></div>)}
      </div>
    </div></section>

    <section className="section"><div className="wrap">
      <div className="banner reveal">
        <div><h2>Preparing for SOF IMO?</h2><p>See how to prepare alongside your school syllabus.</p></div>
        <Link className="btn btn-sun" href="/olympiad">Olympiad preparation</Link>
      </div>
    </div></section>

    <section className="section soft"><div className="wrap narrow">
      <div className="section-head center reveal"><span className="kicker">FAQ</span><h2>Frequently asked questions</h2></div>
      {FAQ.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }} />
    </div></section>

    <section className="section"><div className="wrap">
      <div className="banner reveal">
        <div><h2>A new problem every day</h2><p>Daily problems are posted on Telegram. Video lessons are on YouTube.</p></div>
        <div className="cta-row">
          <a className="btn btn-sun" href={SITE.telegram}>Join Telegram</a>
          <a className="btn btn-ghost" href={SITE.youtube}>Watch on YouTube</a>
          <Link className="btn btn-ghost" href="/demo">Book a free demo class</Link>
        </div>
      </div>
    </div></section>
  </>);
}
