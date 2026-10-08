import Link from 'next/link';
import JsonLd, { breadcrumbs } from '@/components/JsonLd';
import { CLASSES } from '@/lib/data';

export const metadata = {
  title: 'Weak in Maths? Start from the Basics | Class 8, 9, 10',
  description: 'A step-by-step plan for a student who finds Maths hard: check your level, fix the gaps with short notes, practise, take tests, and then move on to the Olympiad. Free.',
};

const STEPS = [
  { title: 'Check your level', text: 'Take the level check: 20 easy questions from every chapter of your class, in 30 minutes. It shows which topics are strong and which are weak. No login is needed, and logging in saves the result.' },
  { title: 'Fix the weak topics first', text: 'Open the short notes of each weak topic. They start from the basics and have solved examples. Learn the formula sheet, then solve the DPP sheet without looking at the answers.' },
  { title: 'Practise only what you missed', text: 'Make a practice test on the weak topics. Start at Easy, then Medium. The test shows your score, how the time went, and what to read next.' },
  { title: 'Take the chapter test', text: 'Each chapter has a timed test of 10 questions. Aim for 7 out of 10 before you move to the next chapter.' },
  { title: 'Check again after two weeks', text: 'Repeat the level check. Your dashboard shows how each topic has moved, and a parent can follow the progress too.' },
  { title: 'Then aim higher', text: 'Move to Hard-level practice and sample papers. If you want the Olympiad, practise Mental Ability and Everyday Mathematics in the same generator.' },
];

export default function Start() {
  const classes = Object.entries(CLASSES);
  return (<>
    <JsonLd data={breadcrumbs([['Start here', '/start']])} />
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>Start here</div>
      <h1>Weak in Maths? Start here</h1>
      <p>You are not bad at maths. Somewhere an earlier idea was missed, and everything after it felt hard. This plan finds that idea and builds up from it, one step at a time. It is free.</p>
    </div></div>

    <section className="section"><div className="wrap">
      <div className="section-head center"><span className="kicker">Choose your goal</span><h2>What do you need?</h2></div>
      <div className="grid">
        <div className="card fear f1">
          <h3>I am weak and want to start from the basics</h3>
          <p>Find your gaps in 30 minutes. Choose your class:</p>
          <div className="cta-row">{classes.map(([k, c]) => <Link key={k} className="btn btn-sm" href={`/practice?cls=${k}&check=1`}>{c.label}</Link>)}</div>
        </div>
        <div className="card fear f2">
          <h3>I want better marks in school</h3>
          <p>Notes, formula sheets, DPP, previous year questions and a test for every chapter:</p>
          <div className="cta-row">{classes.map(([k, c]) => <Link key={k} className="btn btn-sm btn-outline" href={`/${k}`}>{c.label} chapters</Link>)}</div>
        </div>
        <div className="card fear f3">
          <h3>I am preparing for the Olympiad</h3>
          <p>Read how to prepare for SOF IMO, then practise Mental Ability and Everyday Mathematics questions, timed:</p>
          <div className="cta-row">
            <Link className="btn btn-sm" href="/practice?cls=olympiad">Olympiad practice</Link>
            <Link className="btn btn-sm btn-outline" href="/olympiad">Olympiad guide</Link>
          </div>
        </div>
      </div>
    </div></section>

    <section className="section soft"><div className="wrap">
      <div className="section-head center"><span className="kicker">The plan</span><h2>From the basics, in six steps</h2></div>
      <ol className="plan-steps">{STEPS.map((s, i) => (<li key={s.title} className="card"><b className="plan-no" aria-hidden="true">{i + 1}</b><div><h3>{s.title}</h3><p>{s.text}</p></div></li>))}</ol>
    </div></section>

    <section className="section"><div className="wrap">
      <div className="banner">
        <div><h2>Would you like a teacher with you?</h2><p>Book a free demo class. A teacher takes one topic from your class and explains it from the basics. There is nothing to pay.</p></div>
        <div className="cta-row">
          <Link className="btn btn-sun" href="/demo">Book a free demo class</Link>
          <Link className="btn btn-ghost" href="/doubts">Ask a doubt</Link>
        </div>
      </div>
      <p className="muted small" style={{ marginTop: '1rem' }}>Parents: your child can make a parent code on their dashboard, and you can then follow their tests and progress on the <Link href="/parent">Parent Dashboard</Link>.</p>
    </div></section>
  </>);
}
