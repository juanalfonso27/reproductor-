const CACHE_NAME = 'video-cache-v1';
const urlsToCache = [
gs://reproductor-b1420.appspot.com/videos
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

