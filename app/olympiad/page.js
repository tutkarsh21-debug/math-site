import { Fragment } from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/data';
export const metadata = { title: 'SOF IMO Olympiad Preparation for Class 8, 9, 10',
  description: 'SOF IMO preparation for Class 8-10: mental ability, everyday mathematics and HOTS questions, with how to prepare.' };

const SECTIONS = [
  { id: 'mental-ability', tab: 'Mental Ability', title: 'Mental Ability',
    intro: 'Reasoning questions that need no formula, only careful thinking. They are quick marks once the common patterns are familiar.',
    topics: ['Number and letter series', 'Analogy and classification (odd one out)', 'Coding and decoding', 'Direction sense',
      'Blood relations', 'Ranking and ordering', 'Mirror and water images', 'Venn diagrams', 'Clocks and calendars'],
    tip: 'Practise a few every day and time yourself. Speed here leaves more time for the harder sections.' },
  { id: 'everyday-mathematics', tab: 'Everyday Mathematics', title: 'Everyday Mathematics',
    intro: 'Word problems from daily life. The maths is from your school syllabus; the skill is turning the story into an equation.',
    topics: ['Percentage', 'Profit, loss and discount', 'Simple and compound interest', 'Ratio and proportion',
      'Time and work', 'Speed, distance and time', 'Averages', 'Area, perimeter and volume in real situations', 'Reading tables and graphs'],
    tip: 'Underline what is given and what is asked before you calculate. Most mistakes are in reading, not in arithmetic.' },
  { id: 'hots', tab: 'HOTS', title: 'HOTS (Higher Order Thinking Skills) Questions',
    intro: 'Questions that join two or more ideas, or ask a familiar idea in an unfamiliar way. They carry more marks and decide the top ranks.',
    topics: ['Problems that combine two chapters', 'Multi-step problems with a hidden first step', 'Statement-based questions (which statements are true)',
      'Match the column questions', 'Finding the error in a given solution', 'Non-routine geometry and number problems'],
    tip: 'Finish the chapter properly first. Then try each question for a few minutes before looking at the solution.' },
];

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
      <div className="tabs">
        {SECTIONS.map((s, i) => (<Fragment key={s.id}>
          <input type="radio" name="olympiad" id={s.id} defaultChecked={i === 0} />
          <label htmlFor={s.id}>{s.tab}</label>
        </Fragment>))}
        {SECTIONS.map(s => (<div key={s.id} className="tab-panel">
          <h3>{s.title}</h3>
          <p>{s.intro}</p>
          <p><strong>What to practise</strong></p>
          <ul>{s.topics.map(t => <li key={t}>{t}</li>)}</ul>
          <p><strong>Tip:</strong> {s.tip}</p>
          <p className="muted">Practice sets for this section are being prepared.</p>
        </div>))}
      </div>

      <h2>Practice</h2><p>Daily problems and mock tests are posted on <a href={SITE.telegram}>Telegram</a>.</p>
      <p><a className="btn" href={SITE.telegram}>Join Telegram</a></p>
    </div>
  </>);
}
