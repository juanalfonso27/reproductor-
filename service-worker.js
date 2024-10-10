const CACHE_NAME = 'video-cache-v1';
const urlsToCache = [
  'https://console.firebase.google.com/project/reproductor-b1420/storage/reproductor-b1420.appspot.com/files/~2Fvideos?hl=es-419',
  '/videos/video2.mp4',
  '/videos/video3.mp4',
  '/videos/video4.mp4'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response; // Si el archivo está en caché, úsalo.
        }
        return fetch(event.request); // Si no está en caché, descárgalo.
      })
  );
});
