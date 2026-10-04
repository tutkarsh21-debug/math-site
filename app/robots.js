import { SITE } from '@/lib/data';
export default function robots() { return { rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/', '/account'] }, sitemap: `${SITE.url}/sitemap.xml` }; }
