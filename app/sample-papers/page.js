import Link from 'next/link';
import PDFS from '@/lib/pdfs.json';
import PAPERS from '@/lib/papers.json';
import PdfLink from '@/components/PdfLink';

export const metadata = { title: 'MathSetu Sample Papers for Class 8, 9, 10 Maths | CBSE & ICSE',
  description: 'MathSetu sample papers in Maths with full solutions, set on the pattern of the CBSE and ICSE exams.',
  alternates: { canonical: '/sample-papers' } };

const STEPS = [
  { t: 'Revise first', d: 'Finish the chapters and read the formula sheet before you sit down with a paper.' },
  { t: 'Sit it like the exam', d: 'Set the timer for the full time, keep your phone away and write every answer on paper.' },
  { t: 'Check with the solutions', d: 'Mark yourself, and read the solution even for the questions you got right. Method marks matter.' },
  { t: 'Fix what went wrong', d: 'Note the topics you lost marks in, read their notes again and take a chapter test.' },
];

export default function SamplePapers() {
  const papers = Object.entries(PAPERS).filter(([id]) => PDFS[id]);
  return (<>
    <section className="sp-hero"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span><Link href="/self-study">Self Study</Link><span>/</span>Sample Papers</div>
      <span className="sp-eyebrow">Free · With full solutions</span>
      <h1>Practise the paper <span className="h3-grad">before the paper</span></h1>
      <p>Full-length papers written by MathSetu on the pattern of the board exam, each with a separate solutions PDF. They are not official board papers.</p>
    </div></section>

    <section className="section"><div className="wrap">
      {papers.length === 0 && <p className="muted">Sample papers are being prepared.</p>}
      <div className="sp-grid">{papers.map(([id, p]) => (
        <article key={id} className="sp-card reveal">
          <div className="sp-sheet" aria-hidden="true">
            <b>{p.board} · {p.class}</b>
            <span>Mathematics</span>
            <i /><i /><i className="s" />
            <em>{p.marks} marks</em>
          </div>
          <div className="sp-body">
            <span className="badge self">FREE</span> <span className="badge soon">{p.class} · {p.board}</span>
            <h3>{p.title}</h3>
            <ul className="sp-facts"><li><small>Marks</small><b>{p.marks}</b></li><li><small>Time</small><b>{p.time}</b></li><li><small>Solutions</small><b>{PDFS[id].includes('paper-solutions') ? 'Included' : 'Soon'}</b></li></ul>
            <div className="cta-row">
              <PdfLink className="btn btn-sun btn-sm" href={`/pdf/${id}/paper.pdf`} target="_blank" rel="noopener">Question paper</PdfLink>
              {PDFS[id].includes('paper-solutions') && <PdfLink className="btn btn-sm btn-outline" href={`/pdf/${id}/paper-solutions.pdf`} target="_blank" rel="noopener">Solutions</PdfLink>}
            </div>
          </div>
        </article>))}
      </div>
    </div></section>

    <section className="section soft"><div className="wrap">
      <div className="section-head center"><span className="kicker">How to use a sample paper</span><h2>Four steps that make a paper worth it</h2></div>
      <div className="sp-steps">
        {STEPS.map((s, i) => (<div key={s.t} className="sp-step"><b>{i + 1}</b><h3>{s.t}</h3><p>{s.d}</p></div>))}
      </div>
      <p className="center sp-more">Want questions chapter by chapter first?</p>
      <p className="center"><Link className="btn btn-sun" href="/tests">Take a chapter test</Link> <Link className="btn btn-outline" href="/practice">Build a practice test</Link></p>
    </div></section>
  </>);
}
