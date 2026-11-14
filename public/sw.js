const CACHE_NAME = 'see-you-v1';

const STATIC_ASSETS = [
  '/see-you/',
  '/see-you/index.html',
  '/see-you/favicon.ico',
  '/see-you/manifest.webmanifest',
  '/see-you/assets/textures/paper-grain.png',
  '/see-you/assets/botanical/flower-a.svg',
  '/see-you/assets/botanical/flower-b.svg',
  '/see-you/assets/icons/logo-komnas.svg',
  '/see-you/assets/images/buket carnation.webp',
  '/see-you/assets/images/buket matahari.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
