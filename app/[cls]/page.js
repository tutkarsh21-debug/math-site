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
  return (<>
    <h1>{c.label} Maths</h1>
    <div className="grid">{c.chapters.map(ch => (
      <Link key={ch.slug} href={`/${cls}/${ch.slug}`} className="card">
        <strong>{ch.title}</strong><br /><small>{ch.hi}</small><br />
        {ch.boards.map(b => <span key={b} className="tag">{b}</span>)}
      </Link>))}
    </div>
  </>);
}
