import Link from 'next/link';
import StudioManager from '@/components/StudioManager';

export const metadata = { title: 'Studio manager', robots: { index: false } };

export default function AdminStudioPage() {
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span><Link href="/admin">Owner dashboard</Link><span>/</span>Studio manager</div>
      <h1>Studio manager</h1>
      <p>Add live classes and 1-to-1 classes to the timetable, and add the YouTube playlists of the recorded studio. Students see the timetable in their account.</p>
    </div></div>
    <section className="section"><div className="wrap narrow">
      <StudioManager />
    </div></section>
  </>);
}
