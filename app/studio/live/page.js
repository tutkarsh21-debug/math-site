import Link from 'next/link';
import LivePlayer from '@/components/LivePlayer';
import Timetable from '@/components/Timetable';
import { SITE } from '@/lib/data';

export const metadata = {
  title: 'Live Studio: Watch the Live Maths Class',
  description: 'Watch the MathSetu live Maths class on YouTube, and see the timetable of the coming live classes for Class 8, 9 and 10.',
  alternates: { canonical: '/studio/live' },
};

export default function LiveStudio() {
  return (<>
    <section className="sp-hero"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span><Link href="/studio">Studio</Link><span>/</span>Live studio</div>
      <span className="sp-eyebrow"><i className="lv-dot" /> Live studio</span>
      <h1>Watch the <span className="h3-grad">live class</span></h1>
      <p>The class streams live on the MathSetu YouTube channel and plays right here. Check the timetable to see when the next one starts.</p>
    </div></section>
    <section className="section"><div className="wrap studio-live">
      <LivePlayer />
      <div>
        <Timetable scope="live" title="Live class timetable" empty="No live classes are scheduled yet. Follow us on Telegram to hear first when a class is added." />
        <p className="muted small" style={{ marginTop: '.8rem' }}>Reminders and announcements: <a href={SITE.telegram}>Telegram</a> · <a href={SITE.youtube}>YouTube</a></p>
      </div>
    </div></section>
  </>);
}
