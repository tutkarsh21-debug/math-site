import './globals.css';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import AccountButton from '@/components/AccountButton';
import InstallApp from '@/components/InstallApp';
import JsonLd from '@/components/JsonLd';
import { CLASSES, MODES, MORE, SITE } from '@/lib/data';

const poppins = Poppins({ subsets: ['latin', 'devanagari'], weight: ['400', '500', '600', '700'], variable: '--font', display: 'swap' });

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
export const viewport = { themeColor: [{ media: '(prefers-color-scheme: light)', color: '#1557d6' }, { media: '(prefers-color-scheme: dark)', color: '#0d1220' }] };

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
  // The Recorded Lectures link appears in the header only once the first video is uploaded.
  const videos = classes.some(([, c]) => c.chapters.some(ch => ch.youtube));
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <header className="site-header"><div className="wrap bar">
          <Brand />
          <nav className="nav">
            {MODES.filter(m => m.kind !== 'rec' || videos).map(m => <Link key={m.href} href={m.href}>{m.label}</Link>)}
            {MORE.map(m => <Link key={m.href} href={m.href}>{m.label}</Link>)}
          </nav>
          <Link className="btn btn-sm btn-sun head-demo" href="/demo">Book a Free Demo</Link>
          <AccountButton />
        </div></header>
        <main>{children}</main>
        <JsonLd data={ORG} />
        {/* On phones, the demo button stays at the bottom of the screen. Pages with the form itself hide it. */}
        <Link className="demo-bar" href="/demo">Book a free demo class</Link>
        <InstallApp />
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
              <Link href="/doubts">Ask a Doubt</Link>
              <Link href="/blog">Blog and Exam News</Link>
            </div>
            <div><h3>Connect</h3>
              <a href={SITE.telegram}>Telegram</a>
              <a href={SITE.youtube}>YouTube</a>
              <Link href="/demo">Book a Free Demo</Link>
              <Link href="/app">Get the App</Link>
              <Link href="/enquiry">Enquiry</Link>
              <Link href="/login">Login / Register</Link>
              <Link href="/about">About {SITE.name}</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/copyright">Copyright and Disclaimer</Link>
              {SITE.email && <a href={`mailto:${SITE.email}`}>Email us</a>}
            </div>
          </div>
          <div className="wrap copy">© {new Date().getFullYear()} {SITE.name}. An independent study resource, not affiliated with or endorsed by CBSE, CISCE, NCERT or any publisher. Board and book names are used only to identify the syllabus.</div>
        </footer>
      </body>
    </html>
  );
}
