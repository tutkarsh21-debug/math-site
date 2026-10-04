import Link from 'next/link';
import AdminDoubts from '@/components/AdminDoubts';
import { CLASSES } from '@/lib/data';

export const metadata = { title: 'Doubts', robots: { index: false } };

export default function AdminDoubtsPage() {
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span><Link href="/account">My Account</Link><span>/</span>Doubts</div>
      <h1>Doubts</h1>
    </div></div>
    <section className="section"><div className="wrap">
      <AdminDoubts classLabels={Object.fromEntries(Object.entries(CLASSES).map(([k, c]) => [k, c.label]))}
        titles={Object.fromEntries(Object.entries(CLASSES).flatMap(([k, c]) => c.chapters.map(ch => [`${k}/${ch.slug}`, ch.title])))} />
    </div></section>
  </>);
}
