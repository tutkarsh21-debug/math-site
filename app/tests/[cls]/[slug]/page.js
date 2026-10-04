import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd, { breadcrumbs } from '@/components/JsonLd';
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
  return ch ? { title: `${ch.title} MCQ Test | ${c.label} ${ch.boards[0]} Maths`, description: `Free online MCQ test for ${c.label} ${ch.boards[0]} Maths, ${ch.title}: 10 timed questions with answers and an explanation for each.` } : {};
}

export default async function TestPage({ params }) {
  const p = await params, { c, ch, test } = find(p);
  if (!ch) notFound();
  return (<>
    <JsonLd data={breadcrumbs([['Test Series', '/tests'], [`${ch.title} test`, `/tests/${p.cls}/${p.slug}`]])} />
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
