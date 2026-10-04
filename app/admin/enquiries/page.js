import Link from 'next/link';
import Enquiries from '@/components/Enquiries';
import { CLASSES } from '@/lib/data';

export const metadata = { title: 'Enquiries', robots: { index: false } };

export default function EnquiriesPage() {
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span><Link href="/account">My Account</Link><span>/</span>Enquiries</div>
      <h1>Enquiries</h1>
    </div></div>
    <section className="section"><div className="wrap">
      <Enquiries classLabels={Object.fromEntries(Object.entries(CLASSES).map(([k, c]) => [k, c.label]))} />
    </div></section>
  </>);
}
