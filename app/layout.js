import './globals.css';
import Link from 'next/link';
import { Quicksand } from 'next/font/google';
import AccountButton from '@/components/AccountButton';
import InstallApp from '@/components/InstallApp';
import Tracker from '@/components/Tracker';
import JsonLd from '@/components/JsonLd';
import NavMenu from '@/components/NavMenu';
import { CLASSES, NAV, PARENT_LOGIN, SITE } from '@/lib/data';

// A rounded, friendly typeface. The site has no Hindi-script text, so only the Latin letters are loaded.
const poppins = Quicksand({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font', display: 'swap' });

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | Class 8, 9, 10 Maths Notes, Tests and Classes for CBSE & ICSE`, template: `%s | ${SITE.name}` },
  description: 'Free Maths notes, formula sheets, DPP and online tests for Class 8, 9 and 10 (CBSE and ICSE), with previous year questions, NCERT solutions and doubt help.',
  // Each page names its own address as the one to index, so copies on other addresses are not counted separately.
  alternates: { canonical: './' },
  openGraph: { siteName: SITE.name, type: 'website', locale: 'en_IN', images: [{ url: '/og.png', width: 1200, height: 630, alt: `${SITE.name}: Class 8, 9 and 10 Maths` }] },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
  // For the installed app on iPhones, which do not read everything from the manifest.
  appleWebApp: { capable: true, title: SITE.name, statusBarStyle: 'default' },
  icons: { apple: '/icons/icon-180.png' },
};
// The colour of the phone's status bar around the site and the installed app.
export const viewport = { themeColor: [{ media: '(prefers-color-scheme: light)', color: '#f15d22' }, { media: '(prefers-color-scheme: dark)', color: '#1c1917' }] };

// Who runs the site, for search engines.
const ORG = {
  '@context': 'https://schema.org', '@graph': [
    { '@type': 'EducationalOrganization', '@id': `${SITE.url}/#org`, name: SITE.name, url: SITE.url, logo: `${SITE.url}/logo.svg`,
      description: 'Maths for Class 8, 9 and 10 (CBSE and ICSE): notes, practice, tests and classes.', sameAs: [SITE.telegram, SITE.youtube] },
    { '@type': 'WebSite', '@id': `${SITE.url}/#site`, name: SITE.name, url: SITE.url, inLanguage: 'en-IN', publisher: { '@id': `${SITE.url}/#org` } },
  ],
};

const Brand = () => (<Link className="brand" href="/"><img className="logo" src="/logo.svg" alt="" width="34" height="34" />{SITE.name}</Link>);

export default function RootLayout({ children }) {
  const classes = Object.entries(CLASSES);
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <header className="site-header"><div className="wrap bar">
          <Brand />
          <NavMenu items={NAV} />
          <Link className="btn btn-sm btn-sun head-demo" href="/demo">Free Demo</Link>
          <AccountButton />
        </div></header>
        <main>{children}</main>
        <JsonLd data={ORG} />
        <InstallApp />
        <Tracker />
        <footer className="site-footer">
          <div className="wrap foot-grid">
            <div>
              <Brand />
              <p>Class 8-10 Maths for CBSE and ICSE, taught in Hinglish, from basics to Olympiad.</p>
              {SITE.email && <p><a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>}
            </div>
            <div><h3>Classes</h3>
              {classes.map(([k, c]) => <Link key={k} href={`/${k}`}>{c.label}</Link>)}
              <Link href="/olympiad">Olympiad (SOF IMO)</Link>
            </div>
            <div><h3>Learn and practise</h3>
              <Link href="/self-study">Self Study</Link>
              <Link href="/recorded-lectures">Recorded Lectures</Link>
              <Link href="/live-courses">Live Courses</Link>
              <Link href="/practice">Practice Generator</Link>
              <Link href="/tests">Test Series</Link>
              <Link href="/sample-papers">Sample Papers</Link>
              <Link href="/doubts">Ask a Doubt</Link>
            </div>
            <div><h3>MathSetu</h3>
              <Link href="/about">About {SITE.name}</Link>
              <Link href="/blog">Blog and Exam News</Link>
              <Link href="/app">Get the App</Link>
              {PARENT_LOGIN && <Link href="/parent">Parent Dashboard</Link>}
              <Link href="/enquiry">Contact and enquiry</Link>
              <a href={SITE.telegram}>Telegram</a>
              <a href={SITE.youtube}>YouTube</a>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/copyright">Copyright and Disclaimer</Link>
            </div>
          </div>
          <div className="wrap copy">© {new Date().getFullYear()} {SITE.name}. An independent study resource, not affiliated with or endorsed by CBSE, CISCE, NCERT or any publisher. Board and book names are used only to identify the syllabus.</div>
        </footer>
      </body>
    </html>
  );
}
