const CACHE_NAME = 'video-cache';
const MAX_CACHE_SIZE = 9;  // Define un límite de videos en caché

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        if (response) {
          return response;
        } else {
          return fetch(event.request).then(networkResponse => {
            return cache.put(event.request, networkResponse.clone()).then(() => {
              return cache.keys().then(keys => {
                if (keys.length > MAX_CACHE_SIZE) {
                  // Elimina el video más antiguo en el caché
                  cache.delete(keys[0]);
                }
                return networkResponse;
              });
            });
          });
        }
      });
    })
  );
});


