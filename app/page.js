import Link from 'next/link';
import { ApproachIcon, Peek, PlanIcon, Sky, Trophy, Worry } from '@/components/Art';
import ChapterSearch from '@/components/ChapterSearch';
import DemoForm from '@/components/DemoForm';
import { Continue } from '@/components/Progress';
import PracticeSpotlight from '@/components/PracticeSpotlight';
import JsonLd from '@/components/JsonLd';
import CountUp from '@/components/CountUp';
import { APPROACH, BOARDS, CLASSES, PROGRAMMES, ROADMAP, SITE, TEACHER, TESTIMONIALS, TOOLS } from '@/lib/data';
import PDFS from '@/lib/pdfs.json';
import TESTS from '@/lib/tests.json';

// Common worries about maths, each with what the site does about it. These are general worries, not quotes from students.
const FEARS = [
  { worry: 'I did not understand what was done on the board.', title: 'We start from the basics', text: 'Short notes explain every idea in plain words with solved examples, so you can go at your own speed and read a step again.', href: '/self-study', go: 'See the notes' },
  { worry: 'I understand in class but go blank in the exam.', title: 'Practice makes it stay', text: 'A daily practice sheet and a timed test for every chapter show you what you really know, well before the exam does.', href: '/tests', go: 'Try a test' },
  { worry: 'There are too many formulas to remember.', title: 'One page per chapter', text: 'The formula bank puts every formula of a chapter on a single sheet, ready for a quick revision the night before.', href: '/self-study', go: 'Open a formula bank' },
  { worry: 'I feel shy to ask my doubt in class.', title: 'Ask in private', text: 'Send your doubt with a photo and get a step-by-step answer from your teacher. Only you can see it.', href: '/doubts', go: 'Ask a doubt' },
];


const FAQ = [
  { q: 'How do I book a free demo class?', a: 'Fill in the short form on this page or on the Free Demo page with your child\'s class and board. We call you to fix a time. There is nothing to pay for the demo.' },
  { q: 'Which classes and boards are covered?', a: 'Class 8, 9 and 10 Maths for both CBSE and ICSE. Each board has its own chapter list, so you only see the chapters of your syllabus.' },
  { q: 'Is the study material free?', a: 'Yes. The notes, formula banks, DPP sheets, previous year questions and online tests are free and can be used without an account. A free account is needed only to save your test scores.' },
  { q: 'What do I get on a chapter page?', a: 'Short notes, a formula bank and a DPP sheet as PDFs. Class 10 chapters also have previous year questions with solutions. Every chapter has a timed online test of 10 questions. Video lectures are being added chapter by chapter.' },
  { q: 'Which language are the lessons in?', a: 'Video lessons are taught in Hinglish, a mix of Hindi and English. The notes and practice sheets are written in English, as questions appear in the exam.' },
  { q: 'Do you help with Olympiad preparation?', a: 'Yes. The Olympiad page explains how to prepare for SOF IMO alongside your school syllabus.' },
];

export default function Home() {
  const classes = Object.entries(CLASSES);
  const all = classes.flatMap(([k, c]) => c.chapters.map(ch => ({ ...ch, cls: k, label: c.label })));
  const pdfCount = Object.values(PDFS).reduce((n, k) => n + k.length, 0);
  const testQs = Object.values(TESTS).reduce((n, t) => n + t.qs.length, 0);
  const finder = all.map(ch => ({ cls: ch.cls, label: ch.label, boards: ch.boards, title: ch.title, slug: ch.slug }));
  return (<>
    <section className="hero"><Sky /><div className="wrap hero-grid">
      <div>
        <span className="eyebrow">Class 8 · 9 · 10 &nbsp;|&nbsp; CBSE · ICSE · Olympiad</span>
        <h1>Maths fear ends where <em>understanding</em> begins</h1>
        <p>Online Maths classes for Class 8, 9 and 10, taught from the basics in simple Hinglish. Most children who fear maths are not weak at it: they missed one idea somewhere. {SITE.name} goes back to that idea and builds up from there.</p>
        <div className="cta-row">
          <Link className="btn btn-sun" href="#demo">Book a free demo class</Link>
          <Link className="btn btn-ghost" href="/start">I am weak in maths</Link>
        </div>
        <ul className="ticks">
          <li>Free demo class</li><li>CBSE and ICSE</li><li>Free notes and tests</li><li>Unlimited practice tests</li>
        </ul>
      </div>
      <div className="hero-art">
        <Peek />
        <DemoForm id="demo" classes={classes.map(([k, c]) => [k, c.label])} boards={BOARDS} />
      </div>
    </div></section>

    <section className="wrap">
      <div className="stats reveal">
        <div className="stat"><CountUp n={all.length} /><span>chapters, Class 8 to 10</span></div>
        <div className="stat"><CountUp n={pdfCount} /><span>free PDFs: notes, formulas, DPP</span></div>
        <div className="stat"><CountUp n={testQs} /><span>test questions with explanations</span></div>
        <div className="stat"><CountUp n={2} /><span>boards: CBSE and ICSE</span></div>
      </div>
    </section>

    <Continue />

    <section className="section" id="classes"><div className="wrap">
      <div className="section-head center reveal"><span className="kicker">Start here</span><h2>Which class are you in?</h2><p>Pick your class to see everything for it: chapters, tests, live classes and help with doubts.</p></div>
      <ChapterSearch chapters={finder} />
      <div className="grid">
        {classes.map(([k, c]) => (
          <Link key={k} href={`/${k}`} className="tile big" data-no={c.label.replace(/\D/g, '')}><h3>{c.label}</h3>
            <span>CBSE and ICSE · {c.chapters.length} chapters</span><span className="go">Open {c.label} →</span></Link>))}
        <Link href="/olympiad" className="tile big" data-no="★"><h3>Olympiad</h3><span>SOF IMO preparation</span><span className="go">Open Olympiad →</span></Link>
      </div>
    </div></section>

    <section className="section soft"><div className="wrap">
      <div className="section-head center reveal"><span className="kicker">Your path</span><h2>From “I can’t do maths” to “I can do this”</h2><p>Four stages, and a free tool for each one.</p></div>
      <ol className="roadmap">
        {ROADMAP.map(r => (
          <li key={r.stage} className="reveal"><Link href={r.href} className="rm"><span className="st">{r.stage}</span><h3>{r.title}</h3><p>{r.text}</p><span className="go">{r.go} →</span></Link></li>))}
      </ol>
    </div></section>

    <section className="section" id="programmes"><div className="wrap">
      <div className="section-head center reveal"><span className="kicker">Programmes</span><h2>Choose how your child learns</h2><p>Start free. Move to classes with a teacher when you are ready.</p></div>
      <div className="grid plans">
        {PROGRAMMES.map((p, i) => (
          <div key={p.name} className={`card plan reveal${p.hot ? ' hot' : ''}`}>
            <PlanIcon i={i} />
            <span className={`badge ${p.hot ? 'live' : 'self'}`}>{p.tag}</span>
            <h3>{p.name}</h3>
            <p>{p.line}</p>
            <ul>{p.gets.map(g => <li key={g}>{g}</li>)}</ul>
            <Link className={`btn ${p.hot ? 'btn-sun' : 'btn-outline'}`} href={p.href}>{p.go}</Link>
          </div>))}
      </div>
    </div></section>

    <PracticeSpotlight />

    <section className="section"><div className="wrap">
      <div className="section-head center reveal"><span className="kicker">Stay on track</span><h2>Tools for the student and the parent</h2><p>Everything is free to try. A free account saves your scores.</p></div>
      <div className="grid">
        {TOOLS.map((t, i) => (
          <div key={t.title} className={`card tool f${i % 4 + 1} reveal`}>
            <h3>{t.title}</h3><p>{t.text}</p>
            {t.href === 'TELEGRAM' ? <a className="go" href={SITE.telegram}>{t.go} →</a> : <Link className="go" href={t.href}>{t.go} →</Link>}
          </div>))}
      </div>
    </div></section>

    <section className="section soft"><div className="wrap">
      <div className="section-head center reveal"><span className="kicker">How we teach</span><h2>The {SITE.name} approach</h2><p>Six habits that take a child from “I can’t do maths” to “I can do this”.</p></div>
      <div className="grid">
        {APPROACH.map((a, i) => (
          <div key={a.title} className={`card approach f${i % 4 + 1} reveal`}><ApproachIcon i={i} /><h3>{a.title}</h3><p>{a.text}</p></div>))}
      </div>
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
            <Worry /><q>{f.worry}</q>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
            <span className="go">{f.go} →</span>
          </Link>))}
      </div>
    </div></section>

    <section className="section"><div className="wrap">
      <div className="banner reveal">
        <Trophy />
        <div style={{flex:1}}><h2>Preparing for SOF IMO?</h2><p>See how to prepare alongside your school syllabus.</p></div>
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
        <div><h2>Not sure where to begin?</h2><p>Book a free demo class and we will help you choose. Daily problems are on Telegram and video lessons on YouTube.</p></div>
        <div className="cta-row">
          <Link className="btn btn-sun" href="/demo">Book a free demo class</Link>
          <a className="btn btn-ghost" href={SITE.telegram}>Join Telegram</a>
          <a className="btn btn-ghost" href={SITE.youtube}>Watch on YouTube</a>
        </div>
      </div>
    </div></section>
  </>);
}
