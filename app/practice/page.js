import { Fragment } from 'react';
import Link from 'next/link';
import PracticeBuilder from '@/components/PracticeBuilder';
import PdfLink from '@/components/PdfLink';
import JsonLd, { breadcrumbs } from '@/components/JsonLd';
import { OLY_GROUPS } from '@/lib/olympiad';
import PDFS from '@/lib/pdfs.json';
import TESTS from '@/lib/tests.json';

export const metadata = {
  title: 'Maths Practice Test Generator, Class 8-10',
  description: 'Build your own Maths practice test with the class, chapters and difficulty you choose, or practise Olympiad questions: a DPP and a timed test for every mental ability, everyday mathematics and HOTS topic.',
};

export default async function Practice({ searchParams }) {
  const olympiad = (await searchParams)?.tab === 'olympiad';
  return (<>
    <JsonLd data={breadcrumbs([['Practice', '/practice']])} />
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>Practice</div>
      <h1>Practice</h1>
      <p>Build a brand-new test in a second, or practise Olympiad questions topic by topic.</p>
    </div></div>
    <section className="section"><div className="wrap">
      <div className="tabs">
        <input type="radio" name="practice" id="tab-gen" defaultChecked={!olympiad} />
        <label htmlFor="tab-gen">Practice Test Generator</label>
        <input type="radio" name="practice" id="tab-oly" defaultChecked={olympiad} />
        <label htmlFor="tab-oly">Olympiad Practice Questions</label>

        <div className="tab-panel">
          <div className="narrow"><PracticeBuilder /></div>
        </div>

        <div className="tab-panel">
          <h2 style={{marginTop:0}}>Olympiad practice questions</h2>
          <p className="muted">For every topic there is a DPP sheet (practice questions with answers) and a timed test with explanations. Notes and quick rules are on the topic page.</p>
          {OLY_GROUPS.map((g, i) => (<div key={g.id} className={`oly-grp g${i + 1}`}>
            <h3>{g.title}</h3>
            {(g.id === 'hots' ? ['Class 8', 'Class 9', 'Class 10'] : [null]).map(c => {
              const list = c ? g.topics.filter(t => t.cls === c) : g.topics;
              return (<Fragment key={c || 'all'}>
                {c && <h4>{c}</h4>}
                <ul className="oly-list">{list.map(t => {
                  const test = TESTS[`olympiad/${t.slug}`], dpp = (PDFS[`olympiad/${t.slug}`] || []).includes('dpp');
                  return (<li key={t.slug}>
                    <span className="oly-name">{t.mixed ? 'Mixed set' : t.title.replace(/^HOTS: /, '').replace(/ \(Class \d+\)$/, '')}</span>
                    <span className="cta-row">
                      {dpp && <PdfLink className="btn btn-sm btn-outline" href={`/pdf/olympiad/${t.slug}/dpp.pdf`} target="_blank" rel="noopener">DPP</PdfLink>}
                      {test && <Link className="btn btn-sm" href={`/tests/olympiad/${t.slug}`}>Test · {test.qs.length} Q</Link>}
                      <Link className="btn btn-sm btn-outline" href={`/olympiad/${t.slug}`}>Notes</Link>
                    </span>
                  </li>);
                })}</ul>
              </Fragment>);
            })}
          </div>))}
        </div>
      </div>
    </div></section>
  </>);
}
