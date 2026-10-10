import Link from 'next/link';
import { ApproachIcon, PlanIcon, Trophy, Worry } from '@/components/Art';
import { HeroGraph, HeroShowcase } from '@/components/HeroShowcase';
import ChapterSearch from '@/components/ChapterSearch';
import FeatureStack from '@/components/FeatureStack';
import WhiteboardStory from '@/components/WhiteboardStory';
import TalkToUs from '@/components/TalkToUs';
import { Continue } from '@/components/Progress';
import PracticeSpotlight from '@/components/PracticeSpotlight';
import JsonLd from '@/components/JsonLd';
import { APPROACH, BOARDS, CHANGES, QUOTES, CLASSES, PROGRAMMES, ROADMAP, SITE, TEACHER, TESTIMONIALS, TOOLS } from '@/lib/data';
import { POSTS } from '@/lib/posts';

// Common worries about maths, each with what the site does about it. These are general worries, not quotes from students.
const FEARS = [
  { worry: 'I did not understand what was done on the board.', title: 'We start from the basics', text: 'Short notes explain every idea in plain words with solved examples, so you can go at your own speed and read a step again.', href: '/self-study', go: 'See the notes' },
  { worry: 'I understand in class but go blank in the exam.', title: 'Practice makes it stay', text: 'A daily practice sheet and a timed test for every chapter show you what you really know, well before the exam does.', href: '/tests', go: 'Try a test' },
  { worry: 'There are too many formulas to remember.', title: 'One page per chapter', text: 'The formula bank puts every formula of a chapter on a single sheet, ready for a quick revision the night before.', href: '/self-study', go: 'Open a formula bank' },
  { worry: 'I feel shy to ask my doubt in class.', title: 'Ask in private', text: 'Send your doubt with a photo and get a step-by-step answer from your teacher. Only you can see it.', href: '/doubts', go: 'Ask a doubt' },
];


const FAQ = [
  { q: 'How do I book a free demo class?', a: "Use the Free Demo button at the top of any page and fill in the short form with your child's class and board. We call you to fix a time. There is nothing to pay for the demo." },
  { q: 'What is 1-to-1 tuition?', a: "A live online class with one student and one teacher, that follows your child's syllabus, speed and gaps. The fee and timings are shared on a call. See the 1-to-1 Tuition page." },
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
    <section className="hero4">
      <div className="hero4-grid">
        <div className="hero4-copy">
          <h1>Maths that finally <span className="h4-grad">makes sense</span></h1>
          <p className="h4-sub">Free notes, chapter tests and unlimited practice, plus <mark>1-to-1 live classes</mark> with a teacher who follows <mark>your child's pace</mark>.</p>
          <ul className="h4-chips" aria-label="Classes and boards"><li>Class 8</li><li>Class 9</li><li>Class 10</li><li>CBSE</li><li>ICSE</li><li>Olympiad</li></ul>
          <div className="cta-row">
            <Link className="btn btn-sun h4-cta" href="/one-to-one">Explore 1-to-1 tuition <span aria-hidden="true">→</span></Link>
            <Link className="btn h4-soft" href="/practice">Try a free practice test</Link>
          </div>
        </div>
        <div className="hero4-art">
          <div className="h4-card"><HeroGraph /><HeroShowcase /></div>
          <span className="h4-float f1"><i /> LIVE 1:1 with your teacher</span>
          <span className="h4-float f2"><b>✓</b> Doubt solved on the whiteboard</span>
          <span className="h4-float f3">A new practice test <b>↻</b></span>
        </div>
      </div>
    </section>

    <section className="section fs-sec" id="one-to-one"><div className="wrap">
      <div className="section-head center reveal"><span className="kicker">1-to-1 Tuition</span><h2>1-to-1 tuition, built around <span className="hl">how students really learn</span></h2><p>One student and one teacher in a live online class, backed by practice, doubts and a progress record between classes.</p></div>
      <FeatureStack />
    </div></section>

    <section className="section soft wbs-sec" id="whiteboard"><div className="wrap">
      <div className="section-head center reveal"><span className="kicker">Doubts, solved properly</span><h2>Stuck? <span className="hl">Watch your teacher solve it</span></h2><p>No more &ldquo;I understood in class but not at home&rdquo;. The solution is written out on a whiteboard, recorded, and waiting for you.</p></div>
      <WhiteboardStory />
    </div></section>

    <section className="section" id="journey"><div className="wrap">
      <div className="section-head center reveal"><span className="kicker">Your path</span><h2>A learning journey that <span className="hl">builds step by step</span></h2><p>Four stages, and a free tool for each one.</p></div>
      <ol className="journey">
        {ROADMAP.map((r, i) => (
          <li key={r.stage} className={`reveal j${i % 4 + 1}`}><span className="j-node">{i + 1}</span>
            <Link href={r.href} className="j-card"><span className="j-stage">{r.stage}</span><h3>{r.title}</h3><p>{r.text}</p><span className="go">{r.go} →</span></Link></li>))}
      </ol>
    </div></section>

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

    <section className="section story" id="why"><div className="wrap">
      <div className="story-top reveal">
        <span className="kicker">Why {SITE.name}</span>
        <h2>Setu means bridge.<br />Every child can cross it.</h2>
        <p className="story-lead">On one bank stands a child who says, &ldquo;I can&rsquo;t do maths.&rdquo; On the other bank stands the same child, saying, &ldquo;Oh, now I get it.&rdquo;</p>
        <p>Between the two there is rarely a lack of talent. There is usually one missing idea from an earlier class, an explanation that went too fast, or a doubt that was never asked. {SITE.name} is the bridge. We find the missing idea, and we rebuild from there, one plank at a time.</p>
      </div>
      <div className="grid changes">
        {CHANGES.map((c, i) => (<div key={c.title} className={`card change f${i % 4 + 1} reveal`}><b className="chg-no" aria-hidden="true">{i + 1}</b><h3>{c.title}</h3><p>{c.text}</p></div>))}
      </div>
      <p className="story-note center">That is what we work towards in every class. We do not promise ranks. We promise to look for the missing idea, and to explain it until it makes sense.</p>
    </div></section>

    <section className="section soft quotes"><div className="wrap">
      <div className="section-head center reveal"><span className="kicker">Words worth keeping</span><h2>Why maths is worth loving</h2></div>
      <div className="quote-grid">
        {QUOTES.map((q, i) => (<figure key={q.text} className={`qcard q${i % 4 + 1} reveal`}>
          <span className="qmark" aria-hidden="true">&ldquo;</span>
          <blockquote>{q.text}</blockquote>
          <figcaption><b>{q.by}</b>{q.note && <small>{q.note}</small>}</figcaption>
        </figure>))}
      </div>
    </div></section>

    <Continue />

    <section className="section" id="classes"><div className="wrap">
      <div className="section-head center reveal"><span className="kicker">Start here</span><h2>Choose your <span className="hl">class and board</span></h2><p>Pick your class to see everything for it: chapters, tests, 1-to-1 classes and help with doubts.</p></div>
      <ChapterSearch chapters={finder} />
      <div className="track-grid">
        {classes.map(([k, c], i) => {
          const boards = BOARDS.filter(b => c.chapters.some(ch => ch.boards.includes(b)));
          return (<Link key={k} href={`/${k}`} className={`track-card t${i % 4 + 1} reveal`}>
            <span className="track-tag">{boards.join(' · ')}</span>
            <h3>{c.label} Maths</h3>
            <p>{c.chapters.length} chapters with notes, formula banks, tests and a practice generator.</p>
            <span className="go">Know more →</span>
            <b className="track-art" aria-hidden="true">{c.label.replace(/\D/g, '')}</b>
          </Link>);
        })}
        <Link href="/olympiad" className="track-card t4 reveal">
          <span className="track-tag">SOF IMO</span>
          <h3>Olympiad</h3>
          <p>How to prepare for the Olympiad alongside the school syllabus.</p>
          <span className="go">Know more →</span>
          <b className="track-art" aria-hidden="true">★</b>
        </Link>
      </div>
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
      <div className="section-head center reveal"><span className="kicker">Stay on track</span><h2>Tools that keep you on track</h2><p>Everything is free to try. A free account saves your scores.</p></div>
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
        <div><h2>Not sure where to begin?</h2><p>Message us with your child's class and board and we will help you choose. Daily problems are on Telegram and video lessons on YouTube.</p></div>
        <div className="cta-row">
          <TalkToUs>Talk to us</TalkToUs>
          <a className="btn btn-ghost" href={SITE.telegram}>Join Telegram</a>
          <a className="btn btn-ghost" href={SITE.youtube}>Watch on YouTube</a>
        </div>
      </div>
    </div></section>
  </>);
}
