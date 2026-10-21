// Cao Xiaochun Studio - Offline PWA Service Worker
const CACHE_NAME = 'cxc-studio-v1';

// Essential core shell & artwork assets to pre-cache
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/assets/aistudio/a3afa24fcf5bcde2a9d8437ee976526e_db58066f.webp',
  '/assets/aistudio/2180acf6d535c82ad8f3c805385a9c17_0e53c795.webp',
  '/assets/aistudio/0897540fa7d1886b5f23169c2c5eee71_fcae3607.webp',
  '/assets/aistudio/98f7b3a8ddaca560d08e34f62169968c_d96c2ef0.webp',
  '/assets/aistudio/feacc5b24104e4dd5d51fffc416d2dd9_6f8399f6.webp',
  '/assets/aistudio/0f507a6316ee6b0fbd2d466235fb34f5_9e49f0c5.webp',
  '/assets/aistudio/4046cdf36983738cca6f4c9f498feedf_0df4b790.webp',
  '/assets/aistudio/mmexport1792561871077_234d13c6.webp',
  '/assets/aistudio/mmexport1792561867440_26f21078.webp',
  '/assets/cao_xiaochun_signature.png'
];

// Install: pre-cache critical assets into CacheStorage
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('ServiceWorker pre-cache partial warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up old version caches and take control
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
    }).then(() => self.clients.claim())
  );
});

// Fetch strategy:
// 1. Static image/font/script assets -> Cache-First (Lightning instant load from flash storage)
// 2. Navigation / HTML -> Stale-While-Revalidate (Instant presentation + background update)
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle GET requests within same-origin
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Static images and built bundle assets (Cache First)
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // HTML Navigation (Stale While Revalidate / Cache Fallback)
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline or timeout, fall back to cached HTML
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // Default fallback for other local resources
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
