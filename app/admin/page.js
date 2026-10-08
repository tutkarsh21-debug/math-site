import Link from 'next/link';
import AdminDashboard from '@/components/AdminDashboard';

export const metadata = { title: 'Owner Dashboard', robots: { index: false } };

export default function AdminPage() {
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>Owner dashboard</div>
      <h1>Owner Dashboard</h1>
      <p>How many students have joined, what they open, and how each one is doing.</p>
    </div></div>
    <section className="section"><div className="wrap">
      <AdminDashboard />
    </div></section>
  </>);
}
