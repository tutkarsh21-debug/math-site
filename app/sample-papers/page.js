import Link from 'next/link';
import PDFS from '@/lib/pdfs.json';
import PAPERS from '@/lib/papers.json';

export const metadata = { title: 'MathSetu Sample Papers for Class 8, 9, 10 Maths | CBSE & ICSE',
  description: 'MathSetu sample papers in Maths with full solutions, set on the pattern of the CBSE and ICSE exams.' };

export default function SamplePapers() {
  const papers = Object.entries(PAPERS).filter(([id]) => PDFS[id]);
  const groups = [...new Set(papers.map(([, p]) => `${p.class} ${p.board}`))];
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span><Link href="/self-study">Self Study</Link><span>/</span>Sample Papers</div>
      <h1>MathSetu Sample Papers</h1>
      <p>Full-length practice papers written by MathSetu on the pattern of the board exam, each with a separate solutions PDF. They are not official board papers.</p>
    </div></div>
    <section className="section"><div className="wrap">
      {papers.length === 0 && <p className="muted">Sample papers are being prepared.</p>}
      {groups.map(g => (<div key={g} className="part">
        <h2>{g}</h2>
        <div className="grid">{papers.filter(([, p]) => `${p.class} ${p.board}` === g).map(([id, p]) => (
          <div key={id} className="card course">
            <span className="badge self">FREE</span>
            <h3>{p.title}</h3>
            <p>{p.marks} marks · {p.time}</p>
            <div className="cta-row">
              <a className="btn btn-sm" href={`/pdf/${id}/paper.pdf`} target="_blank" rel="noopener">Question paper</a>
              {PDFS[id].includes('paper-solutions') && <a className="btn btn-sm btn-outline" href={`/pdf/${id}/paper-solutions.pdf`} target="_blank" rel="noopener">Solutions</a>}
            </div>
          </div>))}
        </div>
      </div>))}
    </div></section>
  </>);
}
