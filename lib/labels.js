// Readable names for the addresses the dashboards list: '/class-10/real-numbers' becomes 'Real Numbers (Class 10 CBSE)'.
// Server only: the dashboard code turns addresses into names before sending them to the browser.
import { CLASSES } from '@/lib/data';

const PAGES = {
  '/': 'Home page', '/practice': 'Practice Test Generator', '/tests': 'Test Series', '/olympiad': 'Olympiad', '/start': 'Start here',
  '/self-study': 'Self Study', '/recorded-lectures': 'Recorded Lectures', '/live-courses': 'Live Courses', '/demo': 'Free demo page',
  '/sample-papers': 'Sample Papers', '/doubts': 'Ask a Doubt', '/blog': 'Blog', '/about': 'About', '/app': 'App page', '/enquiry': 'Enquiry',
};
const PDF_KIND = { notes: 'Short Notes', formulas: 'Formula Bank', dpp: 'DPP Sheet', pyq: 'PYQ questions', 'pyq-solutions': 'PYQ solutions', ncert: 'NCERT Solutions', paper: 'Sample paper', 'paper-solutions': 'Sample paper solutions' };

const chapter = (cls, slug) => {
  const c = CLASSES[cls], ch = c?.chapters.find(x => x.slug === slug);
  return ch ? `${ch.title} (${c.label} ${ch.boards[0]})` : '';
};
// The name of a chapter from an id such as 'class-10/real-numbers'. Falls back to the id itself.
export const chapterName = id => { const [cls, slug] = String(id).split('/'); return chapter(cls, slug) || id; };

// kind: 'view' or 'pdf'. Returns { label, group } where group tells what sort of content it is.
export function describe(kind, path) {
  const p = String(path);
  if (kind === 'pdf') {
    const m = p.match(/^\/pdf\/(class-\d+)\/([^/]+)\/([^/]+)\.pdf$/);
    if (m) return { group: 'PDF', label: `${PDF_KIND[m[3]] || m[3]}: ${chapter(m[1], m[2]) || m[2]}` };
    return { group: 'PDF', label: p };
  }
  if (PAGES[p]) return { group: 'Page', label: PAGES[p] };
  let m = p.match(/^\/(class-\d+)$/);
  if (m) return { group: 'Class page', label: `${CLASSES[m[1]]?.label || m[1]} chapter list` };
  m = p.match(/^\/(class-\d+)\/([^/]+)$/);
  if (m) return { group: 'Chapter', label: chapter(m[1], m[2]) || p };
  m = p.match(/^\/tests\/(class-\d+)\/([^/]+)$/);
  if (m) return { group: 'Chapter test', label: `Test: ${chapter(m[1], m[2]) || m[2]}` };
  m = p.match(/^\/blog\/(.+)$/);
  if (m) return { group: 'Blog', label: `Blog: ${m[1].replace(/-/g, ' ')}` };
  return { group: 'Page', label: p };
}
