import './globals.css';
import Link from 'next/link';
import { SITE } from '@/lib/data';

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | Class 8-10 Maths in Hindi + English`, template: `%s | ${SITE.name}` },
  description: 'Class 8-10 Maths for CBSE and ICSE in Hindi + English: video lessons, notes, practice and Olympiad prep.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header><div className="wrap"><nav>
          <Link className="brand" href="/">{SITE.name}</Link>
          <Link href="/class-8">Class 8</Link><Link href="/class-9">Class 9</Link>
          <Link href="/class-10">Class 10</Link><Link href="/olympiad">Olympiad</Link>
          <Link href="/about">About</Link>
        </nav></div></header>
        <main className="wrap">{children}</main>
        <footer><div className="wrap">© {new Date().getFullYear()} {SITE.name} · <a href={SITE.telegram}>Telegram</a> · <a href={SITE.youtube}>YouTube</a></div></footer>
      </body>
    </html>
  );
}
