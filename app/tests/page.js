import Link from 'next/link';
import { BOARDS, CLASSES } from '@/lib/data';
import TESTS from '@/lib/tests.json';

export const metadata = { title: 'Online Maths Test Series: Chapter Tests for Class 8, 9, 10',
  description: 'Free online chapter tests in Maths for Class 8, 9 and 10 (CBSE and ICSE). Timed multiple-choice tests with instant score and explanations.' };

export default function Tests() {
  const classes = Object.entries(CLASSES);
  const count = Object.keys(TESTS).length;
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>Test Series</div>
      <h1>Online Test Series (Class 8-10)</h1>
      <p>Timed chapter tests you take on this site. You get your score, the right answers and an explanation for every question as soon as you submit. There are {count} chapter tests, each with 10 questions.</p>
      <p style={{marginTop:'.6rem'}}><Link href="/login">Log in</Link> before a test to save your score in My tests.</p>
    </div></div>
    <section className="section"><div className="wrap">
      {classes.map(([k, c]) => (<div key={k} id={k} className="part">
        <h2>{c.label}</h2>
        {BOARDS.map(b => {
          const list = c.chapters.filter(ch => ch.boards.includes(b));
          if (!list.length) return null;
          const ready = list.filter(ch => TESTS[`${k}/${ch.slug}`]).length;
          return (<details key={b} open={ready > 0}>
            <summary>{c.label} {b} <span className="muted">· {ready} of {list.length} chapter tests</span></summary>
            <ol className="lectures">{list.map(ch => {
              const t = TESTS[`${k}/${ch.slug}`];
              return (<li key={ch.slug}>
                {t ? <Link href={`/tests/${k}/${ch.slug}`}>{ch.title}</Link> : <span style={{marginRight:'.6rem'}}>{ch.title}</span>}
                {t ? <span className="badge rec">{t.qs.length} Q · {t.minutes} MIN</span> : <span className="badge soon">Coming soon</span>}
              </li>);
            })}</ol>
          </details>);
        })}
      </div>))}
    </div></section>
  </>);
}
