import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CLASSES } from '@/lib/data';

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
  const parts = [...new Set(c.chapters.map(ch => ch.part))];
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>{c.label}</div>
      <h1>{c.label} Maths</h1>
      <p>{c.chapters.length} chapters for CBSE and ICSE, with video lessons, notes and practice in Hindi + English.</p>
    </div></div>
    <section className="section"><div className="wrap">
      {parts.map(part => (<div key={part || 'all'} className="part">
        {part && <h2>{part}</h2>}
        <div className="grid">{c.chapters.filter(ch => ch.part === part).map((ch, i) => (
          <Link key={ch.slug} href={`/${cls}/${ch.slug}`} className="card chapter-card">
            <span className="num">{i + 1}</span>
            <span><strong>{ch.title}</strong><small>{ch.hi}</small>
              {ch.boards.map(b => <span key={b} className="tag">{b}</span>)}
              {ch.summary && <span className="tag ready">Notes + practice</span>}</span>
          </Link>))}
        </div>
      </div>))}
    </div></section>
  </>);
}
