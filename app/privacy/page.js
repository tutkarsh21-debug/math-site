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
        <li>The scores of the tests you finish while logged in.</li>
      </ul>
      <h2>Why we store it</h2>
      <p>Only to let you log in and to show your scores on your account page. We do not sell or share these details.</p>
      <h2>Cookies</h2>
      <p>One cookie is set when you log in, to keep you logged in on that device. It is removed when you log out.</p>
      <h2>Students under 18</h2>
      <p>If you are under 18, please register only with the permission of a parent or guardian.</p>
      <h2>Deleting your account</h2>
      <p>Message us on <a href={SITE.telegram}>Telegram</a> from your registered number and we will delete your account and scores.</p>
      <h2>Enquiry form</h2>
      <p>Enquiries are collected through a Google Form. Details entered there are stored by Google on our behalf and are used only to reply to you.</p>
    </div>
  </>);
}
