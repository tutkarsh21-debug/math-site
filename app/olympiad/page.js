import { Fragment } from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/data';
import { OLY_GROUPS } from '@/lib/olympiad';
import TESTS from '@/lib/tests.json';
export const metadata = { title: 'SOF IMO Olympiad Preparation for Class 8, 9, 10',
  description: 'SOF IMO preparation for Class 8-10: short notes, DPP and a test for every mental ability and everyday mathematics topic, and HOTS questions class-wise.' };

export default function Olympiad() {
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>Olympiad</div>
      <h1>SOF IMO Preparation (Class 8-10)</h1>
      <p>Exam dates and pattern change every year. Always confirm them on the official SOF website.</p>
    </div></div>
    <div className="wrap prose">
      <h2 style={{marginTop:0}}>How to prepare</h2>
      <ul><li>Finish the school syllabus first.</li><li>Practise logical reasoning and number patterns daily.</li>
        <li>Solve past-style questions under a timer.</li></ul>

      <h2>Practice by question type</h2>
      <p>Every topic has short notes, a quick-rules sheet, a DPP with answers and a timed subject test. The HOTS section has solved questions class-wise.</p>
      <div className="tabs">
        {OLY_GROUPS.map((s, i) => (<Fragment key={s.id}>
          <input type="radio" name="olympiad" id={s.id} defaultChecked={i === 0} />
          <label htmlFor={s.id}>{s.tab}</label>
        </Fragment>))}
        {OLY_GROUPS.map(s => (<div key={s.id} className="tab-panel">
          <h3>{s.title}</h3>
          <p>{s.intro}</p>
          <ol className="lectures">{s.topics.map(t => (<li key={t.slug}>
            <Link href={`/olympiad/${t.slug}`}>{t.title}</Link>
            {TESTS[`olympiad/${t.slug}`] && <span className="badge rec">{TESTS[`olympiad/${t.slug}`].qs.length} Q TEST</span>}
            <span className="muted small" style={{display:'block'}}>{t.summary}</span>
          </li>))}</ol>
          <p><strong>Tip:</strong> {s.tip}</p>
        </div>))}
      </div>

      <h2>Practice</h2><p>Daily problems and mock tests are posted on <a href={SITE.telegram}>Telegram</a>. You can also <Link href="/practice">make your own practice test</Link>.</p>
      <p><a className="btn" href={SITE.telegram}>Join Telegram</a></p>
    </div>
  </>);
}
