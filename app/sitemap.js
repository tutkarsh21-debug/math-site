import { CLASSES, SITE } from '@/lib/data';
export default function sitemap() {
  const pages = ['', '/live-courses', '/recorded-lectures', '/self-study', '/olympiad', '/about', ...Object.keys(CLASSES).map(k => `/${k}`),
    ...Object.entries(CLASSES).flatMap(([k, c]) => c.chapters.map(ch => `/${k}/${ch.slug}`))];
  return pages.map(p => ({ url: SITE.url + p, lastModified: new Date() }));
}
