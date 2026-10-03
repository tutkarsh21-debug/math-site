import { Fragment } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CLASSES, SITE } from '@/lib/data';
import PDFS from '@/lib/pdfs.json';

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

// The three tabs of a chapter. Each shows one PDF from public/pdf/<class>/<slug>/, built by notes-pdf/build.mjs.
const TABS = [
  { kind: 'notes', label: 'Short Notes', about: 'Topic-wise short notes with solved examples.' },
  { kind: 'formulas', label: 'Formula Bank', about: 'Every formula and result of the chapter on one sheet.' },
  { kind: 'dpp', label: 'DPP Sheet', about: 'Daily practice problems with an answer key.' },
];

export async function generateMetadata({ params }) {
  const p = await params;
  const { c, ch } = find(p); if (!ch) return {};
  return { title: `${ch.title} ${c.label} | ${ch.boards.join(' & ')} Notes, Formulas and DPP`,
    description: ch.summary || `${c.label} ${ch.title}: short notes, formula bank and DPP sheet for ${ch.boards.join(' and ')}.`,
    alternates: { canonical: `/${p.cls}/${p.slug}` } };
}

export default async function Chapter({ params }) {
  const p = await params;
  const { c, i, ch, board, list } = find(p); if (!ch) notFound();
  const prev = list[i - 1], next = list[i + 1];
  const ready = PDFS[`${p.cls}/${p.slug}`] || [];
  return (<>
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
        <div className="tabs" id="material">
          {TABS.map((t, n) => (<Fragment key={t.kind}>
            <input type="radio" name="material" id={`tab-${t.kind}`} defaultChecked={n === 0} />
            <label htmlFor={`tab-${t.kind}`}>{t.label}</label>
          </Fragment>))}
          {TABS.map(t => {
            const pdf = `/pdf/${p.cls}/${p.slug}/${t.kind}.pdf`;
            return (<div key={t.kind} className="tab-panel">
              {ready.includes(t.kind) ? (<>
                <div className="pdf-bar">
                  <span>{t.about}</span>
                  <span className="cta-row">
                    <a className="btn btn-sm" href={pdf} target="_blank" rel="noopener">Open PDF</a>
                    <a className="btn btn-sm btn-outline" href={pdf} download={`MathSetu-${p.cls}-${p.slug}-${t.kind}.pdf`}>Download</a>
                  </span>
                </div>
                <iframe className="pdf" src={`${pdf}#navpanes=0&view=FitH`} title={`${ch.title}: ${t.label}`} loading="lazy" />
              </>) : <p className="muted">The {t.label} PDF for this chapter is being prepared.</p>}
            </div>);
          })}
        </div>
        <p style={{marginTop:'2rem'}}><a className="btn" href={SITE.telegram}>Join Telegram for daily problems</a></p>
        <p className="prevnext">
          {prev ? <Link href={`/${p.cls}/${prev.slug}`}>← {prev.title}</Link> : <span />}
          {next && <Link href={`/${p.cls}/${next.slug}`}>{next.title} →</Link>}
        </p>
      </article>
      <aside className="side">
        <div className="card"><h3>{c.label} {board} chapters</h3>
          {list.map(x => <Link key={x.slug} href={`/${p.cls}/${x.slug}`} aria-current={x.slug === ch.slug ? 'page' : undefined}>{x.title}</Link>)}</div>
      </aside>
    </div>
  </>);
}
