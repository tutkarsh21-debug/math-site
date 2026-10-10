import Link from 'next/link';
import Timetable from '@/components/Timetable';
import { BOARDS, CLASSES, FREE_DEMO, LIVE, SITE } from '@/lib/data';

export const metadata = { title: 'Live Maths Courses for Class 8, 9, 10 | CBSE & ICSE',
  description: 'Live online Maths batches for Class 8, 9 and 10 (CBSE and ICSE), taught in Hinglish with doubt solving, notes and DPP.',
  alternates: { canonical: '/live-courses' } };

// What every live batch includes. The notes, formula bank and DPP are the ones already on this site.
const INCLUDES = ['Live classes in Hinglish, chapter by chapter', 'Doubts solved in class', 'Short notes, formula bank and DPP for every chapter'];
const TBA = 'To be announced';

const WHY = [
  { t: 'A teacher, at a fixed time', d: 'A regular class gives a routine, and a routine is what keeps a weak student from falling behind again.' },
  { t: 'Doubts solved in class', d: 'Ask while the idea is fresh. Nobody has to feel small for asking a basic question.' },
  { t: 'Backed by the free material', d: 'Short notes, a formula bank, a DPP sheet and timed tests for every chapter, all already on this site.' },
];

const STEPS = [
  { t: 'Book a free demo', d: 'Sit in a demo class and see how the teaching feels, before you decide anything.' },
  { t: 'Tell us your class and board', d: 'Send an enquiry. We message you when registrations open for your batch.' },
  { t: 'Join the batch', d: 'Get the timing, the fee and the joining link, and start with the first chapter.' },
];

const FAQ = [
  { q: 'When does the next live batch start?', a: 'Dates are announced on Telegram first. Send an enquiry and we will tell you when registrations open.' },
  { q: 'Which language are live classes in?', a: 'Hinglish, a mix of Hindi and English. Written material is in English, as in the exam.' },
  { q: 'Can I study without joining a live batch?', a: 'Yes. All the self-study PDFs, chapter tests and sample papers on this site can be used on their own.' },
];

export default function LiveCourses() {
  const classes = Object.entries(CLASSES);
  // Only classes with at least one real detail get their own card.
  const open = classes.filter(([k]) => { const b = LIVE[k] || {}; return b.starts || b.days || b.fee || b.enrol; });
  return (<>
    <section className="sp-hero"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>Live Courses</div>
      <span className="sp-eyebrow"><i className="lv-dot" /> Live classes · Class 8, 9 &amp; 10</span>
      <h1>A real teacher, <span className="h3-grad">a fixed time, a steady routine</span></h1>
      <p>Online live Maths classes for CBSE and ICSE, with doubts solved in class. Batch dates and fees are announced on Telegram.</p>
      <div className="cta-row" style={{ marginTop: '1.4rem' }}>
        {FREE_DEMO && <Link className="btn btn-sun" href="/demo">Book a free demo class</Link>}
        <Link className={FREE_DEMO ? 'btn h3-ghost' : 'btn btn-sun'} href="/enquiry">Tell me when a batch opens</Link>
      </div>
    </div></section>

    <section className="section"><div className="wrap narrow">
      <Timetable scope="live" title="Live class timetable" empty="No live classes are scheduled yet. Follow us on Telegram to hear first when a class is added." />
      <p className="center" style={{ marginTop: '1rem' }}><Link className="btn btn-sun" href="/studio/live">Watch in the live studio</Link></p>
    </div></section>

    <section className="section"><div className="wrap">
      <div className="section-head center"><span className="kicker">What a live batch gives you</span><h2>More than a video can</h2></div>
      <div className="sp-steps lv-three">
        {WHY.map((s, i) => (<div key={s.t} className="sp-step"><b>{i + 1}</b><h3>{s.t}</h3><p>{s.d}</p></div>))}
      </div>
    </div></section>

    <section className="section soft"><div className="wrap">
      <div className="section-head center"><span className="kicker">Batches</span><h2>{open.length ? 'Open batches' : 'Batches are being planned'}</h2></div>
      {open.length === 0 ? (<div className="lv-status">
        <span className="badge live">LIVE</span>
        <h3>First batches for Class 8, 9 and 10 will be announced on Telegram</h3>
        <p>Send an enquiry with your class and board, and we will message you when registrations open.</p>
        <ul>{INCLUDES.map(t => <li key={t}>{t}</li>)}</ul>
        <div className="cta-row"><Link className="btn btn-sun" href="/enquiry">Tell me when a batch opens</Link><a className="btn btn-outline" href={SITE.telegram}>Join Telegram</a></div>
      </div>) : <div className="grid">
        {open.map(([k, c]) => {
          const b = LIVE[k] || {};
          const boards = BOARDS.filter(x => c.chapters.some(ch => ch.boards.includes(x)));
          return (<div key={k} id={k} className="card course">
            <span className="badge live">LIVE</span>
            <h2>{c.label}</h2>
            <p>{boards.join(' and ')} · full syllabus</p>
            <ul>{INCLUDES.map(t => <li key={t}>{t}</li>)}</ul>
            <dl>
              <div><dt>Starts</dt><dd>{b.starts || TBA}</dd></div>
              <div><dt>Class timing</dt><dd>{b.days || TBA}</dd></div>
              <div><dt>Fee</dt><dd>{b.fee || TBA}</dd></div>
            </dl>
            {b.enrol
              ? <a className="btn" href={b.enrol}>Enrol now</a>
              : <Link className="btn btn-outline" href="/enquiry">Enquire about this batch</Link>}
          </div>);
        })}
      </div>}
    </div></section>

    <section className="section"><div className="wrap">
      <div className="section-head center"><span className="kicker">How to join</span><h2>Three simple steps</h2></div>
      <div className="sp-steps lv-three">
        {STEPS.filter(s => FREE_DEMO || !/free demo/i.test(s.t)).map((s, i) => (<div key={s.t} className="sp-step"><b>{i + 1}</b><h3>{s.t}</h3><p>{s.d}</p></div>))}
      </div>
      <p className="center sp-more">Not ready for a batch yet? The free material is enough to begin.</p>
      <p className="center"><Link className="btn btn-sun" href="/self-study">Self study PDFs</Link> <Link className="btn btn-outline" href="/tests">Chapter tests</Link></p>
    </div></section>

    <section className="section soft"><div className="wrap" style={{ maxWidth: '46rem' }}>
      <div className="section-head center"><h2>Questions about live courses</h2></div>
      {FAQ.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
    </div></section>
  </>);
}
