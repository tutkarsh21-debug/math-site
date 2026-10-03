import './globals.css';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import AccountButton from '@/components/AccountButton';
import { CLASSES, MODES, MORE, SITE } from '@/lib/data';

const poppins = Poppins({ subsets: ['latin', 'devanagari'], weight: ['400', '500', '600', '700'], variable: '--font', display: 'swap' });

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | Class 8-10 Maths for CBSE & ICSE`, template: `%s | ${SITE.name}` },
  description: 'Class 8-10 Maths for CBSE and ICSE: video lessons in Hinglish, with notes, practice and Olympiad prep.',
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
            {MODES.map(m => <Link key={m.href} href={m.href}>{m.label}</Link>)}
            {MORE.map(m => <Link key={m.href} href={m.href}>{m.label}</Link>)}
          </nav>
          <AccountButton />
        </div></header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="wrap foot-grid">
            <div>
              <Brand />
              <p>Class 8-10 Maths for CBSE and ICSE, taught in Hinglish, from basics to Olympiad.</p>
            </div>
            <div><h3>Classes</h3>
              {classes.map(([k, c]) => <Link key={k} href={`/${k}`}>{c.label} Maths</Link>)}
              <Link href="/olympiad">Olympiad (SOF IMO)</Link>
            </div>
            <div><h3>Learn</h3>
              {MODES.map(m => <Link key={m.href} href={m.href}>{m.label}</Link>)}
              <Link href="/tests">Test Series</Link>
              <Link href="/sample-papers">Sample Papers</Link>
              <Link href="/blog">Blog and Exam News</Link>
            </div>
            <div><h3>Connect</h3>
              <a href={SITE.telegram}>Telegram</a>
              <a href={SITE.youtube}>YouTube</a>
              <Link href="/enquiry">Enquiry</Link>
              <Link href="/login">Login / Register</Link>
              <Link href="/about">About {SITE.name}</Link>
              <Link href="/privacy">Privacy Policy</Link>
            </div>
          </div>
          <div className="wrap copy">© {new Date().getFullYear()} {SITE.name}. An independent study resource, not affiliated with or endorsed by CBSE, CISCE, NCERT or any publisher. Board and book names are used only to identify the syllabus.</div>
        </footer>
      </body>
    </html>
  );
}
