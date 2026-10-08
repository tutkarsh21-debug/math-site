import Link from 'next/link';
import { SITE } from '@/lib/data';

export const metadata = { title: 'Privacy Policy', description: `What ${SITE.name} stores about students who register, and why.` };

export default function Privacy() {
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>Privacy Policy</div>
      <h1>Privacy Policy</h1>
    </div></div>
    <div className="wrap prose">
      <p>You can read the notes, download the PDFs and take the tests on {SITE.name} without giving any personal details.</p>
      <h2>What we store when you register</h2>
      <ul>
        <li>Your name, mobile number, class and board.</li>
        <li>A scrambled (hashed) form of your password. The password itself is never stored and cannot be read by anyone.</li>
        <li>The scores of the tests you finish while logged in, including the practice tests you make and how each topic went.</li>
        <li>Which pages and PDFs you open while you are logged in, and when. This is not recorded if you are not logged in.</li>
      </ul>
      <h2>Why we store it</h2>
      <p>To let you log in, to show your progress on your own dashboard, to let the teacher see how each student is doing and which content is used, and to improve the lessons. We do not sell these details or share them with advertisers.</p>
      <h2>Who can see it</h2>
      <ul>
        <li><b>You</b>, on your dashboard.</li>
        <li><b>A parent or guardian</b>, only if you make a parent code on your dashboard and give it to them. They can look but cannot change anything, and you can switch their access off at any time.</li>
        <li><b>The site owner and teacher</b>, on a private owner dashboard.</li>
      </ul>
      <h2>AI reports</h2>
      <p>If you press the button for an AI report on a test, the topic-wise result of that test (which topics were right or wrong, and the text of the questions you missed) is sent to an AI service (Claude, by Anthropic) so that it can write the report. Your name, mobile number and password are not sent.</p>
      <h2>Cookies</h2>
      <p>One cookie is set when you log in, to keep you logged in on that device. It is removed when you log out.</p>
      <h2>Students under 18</h2>
      <p>If you are under 18, please register only with the permission of a parent or guardian.</p>
      <h2>Deleting your account</h2>
      <p>Message us on <a href={SITE.telegram}>Telegram</a> from your registered number and we will delete your account, scores and doubts.</p>
      <h2>Ask a Doubt</h2>
      <p>When you ask a doubt we store your question and the photo you attach, along with the answer. Only you and your teacher can see them. To help the teacher reply quickly, the question and the photo may be sent to an AI service (Claude, by Anthropic) to prepare a draft answer, which the teacher checks before it is sent to you. Please do not put faces or personal details in the photo.</p>
      <h2>Enquiry form</h2>
      <p>When you send an enquiry we store the student's name, the mobile number, the class, the board and your message. These are used only to reply to you and are not shared.</p>
    </div>
  </>);
}
