import Link from 'next/link';
import { ApproachIcon, Peek, PlanIcon, Sky, Trophy, Worry } from '@/components/Art';
import { HeroKid, Laurel } from '@/components/HeroArt';
import ChapterSearch from '@/components/ChapterSearch';
import DemoForm from '@/components/DemoForm';
import { Continue } from '@/components/Progress';
import PracticeSpotlight from '@/components/PracticeSpotlight';
import JsonLd from '@/components/JsonLd';
import { APPROACH, BOARDS, CLASSES, PROGRAMMES, ROADMAP, SITE, TEACHER, TESTIMONIALS, TOOLS } from '@/lib/data';
import { POSTS } from '@/lib/posts';

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
  const latest = POSTS.filter(p => p.category === 'Blog').slice(0, 3);
  const day = d => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const finder = all.map(ch => ({ cls: ch.cls, label: ch.label, boards: ch.boards, title: ch.title, slug: ch.slug }));
  return (<>
    <section className="hero2"><Sky />
      <div className="hero2-in">
        <h1><span className="hl">Maths Made Simple</span><br />Online Maths for Class 8, 9 &amp; 10</h1>
        <p className="hero2-sub">Free notes, practice and tests, and live classes with a free demo. From the basics to the Olympiad.</p>
        <div className="cta-row center-row">
          <Link className="btn btn-sun" href="#demo">Book a free demo class</Link>
          <Link className="btn btn-outline" href="/start">I am weak in maths</Link>
        </div>
        <div className="hero2-stage">
          <Laurel className="l-left" top="Study material" big="FREE" bottom="Notes · DPP · Tests" />
          <HeroKid />
          <Laurel className="l-right" top="Made for" big="8 · 9 · 10" bottom="CBSE & ICSE" />
        </div>
      </div>
    </section>

    {latest.length > 0 && <section className="section blog-strip" id="blog"><div className="wrap">
      <div className="section-head center reveal"><span className="kicker">From the blog</span><h2>Study tips and exam help</h2><p>Short, practical articles for Class 8, 9 and 10 students and their parents.</p></div>
      <div className="grid">
        {latest.map(p => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="card reveal">
            <span className="muted small">{day(p.date)}</span>
            <h3 style={{ marginTop: '.3rem' }}>{p.title}</h3>
            <p>{p.summary}</p>
            <span className="go">Read the article →</span>
          </Link>))}
      </div>
      <p className="center" style={{ marginTop: '1.4rem' }}><Link className="btn btn-outline" href="/blog">See all articles</Link></p>
    </div></section>}

    <section className="section" id="demo-sec"><div className="wrap try-grid" style={{ alignItems: 'center' }}>
      <div className="reveal">
        <span className="kicker">Free demo class</span>
        <h2>Maths fear ends where <span className="hl">understanding</span> begins</h2>
        <p className="muted">Most children who fear maths are not weak at it: they missed one idea somewhere. {SITE.name} goes back to that idea and builds up from there, in simple Hinglish, one small step at a time.</p>
        <ul className="ticks">
          <li>Free demo class</li><li>CBSE and ICSE</li><li>Free notes and tests</li><li>Unlimited practice tests</li>
        </ul>
      </div>
      <div className="hero-art">
        <Peek />
        <DemoForm id="demo" classes={classes.map(([k, c]) => [k, c.label])} boards={BOARDS} />
      </div>
    </div></section>

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
