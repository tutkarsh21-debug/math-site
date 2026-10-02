import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CLASSES, SITE } from '@/lib/data';

export const generateStaticParams = () =>
  Object.entries(CLASSES).flatMap(([cls, c]) => c.chapters.map(ch => ({ cls, slug: ch.slug })));

// list = the chapters of the same board as this chapter, so prev/next and the sidebar stay within one board.
const find = ({ cls, slug }) => {
  const c = CLASSES[cls]; if (!c) return {};
  const ch = c.chapters.find(x => x.slug === slug); if (!ch) return { c };
  const board = ch.boards[0];
  const list = c.chapters.filter(x => x.boards.includes(board));
  return { c, ch, board, list, i: list.indexOf(ch) };
};

export async function generateMetadata({ params }) {
  const p = await params;
  const { c, ch } = find(p); if (!ch) return {};
  return { title: `${ch.title} ${c.label} | ${ch.boards.join(' & ')} Notes + Video`,
    description: ch.summary || `${c.label} ${ch.title}: video lesson, formulas, examples and practice for ${ch.boards.join(' and ')}.`,
    alternates: { canonical: `/${p.cls}/${p.slug}` } };
}

export default async function Chapter({ params }) {
  const p = await params;
  const { c, i, ch, board, list } = find(p); if (!ch) notFound();
  const prev = list[i - 1], next = list[i + 1];
  const faq = ch.faq || [];
  const ld = faq.length ? { '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) } : null;
  const toc = [
    ['video', 'Video lesson', true], ['notes', 'Topic-wise notes', ch.notes], ['formulas', 'Key formulas', ch.formulas], ['concept', 'Concept explained', ch.concept],
    ['examples', 'Solved examples', ch.examples], ['mistakes', 'Common mistakes', ch.mistakes],
    ['practice', 'Practice questions', ch.practice], ['faq', 'FAQ', faq.length],
  ].filter(t => t[2]);
  return (<>
    {ld && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />}
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span><Link href={`/${p.cls}`}>{c.label}</Link><span>/</span>{ch.title}</div>
      <h1>{ch.title} {c.label}</h1>
      <p>{ch.boards.map(b => <span key={b} className="tag">{b}</span>)}</p>
      {ch.summary && <p style={{marginTop:'.6rem'}}>{ch.summary}</p>}
    </div></div>
    <div className="wrap chapter">
      <article>
        <div id="video">{ch.youtube
          ? <iframe className="video" src={`https://www.youtube.com/embed/${ch.youtube}`} title={ch.title} allowFullScreen loading="lazy" />
          : <div className="video ph">Video coming soon</div>}</div>
        {toc.length === 1 && <p className="muted" style={{marginTop:'1rem'}}>Notes and practice for this chapter are being prepared.</p>}
        {ch.notes && <><h2 id="notes">Topic-wise notes</h2>{ch.notes.map(t => (
          <section key={t.topic} className="topic"><h3>{t.topic}</h3><ul>{t.points.map(p => <li key={p}>{p}</li>)}</ul></section>))}</>}
        {ch.formulas && <><h2 id="formulas">Key formulas</h2><ul className="formulas">{ch.formulas.map(f => <li key={f}>{f}</li>)}</ul></>}
        {ch.concept && <><h2 id="concept">Concept explained</h2><p>{ch.concept}</p></>}
        {ch.examples && <><h2 id="examples">Solved examples</h2>{ch.examples.map(e => (
          <details key={e.q}><summary>{e.q}</summary><p>{e.a}</p></details>))}</>}
        {ch.mistakes && <><h2 id="mistakes">Common mistakes</h2><ul>{ch.mistakes.map(m => <li key={m}>{m}</li>)}</ul></>}
        {ch.practice && <><h2 id="practice">Practice questions</h2><ol>{ch.practice.map(q => <li key={q}>{q}</li>)}</ol></>}
        {faq.length > 0 && <><h2 id="faq">FAQ</h2>{faq.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</>}
        <p style={{marginTop:'2rem'}}><a className="btn" href={SITE.telegram}>Join Telegram for daily problems</a></p>
        <p className="prevnext">
          {prev ? <Link href={`/${p.cls}/${prev.slug}`}>← {prev.title}</Link> : <span />}
          {next && <Link href={`/${p.cls}/${next.slug}`}>{next.title} →</Link>}
        </p>
      </article>
      <aside className="side">
        {toc.length > 1 && <div className="card"><h3>On this page</h3>
          {toc.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</div>}
        <div className="card"><h3>{c.label} {board} chapters</h3>
          {list.map(x => <Link key={x.slug} href={`/${p.cls}/${x.slug}`} aria-current={x.slug === ch.slug ? 'page' : undefined}>{x.title}</Link>)}</div>
      </aside>
    </div>
  </>);
}
