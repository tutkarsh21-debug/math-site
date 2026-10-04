import { SITE } from '@/lib/data';

// Structured data (schema.org) for search engines. It is not shown on the page.
export default function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

// The trail of a page, from the home page down. items: [[name, path], ...]
export const breadcrumbs = items => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [['Home', '/'], ...items].map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE.url + p })),
});
