const CACHE_NAME = 'equip-socials-tracker-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logoFull.png',
  './icon.png',
  './browser.png',
  'https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;400;500;600;700;800&family=Georgia:wght@400;700&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
  'https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.log('Cache addAll error:', err))
  );
});

self.addEventListener('fetch', event => {
  // For Google Sheets CSVs, always go to network first (don't serve stale data)
  if (event.request.url.includes('docs.google.com')) {
    return fetch(event.request);
  }
  
  // For everything else, cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});