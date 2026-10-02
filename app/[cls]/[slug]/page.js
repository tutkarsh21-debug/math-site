import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CLASSES, SITE } from '@/lib/data';

export const dynamicParams = false;
export const generateStaticParams = () =>
  Object.entries(CLASSES).flatMap(([cls, c]) => c.chapters.map(ch => ({ cls, slug: ch.slug })));

const find = ({ cls, slug }) => {
  const c = CLASSES[cls]; if (!c) return {};
  const i = c.chapters.findIndex(x => x.slug === slug);
  return { c, i, ch: c.chapters[i] };
};

export async function generateMetadata({ params }) {
  const p = await params;
  const { c, ch } = find(p); if (!ch) return {};
  return { title: `${ch.title} ${c.label} | ${ch.boards.join(' & ')} Notes + Video`,
    description: ch.summary || `${c.label} ${ch.title} (${ch.hi}): video lesson, formulas, examples and practice for ${ch.boards.join(' and ')}.`,
    alternates: { canonical: `/${p.cls}/${p.slug}` } };
}

export default async function Chapter({ params }) {
  const p = await params;
  const { c, i, ch } = find(p); if (!ch) notFound();
  const prev = c.chapters[i - 1], next = c.chapters[i + 1];
  const faq = ch.faq || [];
  const ld = faq.length ? { '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) } : null;
  return (<article>
    {ld && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />}
    <h1>{ch.title} {c.label} ({ch.hi})</h1>
    <p>{ch.boards.map(b => <span key={b} className="tag">{b}</span>)}</p>
    {ch.summary && <p>{ch.summary}</p>}
    {ch.youtube
      ? <iframe className="video" src={`https://www.youtube.com/embed/${ch.youtube}`} title={ch.title} allowFullScreen loading="lazy" />
      : <div className="video ph">Video coming soon</div>}
    {ch.formulas && <><h2>Key formulas</h2><ul>{ch.formulas.map(f => <li key={f}>{f}</li>)}</ul></>}
    {ch.concept && <><h2>Concept explained</h2><p>{ch.concept}</p></>}
    {ch.examples && <><h2>Solved examples</h2>{ch.examples.map(e => (
      <details key={e.q} className="card"><summary>{e.q}</summary><p>{e.a}</p></details>))}</>}
    {ch.mistakes && <><h2>Common mistakes</h2><ul>{ch.mistakes.map(m => <li key={m}>{m}</li>)}</ul></>}
    {ch.practice && <><h2>Practice questions</h2><ol>{ch.practice.map(p => <li key={p}>{p}</li>)}</ol></>}
    {faq.length > 0 && <><h2>FAQ</h2>{faq.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</>}
    <p style={{marginTop:'2rem'}}><a className="btn" href={SITE.telegram}>Join Telegram for daily problems</a></p>
    <p style={{display:'flex',justifyContent:'space-between'}}>
      {prev ? <Link href={`/${p.cls}/${prev.slug}`}>← {prev.title}</Link> : <span />}
      {next && <Link href={`/${p.cls}/${next.slug}`}>{next.title} →</Link>}
    </p>
  </article>);
}
