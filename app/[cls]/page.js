import { Fragment } from 'react';
import Link from 'next/link';
import { DoneTick } from '@/components/Progress';
import { notFound } from 'next/navigation';
import JsonLd, { breadcrumbs } from '@/components/JsonLd';
import TalkToUs from '@/components/TalkToUs';
import { BOARDS, CLASSES } from '@/lib/data';
import PAPERS from '@/lib/papers.json';
import PDFS from '@/lib/pdfs.json';
import TESTS from '@/lib/tests.json';

export const generateStaticParams = () => Object.keys(CLASSES).map(cls => ({ cls }));
export async function generateMetadata({ params }) {
  const { cls } = await params;
  const c = CLASSES[cls];
  return c ? { title: `${c.label} Maths Notes, Formulas, DPP and Tests | CBSE & ICSE`, description: `${c.label} Maths for CBSE and ICSE: chapter-wise notes, formula banks, practice sheets, online tests, a practice generator and 1-to-1 live classes.` } : {};
}

// The steps of every chapter, the same for every class.
const STEPS = [
  { t: 'Learn', d: 'Read the short notes and the formula bank. Every idea is explained from what you already know.' },
  { t: 'Practise', d: 'Solve the DPP sheet, then make a fresh practice test on the chapter whenever you want one.' },
  { t: 'Test', d: 'Take the timed chapter test and read the explanation for each answer. Your weak topics are listed.' },
  { t: 'Ask', d: 'Stuck? Send a doubt with a photo and get a step-by-step answer, or ask about 1-to-1 classes.' },
];

export default async function ClassPage({ params }) {
  const { cls } = await params;
  const c = CLASSES[cls]; if (!c) notFound();
  // One tab per board, with chapters grouped by book or book part.
  const boards = BOARDS.map(b => {
    const list = c.chapters.filter(ch => ch.boards.includes(b));
    const parts = [...new Set(list.map(ch => ch.part))];
    return { b, list, groups: parts.map(p => ({ title: p, items: list.filter(ch => ch.part === p) })) };
  }).filter(x => x.list.length);
  const tests = Object.keys(TESTS).filter(id => id.startsWith(cls + '/')).length;
  const papers = Object.keys(PAPERS).filter(id => id.startsWith(cls + '/') && PDFS[id]).length;
  const hello = `Hello MathSetu, I would like to know about 1-to-1 Maths tuition for ${c.label} (CBSE / ICSE).`;
  // What a student of this class can do on the site. The chapter list is further down this page.
  const things = [
    { href: '#chapters', badge: 'FREE', kind: 'self', title: 'Study a chapter', text: `Short notes, a formula bank and a practice sheet for all ${c.chapters.length} chapters.`, go: 'See the chapters' },
    { href: '/practice', badge: 'NEW', kind: 'rec', title: 'Make a practice test', text: `Choose ${c.label} chapters and a level, and get a brand-new test every time, with an explanation for every answer.`, go: 'Make a test' },
    tests && { href: `/tests#${cls}`, badge: 'FREE', kind: 'self', title: 'Take a chapter test', text: `${tests} timed online tests, with your score and an explanation for every question.`, go: 'Open the tests' },
    papers && { href: '/sample-papers', badge: 'FREE', kind: 'self', title: 'Solve a sample paper', text: 'Full-length practice papers on the pattern of the exam, each with solutions.', go: 'Open sample papers' },
    { href: '/doubts', badge: 'HELP', kind: 'soon', title: 'Ask a doubt', text: 'Stuck on a question? Send it with a photo and get a step-by-step answer.', go: 'Ask now' },
    { href: '/one-to-one', badge: '1-TO-1', kind: 'live', title: `1-to-1 tuition for ${c.label}`, text: 'Your own teacher in a live online class that follows your pace, with practice and doubts between classes.', go: 'See how it works' },
    { href: `/live-courses#${cls}`, badge: 'LIVE', kind: 'live', title: 'Join the live course', text: 'Online classes with a teacher at a fixed time, with doubts solved in class.', go: 'See the live course' },
    { href: `/recorded-lectures#${cls}`, badge: 'RECORDED', kind: 'rec', title: 'Watch recorded lectures', text: 'Chapter-wise video lectures in Hinglish that you can watch any time.', go: 'See the lectures' },
  ].filter(Boolean);
  const faq = [
    { q: `Which boards does the ${c.label} page cover?`, a: `${boards.map(x => `${x.b} (${x.list.length} chapters)`).join(' and ')}. Each board has its own chapter list, so you only see the chapters of your syllabus.` },
    { q: `Is the ${c.label} study material free?`, a: 'Yes. The notes, formula banks, DPP sheets and online tests can be used without an account. A free account is needed only to save your test scores and practice history.' },
    { q: 'How do I get a doubt solved?', a: 'Log in, open Ask a Doubt and send the question with a photo. Your teacher replies with a step-by-step answer, and you see a notification when it is ready.' },
    { q: `What is 1-to-1 tuition for ${c.label}?`, a: 'A live online class with one student and one teacher, that follows your syllabus, speed and gaps. The fee and timings are shared on a call. See the 1-to-1 Tuition page for details.' },
  ];
  return (<>
    <JsonLd data={breadcrumbs([[`${c.label} Maths`, `/${cls}`]])} />
    <section className="sp-hero"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>{c.label}</div>
      <span className="sp-eyebrow"><i className="lv-dot" /> {c.label} Maths · {boards.map(x => x.b).join(' · ')}</span>
      <h1>{c.label} Maths, <span className="h3-grad">one clear step at a time</span></h1>
      <p>Everything for {c.label} in one place: notes, formula banks, tests and a practice generator, and 1-to-1 live classes when you want a teacher of your own.</p>
      <div className="cta-row" style={{ marginTop: '1.4rem' }}>
        <TalkToUs text={hello}>Ask about 1-to-1 for {c.label}</TalkToUs>
        <a className="btn h3-ghost" href="#chapters">Browse the chapters</a>
      </div>
      <ul className="h3-chips" aria-label={`What is in ${c.label}`}>
        {boards.map(x => <li key={x.b}>{x.list.length} {x.b} chapters</li>)}
        {tests > 0 && <li>{tests} chapter tests</li>}
        <li>Practice generator</li>
      </ul>
    </div></section>

    <section className="section"><div className="wrap">
      <div className="section-head center"><span className="kicker">Your {c.label} toolkit</span><h2>Everything you need, <span className="hl">in one place</span></h2></div>
      <div className="grid">
        {things.map((t, i) => (
          <Link key={t.title} href={t.href} className={`card tool f${i % 4 + 1}`}>
            <span className={`badge ${t.kind}`} style={{ alignSelf: 'flex-start' }}>{t.badge}</span>
            <h3 style={{ marginTop: '.6rem' }}>{t.title}</h3>
            <p>{t.text}</p>
            <span className="go">{t.go} →</span>
          </Link>))}
      </div>
    </div></section>

    <section className="section soft"><div className="wrap">
      <div className="section-head center"><span className="kicker">Choose your board</span><h2>Your syllabus, chapter by chapter</h2><p>Each board has its own chapter list, so you only see what is in your book.</p></div>
      <div className="grid board-cards">
        {boards.map(({ b, list }, i) => {
          const withNotes = list.filter(ch => PDFS[`${cls}/${ch.slug}`]).length, withTests = list.filter(ch => TESTS[`${cls}/${ch.slug}`]).length;
          return (<a key={b} href="#chapters" className={`card board-card f${i % 4 + 1}`}>
            <span className="badge self">{b}</span>
            <h3>{b} {c.label} Maths</h3>
            <ul><li>{list.length} chapters</li><li>{withNotes} with notes, formulas and DPP</li><li>{withTests} with a timed chapter test</li></ul>
            <span className="go">Open the {b} chapters →</span>
          </a>);
        })}
      </div>
    </div></section>

    <section className="section"><div className="wrap">
      <div className="section-head center"><span className="kicker">How a chapter works</span><h2>Four steps for every chapter</h2></div>
      <div className="sp-steps">
        {STEPS.map((x, i) => (<div key={x.t} className="sp-step"><b>{i + 1}</b><h3>{x.t}</h3><p>{x.d}</p></div>))}
      </div>
    </div></section>

    <section className="section"><div className="wrap">
      <div className="banner">
        <div style={{ flex: 1 }}><h2>Want a teacher of your own for {c.label}?</h2><p>1-to-1 live classes that follow your pace, with practice and doubts between classes. Fee and timings are shared on a call.</p></div>
        <div className="cta-row">
          <TalkToUs text={hello}>Ask about a trial class</TalkToUs>
          <Link className="btn btn-ghost" href="/one-to-one">How 1-to-1 works</Link>
        </div>
      </div>
    </div></section>

    <section className="section soft" id="chapters"><div className="wrap">
      <div className="section-head"><h2>{c.label} chapters</h2><p>Choose your board, then open a chapter.</p></div>
    </div><div className="wrap tabs">
      {boards.map(({ b, list }, i) => (<Fragment key={b}>
        <input type="radio" name="board" id={`board-${b}`} defaultChecked={i === 0} />
        <label htmlFor={`board-${b}`}>{b} <small>{list.length}</small></label>
      </Fragment>))}
      {boards.map(({ b, groups }) => (<div key={b} className="tab-panel">
        {groups.map(g => (<div key={g.title || b} className="part">
          {g.title && <h2>{g.title}</h2>}
          <div className="grid">{g.items.map((ch, i) => (
            <Link key={ch.slug} href={`/${cls}/${ch.slug}`} className="card chapter-card">
              <span className="num">{ch.no || i + 1}</span>
              <span><strong>{ch.title}<DoneTick id={`${cls}/${ch.slug}`} /></strong>
                {PDFS[`${cls}/${ch.slug}`] && <span className="tag ready">Notes · Formulas · DPP</span>}</span>
            </Link>))}
          </div>
        </div>))}
      </div>))}
    </div></section>

    <section className="section"><div className="wrap narrow">
      <div className="section-head center"><span className="kicker">FAQ</span><h2>{c.label} questions</h2></div>
      {faq.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }} />
    </div></section>
  </>);
}
