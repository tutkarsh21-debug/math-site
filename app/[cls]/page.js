import { Fragment } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BOARDS, CLASSES } from '@/lib/data';
import PDFS from '@/lib/pdfs.json';

export const generateStaticParams = () => Object.keys(CLASSES).map(cls => ({ cls }));
export async function generateMetadata({ params }) {
  const { cls } = await params;
  const c = CLASSES[cls];
  return c ? { title: `${c.label} Maths Chapters | CBSE & ICSE`, description: `${c.label} Maths chapter-wise videos, notes and practice for CBSE and ICSE.` } : {};
}

export default async function ClassPage({ params }) {
  const { cls } = await params;
  const c = CLASSES[cls]; if (!c) notFound();
  // One tab per board, with chapters grouped by book or book part.
  const boards = BOARDS.map(b => {
    const list = c.chapters.filter(ch => ch.boards.includes(b));
    const parts = [...new Set(list.map(ch => ch.part))];
    return { b, list, groups: parts.map(p => ({ title: p, items: list.filter(ch => ch.part === p) })) };
  }).filter(x => x.list.length);
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>{c.label}</div>
      <h1>{c.label} Maths</h1>
      <p>{boards.map(x => `${x.list.length} ${x.b} chapters`).join(' and ')}, with video lessons in Hinglish, plus short notes, a formula bank and a DPP sheet for each chapter.</p>
    </div></div>
    <section className="section"><div className="wrap tabs">
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
              <span><strong>{ch.title}</strong>
                {PDFS[`${cls}/${ch.slug}`] && <span className="tag ready">Notes · Formulas · DPP</span>}</span>
            </Link>))}
          </div>
        </div>))}
      </div>))}
    </div></section>
  </>);
}
