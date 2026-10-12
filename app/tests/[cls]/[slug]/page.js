import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd, { breadcrumbs } from '@/components/JsonLd';
import Test from '@/components/Test';
import { CLASSES } from '@/lib/data';
import { findOlyTopic } from '@/lib/olympiad';
import TESTS from '@/lib/tests.json';

export const generateStaticParams = () => Object.keys(TESTS).map(id => { const [cls, slug] = id.split('/'); return { cls, slug }; });

// A chapter test of a class, or (cls = 'olympiad') the subject test of an Olympiad topic.
const find = ({ cls, slug }) => {
  const test = TESTS[`${cls}/${slug}`];
  if (cls === 'olympiad') {
    const t = findOlyTopic(slug);
    return t && test ? { c: { label: 'Olympiad' }, ch: { title: t.title, boards: [t.group.tab] }, test, back: `/olympiad/${slug}`, olympiad: true } : {};
  }
  const c = CLASSES[cls], ch = c?.chapters.find(x => x.slug === slug);
  return ch && test ? { c, ch, test, back: `/${cls}/${slug}` } : {};
};

export async function generateMetadata({ params }) {
  const p = await params, { c, ch, olympiad } = find(p);
  if (!ch) return {};
  return olympiad
    ? { title: `${ch.title} Test | Olympiad ${ch.boards[0]}`, description: `Free online test on ${ch.title} for Olympiad preparation: 10 timed questions with answers and an explanation for each.` }
    : { title: `${ch.title} MCQ Test | ${c.label} ${ch.boards[0]} Maths`, description: `Free online MCQ test for ${c.label} ${ch.boards[0]} Maths, ${ch.title}: 10 timed questions with answers and an explanation for each.` };
}

export default async function TestPage({ params }) {
  const p = await params, { c, ch, test, back, olympiad } = find(p);
  if (!ch) notFound();
  return (<>
    <JsonLd data={breadcrumbs([['Test Series', '/tests'], [`${ch.title} test`, `/tests/${p.cls}/${p.slug}`]])} />
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span><Link href="/tests">Test Series</Link><span>/</span>{ch.title}</div>
      <h1>{ch.title}: {olympiad ? 'Subject Test' : 'Chapter Test'}</h1>
      <p><span className="tag">{c.label}</span>{ch.boards.map(b => <span key={b} className="tag">{b}</span>)}</p>
    </div></div>
    <section className="section"><div className="wrap narrow">
      <Test id={`${p.cls}/${p.slug}`} title={olympiad ? `${ch.title} (Olympiad ${ch.boards[0]})` : `${ch.title} (${c.label} ${ch.boards[0]})`} test={test} back={back} cls={p.cls} topic={{ ch: p.slug, label: ch.title }} />
    </div></section>
  </>);
}
