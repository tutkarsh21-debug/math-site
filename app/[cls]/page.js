import { Fragment } from 'react';
import Link from 'next/link';
import { DoneTick } from '@/components/Progress';
import { notFound } from 'next/navigation';
import JsonLd, { breadcrumbs } from '@/components/JsonLd';
import { BOARDS, CLASSES } from '@/lib/data';
import PAPERS from '@/lib/papers.json';
import PDFS from '@/lib/pdfs.json';
import TESTS from '@/lib/tests.json';

export const generateStaticParams = () => Object.keys(CLASSES).map(cls => ({ cls }));
export async function generateMetadata({ params }) {
  const { cls } = await params;
  const c = CLASSES[cls];
  return c ? { title: `${c.label} Maths Notes, Formulas, DPP and Tests | CBSE & ICSE`, description: `${c.label} Maths for CBSE and ICSE: chapter-wise notes, formula banks, practice sheets, online tests and help with doubts.` } : {};
}

export default async function ClassPage({ params }) {
  const { cls } = await params;
  const c = CLASSES[cls]; if (!c) notFound();
  // One tab per board, with chapters grouped by book or book part.
  const boards = BOARDS.map(b => {
    const list = c.chapters.filter(ch => ch.boards.includes(b));
    const parts = [...new Set(list.map(ch => ch.part))];
    return { b, list, groups: parts.map(p => ({ title: p, items: list.filter(ch => ch.part === p) })) };
  }).filter(x => x.list.length);
  const tests = Object.keys(TESTS).filter(id => id.startsWith(cls + '/')).length;
  const papers = Object.keys(PAPERS).filter(id => id.startsWith(cls + '/') && PDFS[id]).length;
  // What a student of this class can do on the site. The chapter list is further down this page.
  const things = [
    { href: '#chapters', badge: 'FREE', kind: 'self', title: 'Study a chapter', text: `Short notes, a formula bank and a practice sheet for all ${c.chapters.length} chapters.`, go: 'See the chapters' },
    tests && { href: `/tests#${cls}`, badge: 'FREE', kind: 'self', title: 'Take a chapter test', text: `${tests} timed online tests, with your score and an explanation for every question.`, go: 'Open the tests' },
    papers && { href: '/sample-papers', badge: 'FREE', kind: 'self', title: 'Solve a sample paper', text: 'Full-length practice papers on the pattern of the exam, each with solutions.', go: 'Open sample papers' },
    { href: '/doubts', badge: 'HELP', kind: 'soon', title: 'Ask a doubt', text: 'Stuck on a question? Send it with a photo and get a step-by-step answer.', go: 'Ask now' },
    { href: `/live-courses#${cls}`, badge: 'LIVE', kind: 'live', title: 'Join the live course', text: 'Online classes with a teacher at a fixed time, with doubts solved in class.', go: 'See the live course' },
    { href: `/recorded-lectures#${cls}`, badge: 'RECORDED', kind: 'rec', title: 'Watch recorded lectures', text: 'Chapter-wise video lectures in Hinglish that you can watch any time.', go: 'See the lectures' },
  ].filter(Boolean);
  return (<>
    <JsonLd data={breadcrumbs([[`${c.label} Maths`, `/${cls}`]])} />
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>{c.label}</div>
      <h1>{c.label}</h1>
      <p>Everything for {c.label} in one place: {boards.map(x => `${x.list.length} ${x.b} chapters`).join(' and ')} to study, tests to check yourself, and help when you are stuck.</p>
    </div></div>
    <section className="section"><div className="wrap">
      <div className="section-head"><h2>What would you like to do?</h2></div>
      <div className="grid">
        {things.map(t => (
          <Link key={t.title} href={t.href} className="card">
            <span className={`badge ${t.kind}`}>{t.badge}</span>
            <h3 style={{marginTop:'.6rem'}}>{t.title}</h3>
            <p>{t.text}</p>
            <span className="go">{t.go} →</span>
          </Link>))}
      </div>
    </div></section>
    <section className="section soft" id="chapters"><div className="wrap">
      <div className="section-head"><h2>{c.label} chapters</h2><p>Choose your board, then open a chapter.</p></div>
    </div><div className="wrap tabs">
      {boards.map(({ b, list }, i) => (<Fragment key={b}>
        <input type="radio" name="board" id={`board-${b}`} defaultChecked={i === 0} />
        <label htmlFor={`board-${b}`}>{b} <small>{list.length}</small></label>
      </Fragment>))}
      {boards.map(({ b, groups }) => (<div key={b} className="tab-panel">
        {groups.map(g => (<div key={g.title || b} className="part">
          {g.title && <h2>{g.title}</h2>}
          <div className="grid">{g.items.map((ch, i) => (
            <Link key={ch.slug} href={`/${cls}/${ch.slug}`} className="card chapter-card">
              <span className="num">{ch.no || i + 1}</span>
              <span><strong>{ch.title}<DoneTick id={`${cls}/${ch.slug}`} /></strong>
                {PDFS[`${cls}/${ch.slug}`] && <span className="tag ready">Notes · Formulas · DPP</span>}</span>
            </Link>))}
          </div>
        </div>))}
      </div>))}
    </div></section>
  </>);
}
