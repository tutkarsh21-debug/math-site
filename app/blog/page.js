import { Fragment } from 'react';
import Link from 'next/link';
import { OFFICIAL, POSTS } from '@/lib/posts';

export const metadata = { title: 'Blog and Exam News', description: 'Study advice for Class 8-10 Maths, and exam news for CBSE, ICSE and Olympiads with links to the official notices.' };

const day = d => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
const TABS = ['Blog', 'Exam News'];

export default function Blog() {
  return (<>
    <section className="sp-hero"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>Blog</div>
      <span className="sp-eyebrow">Blog · Exam News</span>
      <h1>Read, think, <span className="h3-grad">and stay updated</span></h1>
      <p>Study advice and ideas from the world of Maths, and exam updates for CBSE, ICSE and Olympiads, each with a link to the official notice.</p>
    </div></section>
    <section className="section"><div className="wrap tabs">
      {TABS.map((t, i) => (<Fragment key={t}>
        <input type="radio" name="cat" id={`cat-${i}`} defaultChecked={i === 0} />
        <label htmlFor={`cat-${i}`}>{t} <small>{POSTS.filter(p => p.category === t).length}</small></label>
      </Fragment>))}
      {TABS.map(t => {
        const list = POSTS.filter(p => p.category === t);
        return (<div key={t} className="tab-panel">
          {t === 'Exam News' && list.length > 0 && <p className="muted small" style={{marginBottom:'1rem'}}>Exam news here is written from official notices and links to them. Always confirm dates on the official website.</p>}
          {list.length === 0 && <p className="muted">No exam news has been posted yet. For dates, syllabus and notices, use the official websites below.</p>}
          <div className="grid">{list.map(p => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="card">
              <span className="muted small">{day(p.date)}</span>
              <h3 style={{marginTop:'.3rem'}}>{p.title}</h3>
              <p>{p.summary}</p>
            </Link>))}
          </div>
        </div>);
      })}
    </div></section>
    <section className="section soft"><div className="wrap">
      <div className="section-head"><h2>Official websites</h2><p>Always confirm exam dates and syllabus here.</p></div>
      <div className="grid">{OFFICIAL.map(o => (
        <a key={o.url} href={o.url} target="_blank" rel="noopener" className="card"><h3>{o.name}</h3><p>{o.about}</p></a>))}
      </div>
    </div></section>
  </>);
}
