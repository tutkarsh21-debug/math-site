import Link from 'next/link';
import TeacherDesk from '@/components/TeacherDesk';
import { CLASSES } from '@/lib/data';

export const metadata = { title: 'Teacher Desk', robots: { index: false } };

export default function TeacherPage() {
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span><Link href="/account">My Account</Link><span>/</span>Teacher desk</div>
      <h1>Teacher Desk</h1>
      <p>The doubts students have sent. Open one, write the solution on the whiteboard with your pen, and it is recorded and sent to the student.</p>
    </div></div>
    <section className="section"><div className="wrap">
      <TeacherDesk classLabels={Object.fromEntries(Object.entries(CLASSES).map(([k, c]) => [k, c.label]))}
        titles={Object.fromEntries(Object.entries(CLASSES).flatMap(([k, c]) => c.chapters.map(ch => [`${k}/${ch.slug}`, ch.title])))} />
    </div></section>
  </>);
}
