// Service worker for the installed app. It is deliberately small: every page is always fetched fresh from the
// network, so students never see an old copy. Its only job is to show a friendly page when there is no internet.
const CACHE = 'mathsetu-offline-v1', OFFLINE = '/offline.html';

self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.add(OFFLINE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  // Only whole-page loads are handled; everything else goes straight to the network as usual.
  if (e.request.mode !== 'navigate') return;
  e.respondWith(fetch(e.request).catch(() => caches.match(OFFLINE)));
});
