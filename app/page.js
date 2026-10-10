import Link from 'next/link';
import HeroArt from '@/components/HeroArt';
import ChapterSearch from '@/components/ChapterSearch';
import FeatureStack from '@/components/FeatureStack';
import WhiteboardStory from '@/components/WhiteboardStory';
import TalkToUs from '@/components/TalkToUs';
import { Continue } from '@/components/Progress';
import JsonLd from '@/components/JsonLd';
import { BOARDS, FREE_DEMO, CLASSES } from '@/lib/data';

const FAQ = [
  { q: 'How do I book a free demo class?', a: "Use the Free Demo button at the top of any page and fill in the short form with your child's class and board. We call you to fix a time. There is nothing to pay for the demo." },
  { q: 'What is 1-to-1 tuition?', a: "A live online class with one student and one teacher, that follows your child's syllabus, speed and gaps. The fee and timings are shared on a call. See the 1-to-1 Tuition page." },
  { q: 'Which classes and boards are covered?', a: 'Class 8, 9 and 10 Maths for both CBSE and ICSE. Each board has its own chapter list, so you only see the chapters of your syllabus.' },
  { q: 'Is the study material free?', a: 'Yes. The notes, formula banks, DPP sheets, previous year questions and online tests are free and can be used without an account. A free account is needed only to save your test scores.' },
];

const FAQ_SHOWN = FAQ.filter(f => FREE_DEMO || !/free demo/i.test(f.q));

export default function Home() {
  const classes = Object.entries(CLASSES);
  const all = classes.flatMap(([k, c]) => c.chapters.map(ch => ({ ...ch, cls: k, label: c.label })));
  const finder = all.map(ch => ({ cls: ch.cls, label: ch.label, boards: ch.boards, title: ch.title, slug: ch.slug }));
  return (<>
    <section className="hero5">
      <div className="hero5-grid">
        <div className="hero5-copy">
          <h1>Maths <span className="h4-grad">Made Clear</span></h1>
          <p className="h5-sub">Class 8, 9 and 10 Maths with a <mark>1-to-1 live teacher</mark>, free notes and unlimited practice, for CBSE and ICSE.</p>
          <ul className="h4-chips" aria-label="Classes and boards"><li>Class 8</li><li>Class 9</li><li>Class 10</li><li>CBSE</li><li>ICSE</li><li>Olympiad</li></ul>
          <div className="cta-row">
            <Link className="btn btn-sun h4-cta" href="/one-to-one">Explore 1-to-1 tuition <span aria-hidden="true">→</span></Link>
            <Link className="btn h4-soft" href="/practice">Try a free practice test</Link>
          </div>
        </div>
        <HeroArt />
      </div>
    </section>

    <section className="section fs-sec" id="one-to-one"><div className="wrap">
      <div className="section-head center reveal"><h2>1-to-1 tuition, built around <span className="hl">how students really learn</span></h2><p>One student and one teacher in a live online class, backed by practice, doubts and a progress record between classes.</p></div>
      <FeatureStack />
    </div></section>

    <section className="section soft wbs-sec" id="whiteboard"><div className="wrap">
      <div className="section-head center reveal"><h2>Stuck? <span className="hl">Watch your teacher solve it</span></h2><p>The solution is written out on a whiteboard, recorded with your teacher's voice, and waiting for you.</p></div>
      <WhiteboardStory />
    </div></section>

    <Continue />

    <section className="section" id="classes"><div className="wrap">
      <div className="section-head center reveal"><h2>Choose your <span className="hl">class and board</span></h2><p>Chapters, tests, 1-to-1 classes and help with doubts, all in one place.</p></div>
      <ChapterSearch chapters={finder} />
      <div className="track-grid">
        {classes.map(([k, c], i) => {
          const boards = BOARDS.filter(b => c.chapters.some(ch => ch.boards.includes(b)));
          return (<Link key={k} href={`/${k}`} className={`track-card t${i % 4 + 1} reveal`}>
            <span className="track-tag">{boards.join(' · ')}</span>
            <h3>{c.label} Maths</h3>
            <p>{c.chapters.length} chapters with notes, formula banks, tests and a practice generator.</p>
            <span className="go">Know more →</span>
            <b className="track-art" aria-hidden="true">{c.label.replace(/\D/g, '')}</b>
          </Link>);
        })}
        <Link href="/olympiad" className="track-card t4 reveal">
          <span className="track-tag">SOF IMO</span>
          <h3>Olympiad</h3>
          <p>How to prepare for the Olympiad alongside the school syllabus.</p>
          <span className="go">Know more →</span>
          <b className="track-art" aria-hidden="true">★</b>
        </Link>
      </div>
    </div></section>

    <section className="section soft"><div className="wrap narrow">
      <div className="section-head center reveal"><h2>Questions parents ask</h2></div>
      {FAQ_SHOWN.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: FAQ_SHOWN.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }} />
    </div></section>

    <section className="section"><div className="wrap">
      <div className="banner reveal">
        <div><h2>Not sure where to begin?</h2><p>Message us with your child's class and board and we will help you choose.</p></div>
        <div className="cta-row">
          <TalkToUs>Talk to us</TalkToUs>
          <Link className="btn btn-ghost" href="/one-to-one">1-to-1 tuition</Link>
        </div>
      </div>
    </div></section>
  </>);
}
