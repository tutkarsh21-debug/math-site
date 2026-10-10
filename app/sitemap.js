import { FREE_DEMO } from '@/lib/flags';
import { CLASSES, SITE } from '@/lib/data';
import { POSTS } from '@/lib/posts';
import TESTS from '@/lib/tests.json';
export default function sitemap() {
  const pages = ['', '/live-courses', '/recorded-lectures', '/self-study', '/tests', '/start', '/practice', '/one-to-one', '/sample-papers', '/doubts', '/blog', ...(FREE_DEMO ? ['/demo'] : []), '/app', '/enquiry', '/privacy', '/copyright', '/olympiad', '/about', ...Object.keys(CLASSES).map(k => `/${k}`),
    ...Object.entries(CLASSES).flatMap(([k, c]) => c.chapters.map(ch => `/${k}/${ch.slug}`)),
    ...POSTS.map(p => `/blog/${p.slug}`), ...Object.keys(TESTS).map(id => `/tests/${id}`)];
  return pages.map(p => ({ url: SITE.url + p, lastModified: new Date() }));
}
