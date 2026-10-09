import Link from 'next/link';
import { BOARDS, CLASSES, LIVE, SITE } from '@/lib/data';

export const metadata = { title: 'Live Maths Courses for Class 8, 9, 10 | CBSE & ICSE',
  description: 'Live online Maths batches for Class 8, 9 and 10 (CBSE and ICSE), taught in Hinglish with doubt solving, notes and DPP.' };

// What every live batch includes. The notes, formula bank and DPP are the ones already on this site.
const INCLUDES = ['Live classes in Hinglish, chapter by chapter', 'Doubts solved in class', 'Short notes, formula bank and DPP for every chapter'];
const TBA = 'To be announced';

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
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>Live Courses</div>
      <h1>Live Maths Courses (Class 8-10)</h1>
      <p>Online classes at a fixed time with a teacher, for CBSE and ICSE. Batch dates and fees are announced on Telegram.</p>
    </div></div>

    <section className="section"><div className="wrap">
      {open.length === 0 ? (<div className="card" style={{maxWidth:'46rem'}}>
        <span className="badge live">LIVE</span>
        <h2 style={{marginTop:'.6rem'}}>Live batches are being planned</h2>
        <p>The first batches for Class 8, 9 and 10 will be announced on Telegram. Send an enquiry with your class and board, and we will message you when registrations open.</p>
        <ul>{INCLUDES.map(t => <li key={t}>{t}</li>)}</ul>
        <div className="cta-row"><Link className="btn btn-sun" href="/demo">Book a free demo class</Link><Link className="btn btn-outline" href="/enquiry">Tell me when a batch opens</Link><a className="btn btn-outline" href={SITE.telegram}>Join Telegram</a></div>
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

    <section className="section soft"><div className="wrap">
      <div className="section-head"><h2>Not ready for a live batch?</h2><p>Start with the free material and move to a batch later.</p></div>
      <div className="cta-row">
        <Link className="btn" href="/self-study">Self study PDFs</Link>
        <Link className="btn btn-outline" href="/tests">Chapter tests</Link>
      </div>
    </div></section>

    <section className="section"><div className="wrap">
      <div className="section-head"><h2>Questions about live courses</h2></div>
      {FAQ.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
    </div></section>
  </>);
}
