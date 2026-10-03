import Link from 'next/link';
import { SITE } from '@/lib/data';

export const metadata = { title: 'Enquiry', description: 'Ask about MathSetu live courses for Class 8, 9 and 10 Maths.' };

export default function Enquiry() {
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>Enquiry</div>
      <h1>Enquiry</h1>
      <p>Tell us your name, class and board, and we will get back to you about live courses.</p>
    </div></div>
    <section className="section"><div className="wrap narrow">
      {SITE.enquiryForm
        ? <iframe className="gform" src={SITE.enquiryForm} title="Enquiry form" loading="lazy">Loading…</iframe>
        : <div className="card auth">
            <h2>Send your enquiry on Telegram</h2>
            <p className="muted">Message us with your name, class (8, 9 or 10) and board (CBSE or ICSE).</p>
            <a className="btn" href={SITE.telegram}>Open Telegram</a>
          </div>}
    </div></section>
  </>);
}
