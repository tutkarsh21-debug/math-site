import Link from 'next/link';
import Account from '@/components/Account';

export const metadata = { title: 'My Dashboard', robots: { index: false } };

export default function AccountPage() {
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>My Dashboard</div>
      <h1>My Dashboard</h1>
    </div></div>
    <section className="section"><div className="wrap">
      <Account />
    </div></section>
  </>);
}
