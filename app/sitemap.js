import { FREE_DEMO } from '@/lib/flags';
import { CLASSES, SITE } from '@/lib/data';
import { POSTS } from '@/lib/posts';
import { OLY_TOPICS } from '@/lib/olympiad';
import TESTS from '@/lib/tests.json';
export default function sitemap() {
  const pages = ['', '/live-courses', '/recorded-lectures', '/self-study', '/tests', '/start', '/practice', '/one-to-one', '/studio', '/studio/live', '/studio/recorded', '/sample-papers', '/doubts', '/blog', ...(FREE_DEMO ? ['/demo'] : []), '/app', '/enquiry', '/privacy', '/copyright', '/olympiad', '/about', ...Object.keys(CLASSES).map(k => `/${k}`),
    ...Object.entries(CLASSES).flatMap(([k, c]) => c.chapters.map(ch => `/${k}/${ch.slug}`)),
    ...OLY_TOPICS.map(t => `/olympiad/${t.slug}`),
    ...Object.keys(TESTS).map(id => `/tests/${id}`)];
  return [...pages.map(p => ({ url: SITE.url + p })), ...POSTS.map(p => ({ url: `${SITE.url}/blog/${p.slug}`, lastModified: new Date(p.date) }))];
}
