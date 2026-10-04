import Link from 'next/link';
import EnquiryForm from '@/components/EnquiryForm';
import { BOARDS, CLASSES, SITE } from '@/lib/data';

export const metadata = { title: 'Enquiry', description: 'Ask about MathSetu live courses for Class 8, 9 and 10 Maths.' };

export default function Enquiry() {
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>Enquiry</div>
      <h1>Enquiry</h1>
      <p>Tell us the student's name, class and board, and we will get back to you about live courses.</p>
    </div></div>
    <section className="section"><div className="wrap">
      <EnquiryForm classes={Object.entries(CLASSES).map(([k, c]) => [k, c.label])} boards={BOARDS} />
      <p className="muted small" style={{marginTop:'1rem'}}>You can also message us on <a href={SITE.telegram}>Telegram</a>.</p>
    </div></section>
  </>);
}
