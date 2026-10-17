import { fit } from '@/lib/seo';
import { Fragment } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PdfLink from '@/components/PdfLink';
import JsonLd, { breadcrumbs } from '@/components/JsonLd';
import { SITE } from '@/lib/data';
import { OLY_TOPICS, findOlyTopic } from '@/lib/olympiad';
import PDFS from '@/lib/pdfs.json';
import TESTS from '@/lib/tests.json';
import { olympiadFaq } from '@/lib/faq';

export const generateStaticParams = () => OLY_TOPICS.map(t => ({ slug: t.slug }));

// The tabs of a topic. Each shows a PDF from public/pdf/olympiad/<slug>/. HOTS sets have solved questions and a practice sheet.
const TABS = [
  { file: 'notes', label: 'Short Notes', hots: 'Solved HOTS Questions', about: 'Short notes with solved examples.', aboutHots: 'Higher order thinking questions, each with a full solution.' },
  { file: 'formulas', label: 'Quick Rules', about: 'The rules and formulas of the topic on one sheet.' },
  { file: 'dpp', label: 'DPP Sheet', hots: 'Practice Set', about: 'Daily practice problems with an answer key.', aboutHots: 'Ten practice questions with answers.' },
];

export async function generateMetadata({ params }) {
  const { slug } = await params, t = findOlyTopic(slug); if (!t) return {};
  const mat = t.group.id === 'mental-ability';
  return { title: fit(`${t.title}: ${t.hots ? 'Olympiad HOTS Questions with Solutions' : (mat ? 'Mental Ability Notes, DPP and Test' : 'Everyday Mathematics Notes, DPP and Test')}`, `${t.title}: ${t.hots ? 'Olympiad HOTS Questions' : (mat ? 'Mental Ability Notes and Test' : 'Everyday Maths Notes and Test')}`, `${t.title}: Olympiad Notes and Test`, `${t.title} Olympiad`, t.title),
    description: `${t.summary} Free PDF ${t.hots ? 'solved questions, a practice set' : 'short notes, quick rules, DPP'} and an online test for Olympiad preparation.`.slice(0, 300),
    alternates: { canonical: `/olympiad/${slug}` } };
}

export default async function OlympiadTopic({ params }) {
  const { slug } = await params, t = findOlyTopic(slug); if (!t) notFound();
  const ready = PDFS[`olympiad/${slug}`] || [], test = TESTS[`olympiad/${slug}`];
  const tabs = TABS.filter(x => ready.includes(x.file));
  const faq = olympiadFaq({ t, ready, test });
  const same = t.cls ? t.group.topics.filter(x => x.cls === t.cls) : t.group.topics, i = same.findIndex(x => x.slug === slug), prev = same[i - 1], next = same[i + 1];
  return (<>
    <JsonLd data={breadcrumbs([['Olympiad', '/olympiad'], [t.title, `/olympiad/${slug}`]])} />
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'LearningResource', name: `${t.title}: ${t.group.title}`, url: `${SITE.url}/olympiad/${slug}`,
      description: t.summary, inLanguage: 'en', isAccessibleForFree: true, learningResourceType: ['Notes', 'Practice problems'], provider: { '@id': `${SITE.url}/#org` } }} />
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }} />
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span><Link href="/olympiad">Olympiad</Link><span>/</span>{t.title}</div>
      <h1>{t.title}</h1>
      <p><span className="tag">{t.group.tab}</span>{t.cls && <span className="tag">{t.cls}</span>}</p>
      <p style={{marginTop:'.6rem'}}>{t.summary}</p>
    </div></div>
    <div className="wrap chapter">
      <article>
        <div className="tabs" id="material">
          {tabs.map((x, n) => (<Fragment key={x.file}>
            <input type="radio" name="material" id={`tab-${x.file}`} defaultChecked={n === 0} />
            <label htmlFor={`tab-${x.file}`}>{t.hots && x.hots ? x.hots : x.label}</label>
          </Fragment>))}
          {tabs.map(x => {
            const pdf = `/pdf/olympiad/${slug}/${x.file}.pdf`, name = t.hots && x.hots ? x.hots : x.label;
            return (<div key={x.file} className="tab-panel"><div className="pdf-block">
              <div className="pdf-bar">
                <span>{t.hots && x.aboutHots ? x.aboutHots : x.about}</span>
                <span className="cta-row">
                  <PdfLink className="btn btn-sm" href={pdf} target="_blank" rel="noopener">Open PDF</PdfLink>
                  <PdfLink className="btn btn-sm btn-outline" href={pdf} download={`MathSetu-olympiad-${slug}-${x.file}.pdf`}>Download</PdfLink>
                </span>
              </div>
              <p className="pdf-note muted small">On a phone, tap Open PDF to read it full screen.</p>
              <iframe className="pdf" src={`${pdf}#navpanes=0&view=FitH`} title={`${t.title}: ${name}`} loading="lazy" />
            </div></div>);
          })}
        </div>
        <section className="chapter-faq">
          <h2>Questions about {t.title}</h2>
          {faq.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
        </section>
        {test && <div className="banner" style={{marginTop:'2rem'}}>
          <div><h2>{t.hots ? 'HOTS test' : 'Subject test'}</h2><p>{test.qs.length} questions · {test.minutes} minutes · instant score with explanations</p></div>
          <Link className="btn btn-sun" href={`/tests/olympiad/${slug}`}>Start test</Link>
        </div>}
        <p className="cta-row" style={{marginTop:'2rem'}}><a className="btn btn-outline btn-sm" href={SITE.telegram}>Join Telegram for daily problems</a></p>
        <p className="prevnext">
          {prev ? <Link href={`/olympiad/${prev.slug}`}>← {prev.title}</Link> : <span />}
          {next && <Link href={`/olympiad/${next.slug}`}>{next.title} →</Link>}
        </p>
      </article>
      <aside className="side">
        <div className="card"><h3>{t.cls ? `HOTS ${t.cls}` : t.group.title}</h3>
          {same.map(x => <Link key={x.slug} href={`/olympiad/${x.slug}`} aria-current={x.slug === slug ? 'page' : undefined}>{x.title}</Link>)}</div>
      </aside>
    </div>
  </>);
}
