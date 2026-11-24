import Link from 'next/link';
import { waLink } from '@/lib/contact';
import { BOOSTER } from '@/lib/data';

export const metadata = { title: 'Board Booster 2027: Class 10 Maths Crash Course (CBSE and ICSE)',
  description: 'An 11-week live crash course for Class 10 board Maths, CBSE and ICSE. Live classes at night, a test after every chapter and 4 full mock papers before the exam.',
  alternates: { canonical: '/board-booster' } };

const STEPS = [
  { t: 'Learn live', d: 'Three classes a week, 9:00 to 10:30 pm. CBSE on Mon, Wed and Fri. ICSE on Tue, Thu and Sat. Missed a class? The recording is up the same night.' },
  { t: 'Test every chapter', d: 'A timed test after each chapter. You see your score and the exact topics where you lost marks.' },
  { t: 'Practise the real paper', d: 'Four full mock board papers in the last four weeks, with step-wise answers.' },
  { t: 'Clear doubts fast', d: 'A WhatsApp doubt group for the batch. Doubts are answered within 24 hours.' },
  { t: 'Parents stay informed', d: 'A weekly message to parents: tests taken, scores and the chapters that need work.' },
];

const FAQ = [
  { q: 'Which syllabus does it follow?', a: 'The 2026-27 Class 10 syllabus: CBSE (Maths Standard and Basic) and ICSE.' },
  { q: 'What if I miss a class?', a: 'Every class is recorded and posted the same night.' },
  { q: 'Is it online?', a: 'Yes. Join from any phone or laptop.' },
  { q: 'How do I join?', a: 'Tap Join and send us the message on WhatsApp with your board. We share the payment details and the joining link.' },
];

export default function BoardBooster() {
  const b = BOOSTER;
  const join = waLink(`Hi, I want to join Board Booster 2027 (Class 10 Maths). Board: `) || '/enquiry';
  const ext = join.startsWith('http');
  const Join = ({ cls, children }) => ext ? <a className={cls} href={join}>{children}</a> : <Link className={cls} href={join}>{children}</Link>;
  return (<>
    <section className="sp-hero"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span><Link href="/live-courses">Live Courses</Link><span>/</span>Board Booster 2027</div>
      <span className="sp-eyebrow"><i className="lv-dot" /> Live crash course · Class 10 · CBSE &amp; ICSE</span>
      <h1>Board Booster 2027: <span className="h3-grad">ready for the Maths paper in 11 weeks</span></h1>
      <p>Live classes every night with your teacher, a test after every chapter and 4 full mock papers. CBSE Maths: {b.cbseExam}. ICSE Maths: {b.icseExam}. Starts {b.starts}.</p>
      <div className="cta-row" style={{ marginTop: '1.4rem' }}>
        <Join cls="btn btn-sun">Join for {b.earlyFee}, till {b.earlyTill}</Join>
        <a className="btn h3-ghost" href="#free-test">Take a free test first</a>
      </div>
    </div></section>

    <section className="section"><div className="wrap">
      <div className="section-head center"><span className="kicker">How it works</span><h2>Five things, every week until the exam</h2></div>
      <div className="sp-steps">
        {STEPS.map((s, i) => (<div key={s.t} className="sp-step"><b>{i + 1}</b><h3>{s.t}</h3><p>{s.d}</p></div>))}
      </div>
    </div></section>

    <section className="section soft"><div className="wrap">
      <div className="section-head center"><span className="kicker">Schedule</span><h2>Chapters first, then mock papers</h2></div>
      <div className="grid">
        <div className="card course">
          <span className="badge live">CBSE</span>
          <h2>CBSE batch</h2>
          <p>All 14 chapters by 17 January, then mocks and revision.</p>
          <dl>
            <div><dt>Starts</dt><dd>{b.starts}</dd></div>
            <div><dt>Classes</dt><dd>Mon, Wed, Fri · 9:00-10:30 pm</dd></div>
            <div><dt>Board exam</dt><dd>{b.cbseExam}</dd></div>
          </dl>
        </div>
        <div className="card course">
          <span className="badge live">ICSE</span>
          <h2>ICSE batch</h2>
          <p>All 25 chapters by 24 January, then mocks and revision.</p>
          <dl>
            <div><dt>Starts</dt><dd>{b.starts}</dd></div>
            <div><dt>Classes</dt><dd>Tue, Thu, Sat · 9:00-10:30 pm</dd></div>
            <div><dt>Board exam</dt><dd>{b.icseExam}</dd></div>
          </dl>
        </div>
      </div>
    </div></section>

    <section className="section"><div className="wrap">
      <div className="section-head center"><span className="kicker">Plans</span><h2>Pick one</h2></div>
      <div className="grid">
        <div className="card course">
          <span className="badge live">LIVE</span>
          <h2>Full Course</h2>
          <p><b>{b.earlyFee}</b> till {b.earlyTill}, then {b.fullFee}</p>
          <ul>
            <li>Live classes and same-night recordings</li>
            <li>A test after every chapter</li>
            <li>4 full mock board papers with answers</li>
            <li>WhatsApp doubt group</li>
            <li>Weekly progress message to parents</li>
          </ul>
          <Join cls="btn">Join the Full Course</Join>
        </div>
        <div className="card course">
          <span className="badge rec">TESTS</span>
          <h2>Test Series</h2>
          <p><b>{b.testFee}</b></p>
          <ul>
            <li>A test after every chapter</li>
            <li>4 full mock board papers with answers</li>
          </ul>
          <Join cls="btn btn-outline">Join the Test Series</Join>
        </div>
      </div>
    </div></section>

    <section id="free-test" className="section soft"><div className="wrap narrow center">
      <div className="section-head"><span className="kicker">Not sure yet?</span><h2>Take Test 1 free</h2></div>
      <p>Timed, with your score and an explanation for every answer as soon as you submit.</p>
      <p className="cta-row" style={{ justifyContent: 'center' }}>
        <Link className="btn btn-sun" href="/tests/class-10/real-numbers">CBSE: Real Numbers</Link>
        <Link className="btn btn-outline" href="/tests/class-10/icse-gst">ICSE: GST</Link>
      </p>
    </div></section>

    <section className="section"><div className="wrap" style={{ maxWidth: '46rem' }}>
      <div className="section-head center"><h2>Questions about Board Booster</h2></div>
      {FAQ.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
      <p className="center" style={{ marginTop: '1.4rem' }}>Early-bird price closes on {b.earlyTill}.</p>
      <p className="center"><Join cls="btn btn-sun">Join now</Join></p>
    </div></section>
  </>);
}
