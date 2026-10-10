import Link from 'next/link';
import RecordedStudio from '@/components/RecordedStudio';

export const metadata = {
  title: 'Recorded Studio: Maths Lecture Playlists for Class 8, 9, 10',
  description: 'Recorded Maths lectures from the MathSetu YouTube channel, class by class. Pause, rewind and watch again.',
  alternates: { canonical: '/studio/recorded' },
};

export default function RecordedStudioPage() {
  return (<>
    <section className="sp-hero"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span><Link href="/studio">Studio</Link><span>/</span>Recorded studio</div>
      <span className="sp-eyebrow"><i className="lv-dot" /> Recorded studio</span>
      <h1>Learn at <span className="h3-grad">your own time</span></h1>
      <p>Lecture playlists from the MathSetu YouTube channel, class by class. Pause, go back and watch again as often as you need.</p>
    </div></section>
    <section className="section"><div className="wrap">
      <RecordedStudio />
    </div></section>
  </>);
}
