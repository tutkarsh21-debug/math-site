import { Fragment } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd, { breadcrumbs } from '@/components/JsonLd';
import { CLASSES, SITE } from '@/lib/data';
import PDFS from '@/lib/pdfs.json';
import TESTS from '@/lib/tests.json';
import TOPICS from '@/lib/topics.json';
import { DoneButton } from '@/components/Progress';

// Search results show about 155 characters, so longer descriptions are cut at a word.
const short = (s, n = 155) => s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n - 1)).replace(/[,;:.\s]+$/, '') + '…';

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

// The tabs of a chapter. Each shows PDFs from public/pdf/<class>/<slug>/, built by notes-pdf/build.mjs.
// files: [file name, button label]. only: the classes that have this tab (all classes if left out).
const TABS = [
  { kind: 'notes', label: 'Short Notes', about: 'Topic-wise short notes with solved examples.', files: [['notes', 'Short Notes']] },
  { kind: 'formulas', label: 'Formula Bank', about: 'Every formula and result of the chapter on one sheet.', files: [['formulas', 'Formula Bank']] },
  { kind: 'dpp', label: 'DPP Sheet', about: 'Daily practice problems with an answer key.', files: [['dpp', 'DPP Sheet']] },
  { kind: 'pyq', label: 'PYQ', about: 'Previous year board questions, topic-wise, with solutions in a separate PDF.', only: ['class-10'],
    files: [['pyq', 'Questions'], ['pyq-solutions', 'Solutions']] },
  // optional: the tab is shown only for chapters that have this PDF (CBSE chapters, which follow the NCERT textbook).
  { kind: 'ncert', label: 'NCERT Solutions', about: 'Step-by-step solutions to the textbook exercises.', optional: true, files: [['ncert', 'NCERT Solutions']] },
];

export async function generateMetadata({ params }) {
  const p = await params;
  const { c, ch } = find(p); if (!ch) return {};
  const what = `Free PDF notes, formula sheet, DPP${p.cls === 'class-10' ? ', previous year questions' : ''} and an online test`;
  return { title: `${ch.title} ${c.label} ${ch.boards.join(' & ')} Notes, Formulas, DPP and Test`,
    description: short(`${c.label} ${ch.boards.join(' and ')} Maths, ${ch.title}: ${ch.summary ? ch.summary + ' ' : ''}${what}.`),
    alternates: { canonical: `/${p.cls}/${p.slug}` } };
}

export default async function Chapter({ params }) {
  const p = await params;
  const { c, i, ch, board, list } = find(p); if (!ch) notFound();
  const prev = list[i - 1], next = list[i + 1];
  const ready = PDFS[`${p.cls}/${p.slug}`] || [];
  const tabs = TABS.filter(t => (!t.only || t.only.includes(p.cls)) && (!t.optional || ready.includes(t.files[0][0])));
  const test = TESTS[`${p.cls}/${p.slug}`];
  const topics = TOPICS[`${p.cls}/${p.slug}`] || [];
  const url = `${SITE.url}/${p.cls}/${p.slug}`;
  return (<>
    <JsonLd data={breadcrumbs([[`${c.label} Maths`, `/${p.cls}`], [ch.title, `/${p.cls}/${p.slug}`]])} />
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'LearningResource', name: `${ch.title}: ${c.label} ${board} Maths notes`, url,
      description: ch.summary || undefined, inLanguage: 'en', isAccessibleForFree: true, educationalLevel: c.label,
      learningResourceType: ['Notes', 'Formula sheet', 'Practice problems'], teaches: topics, provider: { '@id': `${SITE.url}/#org` } }} />
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span><Link href={`/${p.cls}`}>{c.label}</Link><span>/</span>{ch.title}</div>
      <h1>{ch.title} {c.label}</h1>
      <p>{ch.boards.map(b => <span key={b} className="tag">{b}</span>)}</p>
      {ch.summary && <p style={{marginTop:'.6rem'}}>{ch.summary}</p>}
    </div></div>
    <div className="wrap chapter">
      <article>
        {ch.youtube && <div id="video"><iframe className="video" src={`https://www.youtube.com/embed/${ch.youtube}`} title={ch.title} allowFullScreen loading="lazy" /></div>}
        <div className="tabs" id="material">
          {tabs.map((t, n) => (<Fragment key={t.kind}>
            <input type="radio" name="material" id={`tab-${t.kind}`} defaultChecked={n === 0} />
            <label htmlFor={`tab-${t.kind}`}>{t.label}</label>
          </Fragment>))}
          {tabs.map(t => {
            const files = t.files.filter(([file]) => ready.includes(file));
            return (<div key={t.kind} className="tab-panel">
              {files.length === 0 && <p className="muted">The {t.label} PDF for this chapter is being prepared.</p>}
              {files.map(([file, name]) => {
                const pdf = `/pdf/${p.cls}/${p.slug}/${file}.pdf`;
                return (<div key={file} className="pdf-block">
                  <div className="pdf-bar">
                    <span>{t.files.length > 1 ? <strong>{name}</strong> : t.about}</span>
                    <span className="cta-row">
                      <a className="btn btn-sm" href={pdf} target="_blank" rel="noopener">Open PDF</a>
                      <a className="btn btn-sm btn-outline" href={pdf} download={`MathSetu-${p.cls}-${p.slug}-${file}.pdf`}>Download</a>
                    </span>
                  </div>
                  <p className="pdf-note muted small">On a phone, tap Open PDF to read it full screen.</p>
                  <iframe className="pdf" src={`${pdf}#navpanes=0&view=FitH`} title={`${ch.title}: ${name}`} loading="lazy" />
                </div>);
              })}
            </div>);
          })}
        </div>
        {topics.length > 0 && <section className="covers">
          <h2>What this chapter covers</h2>
          <ul>{topics.map(t => <li key={t}>{t}</li>)}</ul>
          <p className="muted">The short notes explain each of these topics with solved examples, the formula bank lists every result on one sheet, and the DPP sheet gives practice questions with an answer key.{p.cls === 'class-10' ? ' Previous year board questions are arranged topic-wise with solutions.' : ''}</p>
        </section>}
        {test && <div className="banner" style={{marginTop:'2rem'}}>
          <div><h2>Chapter test</h2><p>{test.qs.length} questions · {test.minutes} minutes · instant score with explanations</p></div>
          <Link className="btn btn-sun" href={`/tests/${p.cls}/${p.slug}`}>Start test</Link>
        </div>}
        <p className="cta-row" style={{marginTop:'2rem'}}><DoneButton id={`${p.cls}/${p.slug}`} title={`${ch.title} (${c.label})`} /><a className="btn btn-outline btn-sm" href={SITE.telegram}>Join Telegram for daily problems</a></p>
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
