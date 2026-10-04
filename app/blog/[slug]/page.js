import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd, { breadcrumbs } from '@/components/JsonLd';
import { SITE } from '@/lib/data';
import { POSTS } from '@/lib/posts';

export const generateStaticParams = () => POSTS.map(p => ({ slug: p.slug }));
export async function generateMetadata({ params }) {
  const { slug } = await params, p = POSTS.find(x => x.slug === slug);
  return p ? { title: p.title, description: p.summary, openGraph: { type: 'article', title: p.title, description: p.summary, publishedTime: p.date, images: ['/og.png'] } } : {};
}

export default async function Post({ params }) {
  const { slug } = await params, p = POSTS.find(x => x.slug === slug);
  if (!p) notFound();
  const others = POSTS.filter(x => x.slug !== slug).slice(0, 3);
  return (<>
    <JsonLd data={breadcrumbs([['Blog', '/blog'], [p.title, `/blog/${slug}`]])} />
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.summary, datePublished: p.date, dateModified: p.date,
      mainEntityOfPage: `${SITE.url}/blog/${slug}`, image: `${SITE.url}/og.png`, author: { '@id': `${SITE.url}/#org` }, publisher: { '@id': `${SITE.url}/#org` } }} />
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span><Link href="/blog">Blog</Link><span>/</span>{p.category}</div>
      <h1>{p.title}</h1>
      <p>{new Date(p.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
    </div></div>
    <div className="wrap prose">
      {p.body.map((b, i) => typeof b === 'string' ? <p key={i}>{b}</p>
        : b.h ? <h2 key={i}>{b.h}</h2>
        : <ul key={i}>{b.list.map(x => <li key={x}>{x}</li>)}</ul>)}
      {p.source && <p>Official notice: <a href={p.source} target="_blank" rel="noopener">{p.source}</a></p>}
      <h2>Read next</h2>
      <ul>{others.map(o => <li key={o.slug}><Link href={`/blog/${o.slug}`}>{o.title}</Link></li>)}</ul>
    </div>
  </>);
}
