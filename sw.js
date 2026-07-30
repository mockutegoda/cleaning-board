/* Service worker for the cleaning board.

   The app has no server and no data to fetch: everything lives in IndexedDB
   on this iPad. All this does is keep a copy of the four app files so the
   board still opens with the wifi off.

   When you change index.html, bump CACHE_VERSION below. That is what tells
   every iPad to pick up the new version. */

const CACHE_VERSION = 'cleaning-board-v6';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names.filter((name) => name !== CACHE_VERSION).map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  /* Opening the app: try the network first, and only fall back to the stored
     copy when there is no network.

     This must not be cache-first. The page is small, the data lives in
     IndexedDB rather than in here, and an iPad that never re-checks for a new
     version is an iPad stuck on an old one forever. Offline still works: the
     fetch fails and the stored copy is served instead. */
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put('./index.html', copy));
          }
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  /* Everything else: cache first, since none of it ever changes without a
     new CACHE_VERSION. */
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response && response.ok && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
