import Link from 'next/link';
import { CLASSES, SITE } from '@/lib/data';

export default function Home() {
  return (<>
    <section className="hero">
      <h1>Class 8-10 Maths in Hindi + English, from Basics to Olympiad</h1>
      <p>CBSE and ICSE. Understand once, score full marks. / एक बार समझिए, पूरे अंक लाइए।</p>
      <p><Link className="btn" href="/class-10">Start with Class 10</Link>{' '}
         <a className="btn" href={SITE.telegram}>Join Telegram</a></p>
    </section>
    <div className="grid">
      {Object.entries(CLASSES).map(([k, c]) => (
        <Link key={k} href={`/${k}`} className="card"><h2 style={{marginTop:0}}>{c.label}</h2>
          <span>{c.chapters.length} chapters</span></Link>))}
      <Link href="/olympiad" className="card"><h2 style={{marginTop:0}}>Olympiad</h2><span>SOF IMO prep</span></Link>
    </div>
  </>);
}
