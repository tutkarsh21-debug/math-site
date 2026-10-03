import Link from 'next/link';
import Account from '@/components/Account';
import { CLASSES } from '@/lib/data';
import TESTS from '@/lib/tests.json';

export const metadata = { title: 'My Account', robots: { index: false } };

export default function AccountPage() {
  // Readable names for the saved tests: "Real Numbers (Class 10 CBSE)".
  const titles = Object.fromEntries(Object.keys(TESTS).map(id => {
    const [cls, slug] = id.split('/'), ch = CLASSES[cls]?.chapters.find(x => x.slug === slug);
    return [id, ch ? `${ch.title} (${CLASSES[cls].label} ${ch.boards[0]})` : id];
  }));
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>My Account</div>
      <h1>My Account</h1>
    </div></div>
    <section className="section"><div className="wrap">
      <Account titles={titles} classLabels={Object.fromEntries(Object.entries(CLASSES).map(([k, c]) => [k, c.label]))} />
    </div></section>
  </>);
}
