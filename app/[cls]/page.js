import { Fragment } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BOARDS, CLASSES } from '@/lib/data';

export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(CLASSES).map(cls => ({ cls }));
export async function generateMetadata({ params }) {
  const { cls } = await params;
  const c = CLASSES[cls];
  return c ? { title: `${c.label} Maths Chapters | CBSE & ICSE`, description: `${c.label} Maths chapter-wise videos, notes and practice for CBSE and ICSE.` } : {};
}

export default async function ClassPage({ params }) {
  const { cls } = await params;
  const c = CLASSES[cls]; if (!c) notFound();
  // One tab per board. CBSE chapters are grouped by book part; ICSE is a single list.
  const boards = BOARDS.map(b => {
    const list = c.chapters.filter(ch => ch.boards.includes(b));
    const parts = b === 'CBSE' ? [...new Set(list.map(ch => ch.part))] : [null];
    return { b, list, groups: parts.map(p => ({ title: p, items: p === null ? list : list.filter(ch => ch.part === p) })) };
  }).filter(x => x.list.length);
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>{c.label}</div>
      <h1>{c.label} Maths</h1>
      <p>{boards.map(x => `${x.list.length} ${x.b} chapters`).join(' and ')}, with video lessons, notes and practice in Hindi + English.</p>
    </div></div>
    <section className="section"><div className="wrap boards">
      {boards.map(({ b, list }, i) => (<Fragment key={b}>
        <input type="radio" name="board" id={`board-${b}`} defaultChecked={i === 0} />
        <label htmlFor={`board-${b}`}>{b} <small>{list.length}</small></label>
      </Fragment>))}
      {boards.map(({ b, groups }) => (<div key={b} className={`board-panel panel-${b}`}>
        {groups.map(g => (<div key={g.title || b} className="part">
          {g.title && <h2>{g.title}</h2>}
          <div className="grid">{g.items.map((ch, i) => (
            <Link key={ch.slug} href={`/${cls}/${ch.slug}`} className="card chapter-card">
              <span className="num">{(b === 'CBSE' && ch.no) || i + 1}</span>
              <span><strong>{ch.title}</strong>
                {ch.boards.map(x => <span key={x} className="tag">{x}</span>)}
                {ch.summary && <span className="tag ready">Notes + practice</span>}</span>
            </Link>))}
          </div>
        </div>))}
      </div>))}
    </div></section>
  </>);
}
