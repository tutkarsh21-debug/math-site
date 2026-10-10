import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PARENT_LOGIN } from '@/lib/data';
import ParentPortal from '@/components/ParentPortal';

export const metadata = { title: 'Parent Dashboard', description: 'See how your child is doing on MathSetu: tests, scores, strong and weak topics and what they have studied.', robots: { index: false } };

export default function ParentPage() {
  if (!PARENT_LOGIN) notFound();   // hidden for now: see PARENT_LOGIN in lib/data.js
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>Parent dashboard</div>
      <h1>Parent Dashboard</h1>
      <p>See your child's tests, scores, strong and weak topics, and what they have been studying.</p>
    </div></div>
    <section className="section"><div className="wrap">
      <ParentPortal />
    </div></section>
  </>);
}
