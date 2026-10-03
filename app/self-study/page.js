import Link from 'next/link';
import { BOARDS, CLASSES } from '@/lib/data';
import PDFS from '@/lib/pdfs.json';

export const metadata = { title: 'Self Study: Maths Notes, Formula Bank, DPP and PYQ | Class 8, 9, 10',
  description: 'Free Maths PDFs for Class 8, 9 and 10 (CBSE and ICSE): short notes, formula bank, DPP sheets and Class 10 previous year questions.' };

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
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>Self Study</div>
      <h1>Self Study (Class 8-10)</h1>
      <p>Free PDFs for every chapter of CBSE and ICSE Maths. Pick your class and board, open a chapter and start.</p>
    </div></div>

    <section className="section"><div className="wrap">
      <div className="section-head"><h2>Choose your class and board</h2></div>
      <div className="grid">
        {classes.flatMap(([k, c]) => BOARDS.map(b => {
          const list = c.chapters.filter(ch => ch.boards.includes(b));
          if (!list.length) return null;
          const pyq = list.filter(ch => (PDFS[`${k}/${ch.slug}`] || []).includes('pyq')).length;
          return (<Link key={k + b} href={`/${k}`} className="card course">
            <span className="badge self">FREE</span>
            <h3>{c.label} {b}</h3>
            <p>{list.length} chapters · {list[0].part}</p>
            <ul>
              <li>Short notes, formula bank and DPP for every chapter</li>
              {pyq > 0 && <li>Previous year questions for {pyq} chapters</li>}
            </ul>
            <span className="go">Open chapters →</span>
          </Link>);
        }))}
      </div>
    </div></section>

    <section className="section soft"><div className="wrap">
      <div className="section-head"><h2>Papers and tests</h2></div>
      <div className="grid">
        <Link href="/sample-papers" className="tile"><h3>Sample Papers</h3><span>Full-length MathSetu papers with solutions</span><span className="go">Open →</span></Link>
        <Link href="/tests" className="tile"><h3>Test Series</h3><span>Timed online chapter tests with instant score</span><span className="go">Open →</span></Link>
      </div>
    </div></section>

    <section className="section"><div className="wrap">
      <div className="section-head"><h2>What each chapter has</h2></div>
      <div className="grid">
        {MATERIAL.map(m => <div key={m.title} className="card"><div className="icon" aria-hidden="true">{m.icon}</div><h3>{m.title}</h3><p>{m.text}</p></div>)}
      </div>
    </div></section>

    <section className="section soft"><div className="wrap">
      <div className="section-head"><h2>How to use it</h2></div>
      <div className="grid steps">
        {STEPS.map(s => <div key={s.title} className="step"><h3>{s.title}</h3><p>{s.text}</p></div>)}
      </div>
    </div></section>

    <section className="section"><div className="wrap">
      <div className="banner">
        <div><h2>Preparing for SOF IMO?</h2><p>See what to study beyond the school syllabus.</p></div>
        <Link className="btn btn-sun" href="/olympiad">Olympiad preparation</Link>
      </div>
    </div></section>
  </>);
}
