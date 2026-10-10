import Link from 'next/link';
import AdminTeachers from '@/components/AdminTeachers';

export const metadata = { title: 'Teachers', robots: { index: false } };

export default function AdminTeachersPage() {
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span><Link href="/admin">Owner dashboard</Link><span>/</span>Teachers</div>
      <h1>Teachers</h1>
      <p>Teachers see the doubts students send and solve them on a whiteboard. They cannot open the owner dashboard or see student scores.</p>
    </div></div>
    <section className="section"><div className="wrap">
      <AdminTeachers />
    </div></section>
  </>);
}
