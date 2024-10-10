const CACHE_NAME = 'video-cache-v1';
const urlsToCache = [
  // Lista de URLs de los videos que quieres cachear, por ejemplo:
  // '/videos/video1.mp4',
  // '/videos/video2.mp4'
  https://console.firebase.google.com/project/reproductor-b1420/storage/reproductor-b1420.appspot.com/files/~2Fvideos?hl=es-419
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
          // Verificar que la URL sea HTTP o HTTPS antes de cachear
          if (event.request.url.startsWith('http')) {
            cache.put(event.request, responseToCache);
          }
        });
        return response;
      });
    })
  );
});
