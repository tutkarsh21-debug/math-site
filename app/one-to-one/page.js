import Link from 'next/link';
import JsonLd, { breadcrumbs } from '@/components/JsonLd';
import TalkToUs from '@/components/TalkToUs';
import { O2O_FAQ, O2O_FEATURES, O2O_JOURNEY } from '@/lib/oneToOne';

export const metadata = {
  title: '1-to-1 Maths Tuition for Class 8, 9, 10 | CBSE & ICSE',
  description: 'Live online 1-to-1 Maths tuition for Class 8, 9 and 10 (CBSE and ICSE): your own teacher, a plan that starts from the gaps, doubts between classes and practice that fits.',
  alternates: { canonical: '/one-to-one' },
};

export default function OneToOne() {
  return (<>
    <JsonLd data={breadcrumbs([['1-to-1 Tuition', '/one-to-one']])} />
    <section className="sp-hero"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>1-to-1 Tuition</div>
      <span className="sp-eyebrow"><i className="lv-dot" /> 1-to-1 Tuition · Class 8, 9 &amp; 10 · CBSE · ICSE</span>
      <h1>One child. One teacher. <span className="h3-grad">One plan that fits.</span></h1>
      <p>Live online Maths classes where the teacher follows your child's pace, and practice, doubts and progress carry on between classes.</p>
      <div className="cta-row" style={{ marginTop: '1.4rem' }}>
        <TalkToUs>Ask about a trial class</TalkToUs>
        <a className="btn h3-ghost" href="#how">See how it works</a>
      </div>
      <ul className="h3-chips" aria-label="Classes and boards"><li>Class 8</li><li>Class 9</li><li>Class 10</li><li>CBSE</li><li>ICSE</li><li>Olympiad</li></ul>
    </div></section>

    <section className="section"><div className="wrap">
      <div className="section-head center"><span className="kicker">What you get</span><h2>Built around <span className="hl">how students really learn</span></h2></div>
      <div className="grid">
        {O2O_FEATURES.map((f, i) => (<div key={f.title} className={`card tool f${i % 4 + 1}`}><h3>{f.title}</h3><p>{f.text}</p></div>))}
      </div>
    </div></section>

    <section className="section soft" id="how"><div className="wrap">
      <div className="section-head center"><span className="kicker">The journey</span><h2>From the first message to steady progress</h2><p>Class timings and the fee are agreed with you on the call.</p></div>
      <ol className="o2o-journey">
        {O2O_JOURNEY.map((s, i) => (<li key={s.title}><b>{i + 1}</b><div><h3>{s.title}</h3><p>{s.text}</p></div></li>))}
      </ol>
    </div></section>

    <section className="section"><div className="wrap narrow">
      <div className="section-head center"><span className="kicker">FAQ</span><h2>Questions parents ask</h2></div>
      {O2O_FAQ.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: O2O_FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }} />
    </div></section>

    <section className="section"><div className="wrap">
      <div className="banner">
        <div style={{ flex: 1 }}><h2>Ready to start?</h2><p>Tell us your child's class and board. We reply, answer your questions and fix a time for a trial class.</p></div>
        <TalkToUs>Ask about a trial class</TalkToUs>
      </div>
    </div></section>
  </>);
}
