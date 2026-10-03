import Link from 'next/link';
import { notFound } from 'next/navigation';
import Test from '@/components/Test';
import { CLASSES } from '@/lib/data';
import TESTS from '@/lib/tests.json';

export const generateStaticParams = () => Object.keys(TESTS).map(id => { const [cls, slug] = id.split('/'); return { cls, slug }; });

const find = ({ cls, slug }) => {
  const c = CLASSES[cls], ch = c?.chapters.find(x => x.slug === slug), test = TESTS[`${cls}/${slug}`];
  return ch && test ? { c, ch, test } : {};
};

export async function generateMetadata({ params }) {
  const p = await params, { c, ch } = find(p);
  return ch ? { title: `${ch.title} Chapter Test | ${c.label} ${ch.boards[0]}`, description: `Online chapter test for ${c.label} ${ch.title}: timed MCQs with answers and explanations.` } : {};
}

export default async function TestPage({ params }) {
  const p = await params, { c, ch, test } = find(p);
  if (!ch) notFound();
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span><Link href="/tests">Test Series</Link><span>/</span>{ch.title}</div>
      <h1>{ch.title}: Chapter Test</h1>
      <p><span className="tag">{c.label}</span>{ch.boards.map(b => <span key={b} className="tag">{b}</span>)}</p>
    </div></div>
    <section className="section"><div className="wrap narrow">
      <Test id={`${p.cls}/${p.slug}`} title={`${ch.title} (${c.label} ${ch.boards[0]})`} test={test} back={`/${p.cls}/${p.slug}`} />
    </div></section>
  </>);
}
