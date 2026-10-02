import './globals.css';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { CLASSES, SITE } from '@/lib/data';

const poppins = Poppins({ subsets: ['latin', 'devanagari'], weight: ['400', '500', '600', '700'], variable: '--font', display: 'swap' });

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | Class 8-10 Maths in Hindi + English`, template: `%s | ${SITE.name}` },
  description: 'Class 8-10 Maths for CBSE and ICSE in Hindi + English: video lessons, notes, practice and Olympiad prep.',
};

const Brand = () => (<Link className="brand" href="/"><img className="logo" src="/logo.svg" alt="" width="34" height="34" />{SITE.name}</Link>);

export default function RootLayout({ children }) {
  const classes = Object.entries(CLASSES);
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <header className="site-header"><div className="wrap bar">
          <Brand />
          <nav className="nav">
            <Link href="/about">About</Link>
            {classes.map(([k, c]) => <Link key={k} href={`/${k}`}>{c.label}</Link>)}
            <Link href="/olympiad">Olympiad</Link>
          </nav>
          <a className="btn btn-sm" href={SITE.telegram}>Join Telegram</a>
        </div></header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="wrap foot-grid">
            <div>
              <Brand />
              <p>Class 8-10 Maths for CBSE and ICSE, explained in Hindi + English, from basics to Olympiad.</p>
            </div>
            <div><h3>Classes</h3>
              {classes.map(([k, c]) => <Link key={k} href={`/${k}`}>{c.label} Maths</Link>)}
              <Link href="/olympiad">Olympiad (SOF IMO)</Link>
            </div>
            <div><h3>Chapters</h3>
              {classes.map(([k, c]) => <Link key={k} href={`/${k}/${c.chapters[0].slug}`}>{c.chapters[0].title}</Link>)}
            </div>
            <div><h3>Connect</h3>
              <a href={SITE.telegram}>Telegram</a>
              <a href={SITE.youtube}>YouTube</a>
              <Link href="/about">About {SITE.name}</Link>
            </div>
          </div>
          <div className="wrap copy">© {new Date().getFullYear()} {SITE.name}</div>
        </footer>
      </body>
    </html>
  );
}
