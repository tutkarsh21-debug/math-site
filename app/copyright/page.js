import Link from 'next/link';
import { SITE } from '@/lib/data';

export const metadata = { title: 'Copyright and Disclaimer', description: `How ${SITE.name} creates its study material, what you may do with it, and how to report a concern.` };

export default function Copyright() {
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>Copyright and Disclaimer</div>
      <h1>Copyright and Disclaimer</h1>
    </div></div>
    <div className="wrap prose">
      <h2>Who we are</h2>
      <p>{SITE.name} is an independent study resource for Class 8, 9 and 10 Maths. We are not affiliated with, endorsed by or sponsored by CBSE, CISCE, NCERT, SOF or any publisher. The names of boards, books and examinations are the property of their owners. We use them only to say which syllabus a chapter belongs to.</p>

      <h2>How our material is made</h2>
      <ul>
        <li><b>Notes, formula banks, practice sheets, tests, sample papers and blog posts</b> are written by {SITE.name}. Sample papers are practice papers on the pattern of the board exam; they are not official papers.</li>
        <li><b>Textbook exercise solutions</b> follow the exercises of the textbooks. The questions are restated in our own words, the solutions are our own, and every diagram is redrawn. We do not reproduce the text, figures or solutions of the books or of any other website. To see a question in its original form, please open the textbook.</li>
        <li><b>Previous year questions</b> are based on questions asked in past board examinations. They are reworded, the figures are redrawn and the solutions are ours. Official question papers are available on the website of the board.</li>
        <li><b>Short mathematical facts</b> such as definitions, theorems, formulas and identities are common to every textbook. We write them in our own words.</li>
      </ul>

      <h2>Where to find the official books</h2>
      <p>NCERT textbooks can be read and downloaded free from the NCERT website (ncert.nic.in). For ICSE, please use the book prescribed by your school. Our material is meant to be used alongside the textbook, not in place of it.</p>

      <h2>Using our material</h2>
      <ul>
        <li>You may read, download and print our PDFs for your own study, and share the link to a page with friends.</li>
        <li>Please do not copy our material to another website, app or channel, sell it, or use it in paid courses without our written permission. Message us on <a href={SITE.telegram}>Telegram</a> to ask.</li>
      </ul>

      <h2>What students send us</h2>
      <p>When you use <Link href="/doubts">Ask a Doubt</Link>, please send only the question you want help with. Do not upload whole pages or chapters of books, or material that belongs to someone else. Doubts are private and are never published. We may delete a doubt that does not follow this rule.</p>

      <h2>Accuracy</h2>
      <p>We take care to make our solutions correct, but mistakes can happen. If you find one, please tell us. Syllabuses and exam patterns change from time to time, so always confirm dates, syllabus and marking scheme on the official website of your board. {SITE.name} does not promise any particular marks or result.</p>

      <h2>Report a copyright concern</h2>
      <p>If you own the rights to something and believe a page of this site uses it without permission, please message us on <a href={SITE.telegram}>Telegram</a> with the link to the page and a short description of the concern. We will look at it promptly and, where needed, correct or remove the material.</p>
    </div>
  </>);
}
