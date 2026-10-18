import Link from 'next/link';
import ChapterSearch from '@/components/ChapterSearch';
import { BOARDS, CLASSES } from '@/lib/data';
import PDFS from '@/lib/pdfs.json';

export const metadata = { title: 'Maths Notes, Formulas, DPP and PYQ: Class 8-10',
  description: 'Free Maths PDFs for Class 8, 9 and 10 (CBSE and ICSE): short notes, formula bank, DPP sheets and Class 10 previous year questions.',
  alternates: { canonical: '/self-study' } };

const MATERIAL = [
  { icon: '✎', title: 'Short Notes', text: 'Each topic explained in a few lines, with solved examples and common mistakes.' },
  { icon: 'ƒ', title: 'Formula Bank', text: 'Every formula and result of the chapter on one sheet for quick revision.' },
  { icon: '✓', title: 'DPP Sheet', text: 'Daily practice problems for the chapter, with an answer key.' },
  { icon: '★', title: 'PYQ (Class 10)', text: 'Previous year board questions arranged topic-wise, with solutions in a separate PDF.' },
  { icon: '§', title: 'NCERT Solutions (CBSE)', text: 'Step-by-step solutions to the textbook exercises, added chapter by chapter.' },
];

const STEPS = [
  { title: 'Read the short notes', text: 'Go through the notes and work each solved example yourself.' },
  { title: 'Revise the formula bank', text: 'Read the one-page formula sheet until you can write it from memory.' },
  { title: 'Solve the DPP', text: 'Attempt the practice sheet without looking, then check the answer key.' },
  { title: 'Finish with PYQ', text: 'In Class 10, solve the previous year questions of the chapter last.' },
];

export default function SelfStudy() {
  const classes = Object.entries(CLASSES);
  const finder = classes.flatMap(([k, c]) => c.chapters.map(ch => ({ cls: k, label: c.label, boards: ch.boards, title: ch.title, slug: ch.slug })));
  return (<>
    <section className="sp-hero"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>Self Study</div>
      <span className="sp-eyebrow">Free · No sign-up · CBSE and ICSE</span>
      <h1>Every chapter, <span className="h3-grad">ready to study</span></h1>
      <p>Free PDFs for every chapter of Class 8, 9 and 10 Maths: short notes, a formula bank and a DPP sheet. Pick your class and board, open a chapter and start.</p>
      <div className="cta-row" style={{ marginTop: '1.4rem' }}>
        <Link className="btn btn-sun" href="#classes">Choose your class</Link>
        <Link className="btn h3-ghost" href="/start">I am weak in maths</Link>
      </div>
    </div></section>

    <section className="section"><div className="wrap">
      <div className="section-head center"><span className="kicker">Search</span><h2>Find a chapter</h2></div>
      <ChapterSearch chapters={finder} />
    </div></section>

    <section className="section soft" id="classes"><div className="wrap">
      <div className="section-head center"><span className="kicker">Your syllabus</span><h2>Choose your class and board</h2></div>
      <div className="rl-classes">
        {classes.flatMap(([k, c]) => BOARDS.map(b => {
          const list = c.chapters.filter(ch => ch.boards.includes(b));
          if (!list.length) return null;
          const pyq = list.filter(ch => (PDFS[`${k}/${ch.slug}`] || []).includes('pyq')).length;
          return (<Link key={k + b} href={`/${k}`} className="rl-class reveal">
            <h3>{c.label} {b}</h3>
            <p>{list.length} chapters · {list[0].part}</p>
            <ul className="ss-list">
              <li>Notes, formula bank and DPP for every chapter</li>
              {pyq > 0 && <li>Previous year questions for {pyq} chapters</li>}
            </ul>
            <span className="rl-status on">Open chapters →</span>
          </Link>);
        }))}
      </div>
    </div></section>

    <section className="section"><div className="wrap">
      <div className="section-head center"><span className="kicker">Inside every chapter</span><h2>What you get</h2></div>
      <div className="sp-steps auto">
        {MATERIAL.map(m => <div key={m.title} className="sp-step"><b aria-hidden="true">{m.icon}</b><h3>{m.title}</h3><p>{m.text}</p></div>)}
      </div>
    </div></section>

    <section className="section soft"><div className="wrap">
      <div className="section-head center"><span className="kicker">How to use it</span><h2>Four steps for every chapter</h2></div>
      <div className="sp-steps">
        {STEPS.map((s, i) => <div key={s.title} className="sp-step"><b>{i + 1}</b><h3>{s.title}</h3><p>{s.text}</p></div>)}
      </div>
    </div></section>

    <section className="section"><div className="wrap">
      <div className="section-head center"><span className="kicker">After the chapter</span><h2>Papers and tests</h2></div>
      <div className="grid">
        <Link href="/sample-papers" className="tile"><h3>Sample Papers</h3><span>Full-length MathSetu papers with solutions</span><span className="go">Open →</span></Link>
        <Link href="/tests" className="tile"><h3>Test Series</h3><span>Timed online chapter tests with instant score</span><span className="go">Open →</span></Link>
        <Link href="/practice" className="tile"><h3>Practice Generator</h3><span>Make your own test on the topics you choose</span><span className="go">Open →</span></Link>
      </div>
      <div className="banner" style={{ marginTop: '2rem' }}>
        <div><h2>Preparing for SOF IMO?</h2><p>See what to study beyond the school syllabus.</p></div>
        <Link className="btn btn-sun" href="/olympiad">Olympiad preparation</Link>
      </div>
    </div></section>
  </>);
}
