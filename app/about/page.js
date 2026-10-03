import Link from 'next/link';
import { SITE } from '@/lib/data';
export const metadata = { title: `About ${SITE.name}`,
  description: `${SITE.name} teaches Class 8-10 Maths for CBSE and ICSE, with video lessons in Hinglish, notes and practice in English, and Olympiad preparation.` };
export default function About() {
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>About</div>
      <h1>About {SITE.name}</h1>
      <p>A bridge between what is taught in class and what is asked in the exam.</p>
    </div></div>
    <div className="wrap prose">
      <p>&ldquo;Setu&rdquo; means bridge. {SITE.name} is built for students of Class 8, 9 and 10 who find that the
        textbook and the exam paper feel far apart. Each chapter is taken from the basics up to board-level
        questions, so the gap is closed one step at a time.</p>

      <h2>What we teach</h2>
      <ul>
        <li>Class 8, 9 and 10 Maths for both CBSE and ICSE. Chapters that are only in ICSE are marked.</li>
        <li>Preparation for the SOF IMO Olympiad, alongside the school syllabus.</li>
      </ul>

      <h2>How we teach</h2>
      <ul>
        <li><strong>Taught in Hinglish.</strong> Video lessons are explained in simple Hinglish, and the terms are kept in
          English exactly as they appear in the exam. Notes, examples and practice questions are written in English.</li>
        <li><strong>Concept first.</strong> Every chapter starts with why a method works, before the formula.</li>
        <li><strong>Exam-style practice.</strong> Solved examples are written the way answers are expected in
          the paper, with the common mistakes pointed out.</li>
        <li><strong>A little every day.</strong> A few problems daily do more than a long session once a week.</li>
      </ul>

      <h2>What you will find here</h2>
      <p>Each chapter has its own page with the video lesson, key formulas, the concept explained, solved
        examples, common mistakes, practice questions and FAQs. Chapters are being added one at a time, so
        some pages are still being prepared.</p>

      <h2>Understand once, score full marks</h2>
      <p>Understand a chapter properly once, and the marks follow. That is the idea behind everything on this site.</p>

      <h2>Our material</h2>
      <p>The notes, formula banks, practice sheets and diagrams on this site are written and drawn by {SITE.name}.
        Previous year questions are based on questions asked in past board examinations; they are reworded,
        and the solutions are our own. {SITE.name} is an independent study resource and is not affiliated with
        or endorsed by CBSE, CISCE, NCERT or any publisher. Names of boards and textbooks are used only to
        identify the syllabus a chapter belongs to.</p>

      <h2>Stay in touch</h2>
      <p>Daily problems are posted on Telegram and video lessons on YouTube. For questions, message us on Telegram.</p>
      <div className="cta-row">
        <a className="btn" href={SITE.telegram}>Join Telegram</a>
        <a className="btn btn-outline" href={SITE.youtube}>Watch on YouTube</a>
      </div>
    </div>
  </>);
}
