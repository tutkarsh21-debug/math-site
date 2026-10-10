import Link from 'next/link';
import OneToOneRoom from '@/components/OneToOneRoom';

export const metadata = {
  title: '1-to-1 Classroom',
  description: 'Log in and join your 1-to-1 Maths class in a private video room on MathSetu.',
  robots: { index: false },
};

export default function OneToOneStudio() {
  return (<>
    <section className="sp-hero"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span><Link href="/studio">Studio</Link><span>/</span>1-to-1 classroom</div>
      <span className="sp-eyebrow"><i className="lv-dot" /> 1-to-1 classroom</span>
      <h1>You and your teacher, <span className="h3-grad">face to face</span></h1>
      <p>Log in, find your class below and press Join. The video room opens right here, with camera, microphone, chat and screen sharing.</p>
    </div></section>
    <section className="section"><div className="wrap narrow">
      <OneToOneRoom />
    </div></section>
  </>);
}
