import Link from 'next/link';
import { notFound } from 'next/navigation';
import { KidStudy } from '@/components/Art';
import DemoForm from '@/components/DemoForm';
import JsonLd, { breadcrumbs } from '@/components/JsonLd';
import { BOARDS, CLASSES, FREE_DEMO, JOIN, SITE } from '@/lib/data';

export const metadata = { title: 'Book a Free Demo Maths Class | Class 8, 9, 10 CBSE & ICSE',
  description: `Book a free demo Maths class with ${SITE.name} for your child in Class 8, 9 or 10 (CBSE or ICSE). It takes less than a minute, and there is nothing to pay.` };

const IN_DEMO = [
  { title: 'One topic, from the basics', text: 'The teacher takes one topic from your child\'s class and explains why it works, not just the steps.' },
  { title: 'Your child solves, not just watches', text: 'A few questions are solved together, so you can both see how the class feels.' },
  { title: 'No pressure', text: 'After the class you decide in your own time. The free notes, practice sheets and tests stay free either way.' },
];
const FAQ = [
  { q: 'Is the demo class really free?', a: 'Yes. There is nothing to pay for the demo, and no payment details are asked for.' },
  { q: 'What do we need for the demo?', a: 'A phone or computer with internet, and a notebook and pen. The class is online.' },
  { q: 'What happens after the demo?', a: 'If you and your child like it, we share the batch details and help you choose. If not, all the free notes, practice sheets and tests on this site stay free to use.' },
  { q: 'Which language is the class in?', a: 'Simple Hinglish, a mix of Hindi and English. Maths terms are kept in English, as they appear in the exam.' },
];

export default function Demo() {
  if (!FREE_DEMO) notFound();   // hidden for now: see FREE_DEMO in lib/flags.js
  return (<div className="no-demo-bar">
    <JsonLd data={breadcrumbs([['Book a free demo', '/demo']])} />
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>Free demo class</div>
      <h1>Book a free demo Maths class</h1>
      <p>For parents of students in Class 8, 9 and 10 (CBSE and ICSE). See how {SITE.name} teaches before you decide anything.</p>
    </div></div>
    <section className="section"><div className="wrap try-grid" style={{alignItems:'start'}}>
      <DemoForm classes={Object.entries(CLASSES).map(([k, c]) => [k, c.label])} boards={BOARDS} />
      <div>
        <KidStudy className="demo-kid" />
        <span className="kicker">How it works</span>
        <h2>Join in three easy steps</h2>
        <div className="steps" style={{display:'grid',gap:'1.4rem',marginTop:'1.2rem'}}>
          {JOIN.map(s => <div key={s.title} className="step"><h3>{s.title}</h3><p>{s.text}</p></div>)}
        </div>
      </div>
    </div></section>
    <section className="section soft"><div className="wrap">
      <div className="section-head center"><span className="kicker">In the demo</span><h2>What happens in the demo class</h2></div>
      <div className="grid">
        {IN_DEMO.map((f, i) => <div key={f.title} className={`card fear f${i + 1}`}><h3>{f.title}</h3><p>{f.text}</p></div>)}
      </div>
    </div></section>
    <section className="section"><div className="wrap narrow">
      <div className="section-head center"><span className="kicker">FAQ</span><h2>Questions parents ask</h2></div>
      {FAQ.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }} />
    </div></section>
  </div>);
}
