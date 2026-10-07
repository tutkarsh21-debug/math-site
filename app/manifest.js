import { SITE } from '@/lib/data';

// Lets a phone install the site as an app: its name, icon, colours and the page it opens on.
export default function manifest() {
  return {
    name: `${SITE.name}: Class 8-10 Maths`, short_name: SITE.name,
    description: 'Maths notes, formula sheets, practice and chapter tests for Class 8, 9 and 10 (CBSE and ICSE).',
    id: '/', start_url: '/', scope: '/', display: 'standalone', orientation: 'portrait',
    background_color: '#ffffff', theme_color: '#f15d22', lang: 'en-IN', categories: ['education'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Test Series', url: '/tests' },
      { name: 'Ask a Doubt', url: '/doubts' },
      { name: 'Self Study', url: '/self-study' },
    ],
  };
}
