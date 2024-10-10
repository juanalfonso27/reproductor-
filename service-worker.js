self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('video-cache').then((cache) => {
            return cache.addAll([
                '/path/to/video1.mp4',
                '/path/to/video2.mp4',
                // Agrega aquí las rutas de los videos que quieres cachear
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});


