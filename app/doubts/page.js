import Link from 'next/link';
import Doubts from '@/components/Doubts';
import { CLASSES } from '@/lib/data';

export const metadata = { title: 'Ask a Doubt', description: 'Stuck on a Maths question? Send your doubt with a photo and get a step-by-step answer from your MathSetu teacher.' };

export default function DoubtsPage() {
  const chapters = Object.fromEntries(Object.entries(CLASSES).map(([k, c]) => [k, c.chapters.map(ch => ({ id: `${k}/${ch.slug}`, title: ch.title, boards: ch.boards }))]));
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>Ask a Doubt</div>
      <h1>Ask a Doubt</h1>
      <p>Stuck on a question? Write it down, add a photo if it helps, and your teacher will reply with a step-by-step answer.</p>
    </div></div>
    <section className="section"><div className="wrap">
      <Doubts chapters={chapters} />
    </div></section>
  </>);
}
