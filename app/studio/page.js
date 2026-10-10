import Link from 'next/link';
import Timetable from '@/components/Timetable';

export const metadata = {
  title: 'MathSetu Studio: Live Classes, Recorded Lectures and 1-to-1 Classroom',
  description: 'Three rooms in one place: watch the live class, learn from recorded lectures class by class, and join your 1-to-1 class. With a timetable of every class.',
  alternates: { canonical: '/studio' },
};

const ROOMS = [
  { href: '/studio/live', tag: 'LIVE', title: 'Live studio', text: 'Watch the live class on the MathSetu YouTube channel, and see which classes are coming up.', go: 'Enter the live studio', tint: 't2' },
  { href: '/studio/recorded', tag: 'RECORDED', title: 'Recorded studio', text: 'Chapter-wise lecture playlists, by class. Pause, go back and watch again whenever you like.', go: 'Enter the recorded studio', tint: 't1' },
  { href: '/studio/one-to-one', tag: '1-TO-1', title: '1-to-1 classroom', text: 'Log in, see your own classes and join your teacher in a private video room, right here on the website.', go: 'Enter the classroom', tint: 't5' },
];

export default function Studio() {
  return (<>
    <section className="sp-hero"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>Studio</div>
      <span className="sp-eyebrow"><i className="lv-dot" /> MathSetu Studio</span>
      <h1>Your classroom, <span className="h3-grad">in three rooms</span></h1>
      <p>Watch live, learn from the recorded lectures, or join your own 1-to-1 class. Every class is on the timetable.</p>
    </div></section>

    <section className="section"><div className="wrap">
      <div className="grid studio-rooms">
        {ROOMS.map(r => (
          <Link key={r.href} href={r.href} className={`card studio-room ${r.tint}`}>
            <span className="badge live">{r.tag}</span>
            <h3>{r.title}</h3>
            <p>{r.text}</p>
            <span className="go">{r.go} →</span>
          </Link>))}
      </div>
    </div></section>

    <section className="section soft"><div className="wrap narrow">
      <Timetable scope="mine" title="My timetable" empty="No classes are scheduled for you yet. New classes appear here as soon as they are added." />
    </div></section>
  </>);
}
