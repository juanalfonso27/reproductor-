const CACHE_NAME = 'video-cache-v1';
const urlsToCache = [
https://firebasestorage.googleapis.com/v0/b/reproductor-b1420.appspot.com/o/videos%2FIASA%20-%20RESUMEN%20INNOVAR%202024%20FINAL%20ALTA%20PT.3.mp4?alt=media&token=dc8a8840-d56b-4f78-8469-56f3e1f88d0f
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          if (event.request.url.startsWith('http')) {
            cache.put(event.request, responseToCache);
          }
        });
        return response;
      });
    })
  );
});

