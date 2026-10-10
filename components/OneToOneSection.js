import Link from 'next/link';
import TalkToUs from '@/components/TalkToUs';
import { O2O_FEATURES } from '@/lib/oneToOne';

// The 1-to-1 tuition block of the home page, straight after the hero: one promise, how a class flows, and what the student gets.
export default function OneToOneSection() {
  return (<section className="section o2o-sec" id="one-to-one"><div className="wrap">
    <div className="section-head center reveal">
      <span className="kicker">1-to-1 Tuition</span>
      <h2>1-to-1 tuition, built around <span className="hl">how your child learns</span></h2>
      <p>One student and one teacher in a live online class, backed by practice, doubts and a progress record between classes.</p>
    </div>
    <div className="o2o reveal">
      <div className="o2o-copy">
        <span className="o2o-tag">Live 1-to-1 class</span>
        <h3>A class that follows your child, not a timetable</h3>
        <p>Every class has the same flow: the teacher explains the idea, works an example, and then your child tries a question. If one step is shaky, the class stays there until it is not.</p>
        <div className="cta-row">
          <TalkToUs>Ask about a trial class</TalkToUs>
          <Link className="btn btn-outline" href="/one-to-one">How 1-to-1 works</Link>
        </div>
      </div>
      <ol className="o2o-flow" aria-label="How a 1-to-1 class flows">
        <li><i>1</i><b>Concept</b><span>Explained from what your child already knows</span></li>
        <li><i>2</i><b>Example</b><span>Worked on a shared screen, step by step</span></li>
        <li><i>3</i><b>Your turn</b><span>Your child tries a question, the teacher watches</span></li>
        <li><i>4</i><b>Practice</b><span>A fresh test and doubts, until the next class</span></li>
      </ol>
    </div>
    <div className="grid o2o-grid">
      {O2O_FEATURES.slice(0, 4).map((f, i) => (<div key={f.title} className={`card tool f${i % 4 + 1} reveal`}><h3>{f.title}</h3><p>{f.text}</p></div>))}
    </div>
  </div></section>);
}
