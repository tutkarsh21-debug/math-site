import Link from 'next/link';
import InstallApp from '@/components/InstallApp';
import { SITE } from '@/lib/data';

export const metadata = { title: `${SITE.name} App for Android and iPhone`,
  description: `Install the ${SITE.name} app on your phone: Maths notes, practice, chapter tests and doubts for Class 8, 9 and 10, one tap from your home screen.` };

export default function AppPage() {
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>App</div>
      <h1>Get the {SITE.name} app</h1>
      <p>Add {SITE.name} to your phone's home screen. It opens full screen like any other app, takes almost no storage, and always shows the latest notes and tests.</p>
    </div></div>
    <section className="section"><div className="wrap narrow">
      <div className="card auth" style={{maxWidth:'none'}}>
        <h2>Install</h2>
        <InstallApp button />
      </div>
      <div className="prose" style={{paddingTop:'1.5rem'}}>
        <h2>On an Android phone (Chrome)</h2>
        <ol>
          <li>Open <strong>mathsetu.in</strong> in Chrome.</li>
          <li>Tap the three dots at the top right.</li>
          <li>Tap <strong>Add to Home screen</strong> (or <strong>Install app</strong>), then <strong>Install</strong>.</li>
        </ol>
        <h2>On an iPhone or iPad (Safari)</h2>
        <ol>
          <li>Open <strong>mathsetu.in</strong> in Safari.</li>
          <li>Tap the Share button (the square with an arrow).</li>
          <li>Scroll down and tap <strong>Add to Home Screen</strong>, then <strong>Add</strong>.</li>
        </ol>
        <h2>On a computer (Chrome or Edge)</h2>
        <p>Click the install icon at the right end of the address bar, then <strong>Install</strong>.</p>
        <h2>Good to know</h2>
        <ul>
          <li>The app needs an internet connection.</li>
          <li>Your login and saved test scores are the same in the app and on the website.</li>
          <li>There is nothing to update: the app always opens the current version.</li>
        </ul>
      </div>
    </div></section>
  </>);
}
