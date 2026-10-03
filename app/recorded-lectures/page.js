import Link from 'next/link';
import { BOARDS, CLASSES, SITE } from '@/lib/data';

export const metadata = { title: 'Recorded Maths Video Lectures for Class 8, 9, 10 | CBSE & ICSE',
  description: 'Chapter-wise recorded Maths lectures in Hinglish for Class 8, 9 and 10, CBSE and ICSE. Watch any time.' };

export default function RecordedLectures() {
  const classes = Object.entries(CLASSES);
  const all = classes.flatMap(([, c]) => c.chapters);
  const uploaded = all.filter(ch => ch.youtube).length;
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>Recorded Lectures</div>
      <h1>Recorded Video Lectures (Class 8-10)</h1>
      <p>One lecture per chapter, taught in Hinglish. {uploaded
        ? `${uploaded} of ${all.length} chapters have a video so far; the rest are being recorded.`
        : 'Videos are being recorded and will appear here chapter by chapter.'} New uploads are announced on YouTube and Telegram.</p>
      <div className="cta-row" style={{marginTop:'1rem'}}>
        <a className="btn" href={SITE.youtube}>Open YouTube channel</a>
        <a className="btn btn-outline" href={SITE.telegram}>Join Telegram</a>
      </div>
    </div></div>

    <section className="section"><div className="wrap">
      {classes.map(([k, c]) => (<div key={k} id={k} className="part">
        <h2>{c.label}</h2>
        {BOARDS.map(b => {
          const list = c.chapters.filter(ch => ch.boards.includes(b));
          if (!list.length) return null;
          const done = list.filter(ch => ch.youtube).length;
          return (<details key={b}>
            <summary>{c.label} {b} <span className="muted">· {done} of {list.length} videos</span></summary>
            <ol className="lectures">{list.map(ch => (
              <li key={ch.slug}>
                <Link href={`/${k}/${ch.slug}#video`}>{ch.title}</Link>
                {ch.youtube ? <span className="badge rec">WATCH</span> : <span className="badge soon">Coming soon</span>}
              </li>))}
            </ol>
          </details>);
        })}
      </div>))}
    </div></section>

    <section className="section soft"><div className="wrap">
      <div className="section-head"><h2>While a video is not ready</h2><p>Every chapter already has short notes, a formula bank and a DPP sheet.</p></div>
      <Link className="btn" href="/self-study">Go to Self Study</Link>
    </div></section>
  </>);
}
