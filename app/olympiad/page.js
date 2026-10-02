import { SITE } from '@/lib/data';
export const metadata = { title: 'SOF IMO Olympiad Preparation for Class 8, 9, 10',
  description: 'SOF IMO preparation: pattern, syllabus, how to prepare, and free practice sets for Class 8-10.' };
export default function Olympiad() {
  return (<>
    <h1>SOF IMO Preparation (Class 8-10)</h1>
    <p>Exam dates and pattern change every year. Always confirm them on the official SOF website.</p>
    <h2>How to prepare</h2>
    <ul><li>Finish the school syllabus first.</li><li>Practise logical reasoning and number patterns daily.</li>
      <li>Solve past-style questions under a timer.</li></ul>
    <h2>Practice</h2><p>Daily problems and mock tests are posted on <a href={SITE.telegram}>Telegram</a>.</p>
  </>);
}
