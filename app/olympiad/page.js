import { Fragment } from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/data';
import { OLY_GROUPS } from '@/lib/olympiad';
export const metadata = { title: 'SOF IMO Olympiad Preparation for Class 8, 9, 10',
  description: 'SOF IMO preparation for Class 8-10: short notes, DPP and a test for every mental ability and everyday mathematics topic, and HOTS questions class-wise.',
  alternates: { canonical: '/olympiad' } };

const PREP = [
  { t: 'School syllabus first', d: 'Olympiad questions are built on what you study in school. Make the chapters strong before you go beyond them.' },
  { t: 'Practise a little every day', d: 'Mental ability and number patterns improve with daily practice, ten minutes at a time.' },
  { t: 'Solve under a timer', d: 'Use the topic tests and the practice questions to get used to answering in limited time.' },
  { t: 'Learn from the mistakes', d: 'After a test, read the explanation of every question you missed, then try a similar one again.' },
];

export default function Olympiad() {
  return (<>
    <section className="sp-hero"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>Olympiad</div>
      <span className="sp-eyebrow">SOF IMO · Class 8, 9 and 10</span>
      <h1>Think beyond <span className="h3-grad">the textbook</span></h1>
      <p>Short notes, quick rules, a DPP sheet and a timed test for every Olympiad topic, and HOTS questions for every school chapter. Exam dates and pattern change every year, so always confirm them on the official SOF website.</p>
      <div className="cta-row" style={{ marginTop: '1.4rem' }}>
        <Link className="btn btn-sun" href="#topics">See all topics</Link>
        <Link className="btn h3-ghost" href="/practice?tab=olympiad">Olympiad practice questions</Link>
      </div>
    </div></section>

    <section className="oly-all" id="topics"><div className="wrap">
      <div className="section-head center"><span className="kicker">Study material</span><h2>All Olympiad topics</h2></div>
      <p className="oly-lead">Tap a topic to open its short notes, quick rules, DPP and test. Want only questions to practise? Go to <Link href="/practice?tab=olympiad"><strong>Olympiad practice questions</strong></Link> in the Practice section.</p>
      {OLY_GROUPS.map((g, i) => (<div key={g.id} className={`oly-grp g${i + 1}`}>
        <h3>{g.title} <span className="muted small">· {g.topics.length} topics</span></h3>
        {g.id === 'hots' ? (<>
          <p className="oly-sub">A set for every chapter, with a class-wise mixed set first.</p>
          {['Class 8', 'Class 9', 'Class 10'].map(c => (<Fragment key={c}>
            <h4>{c}</h4>
            <div className="chips">{g.topics.filter(t => t.cls === c).map(t => (
              <Link key={t.slug} href={`/olympiad/${t.slug}`}>{t.mixed ? 'Mixed set' : t.title.replace(/^HOTS: /, '').replace(/ \(Class \d+\)$/, '')}</Link>))}</div>
          </Fragment>))}
        </>) : (<>
          <p className="oly-sub">{g.intro}</p>
          <div className="chips">{g.topics.map(t => <Link key={t.slug} href={`/olympiad/${t.slug}`}>{t.title}</Link>)}</div>
        </>)}
      </div>))}
    </div></section>

    <section className="section"><div className="wrap">
      <div className="section-head center"><span className="kicker">How to prepare</span><h2>Four habits that help</h2></div>
      <div className="sp-steps">
        {PREP.map((s, i) => (<div key={s.t} className="sp-step"><b>{i + 1}</b><h3>{s.t}</h3><p>{s.d}</p></div>))}
      </div>
      <p className="center sp-more">Daily problems and mock tests are posted on Telegram.</p>
      <p className="center"><a className="btn btn-sun" href={SITE.telegram}>Join Telegram</a> <Link className="btn btn-outline" href="/tests">Take a chapter test</Link></p>
    </div></section>
  </>);
}
