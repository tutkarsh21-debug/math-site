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
      <p>{uploaded
        ? `One lecture per chapter, taught in Hinglish. ${uploaded} of ${all.length} chapters have a video so far.`
        : 'Chapter-wise video lectures in Hinglish are being recorded. The first lectures will be announced here, on YouTube and on Telegram.'}</p>
      <div className="cta-row" style={{marginTop:'1rem'}}>
        <a className="btn" href={SITE.youtube}>Open YouTube channel</a>
        <a className="btn btn-outline" href={SITE.telegram}>Join Telegram</a>
      </div>
    </div></div>

    {uploaded > 0 && <section className="section"><div className="wrap">
      {classes.map(([k, c]) => {
        const boards = BOARDS.map(b => ({ b, list: c.chapters.filter(ch => ch.boards.includes(b) && ch.youtube) })).filter(x => x.list.length);
        if (!boards.length) return null;
        return (<div key={k} id={k} className="part">
          <h2>{c.label}</h2>
          {boards.map(({ b, list }) => (<details key={b} open>
            <summary>{c.label} {b} <span className="muted">· {list.length} videos</span></summary>
            <ol className="lectures">{list.map(ch => (
              <li key={ch.slug}>
                <Link href={`/${k}/${ch.slug}#video`}>{ch.title}</Link>
                <span className="badge rec">WATCH</span>
              </li>))}
            </ol>
          </details>))}
        </div>);
      })}
    </div></section>}

    <section className="section soft"><div className="wrap">
      <div className="section-head"><h2>Start studying today</h2><p>Every chapter already has short notes, a formula bank, a DPP sheet and an online test.</p></div>
      <div className="cta-row">
        <Link className="btn" href="/self-study">Go to Self Study</Link>
        <Link className="btn btn-outline" href="/tests">Take a chapter test</Link>
      </div>
    </div></section>
  </>);
}
