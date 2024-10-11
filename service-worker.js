const CACHE_NAME = 'video-cache-v1';

// Escuchar eventos de instalación y activar el Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker instalado');
});

self.addEventListener('activate', event => {
    console.log('Service Worker activado');
});

// Escuchar mensajes enviados desde la página
self.addEventListener('message', event => {
    if (event.data.action === 'cacheVideo' && event.data.url) {
        cacheVideo(event.data.url);
    }
});

// Función para cachear videos
async function cacheVideo(videoUrl) {
    try {
        const cache = await caches.open(CACHE_NAME);
        await cache.add(videoUrl);
        console.log(`Video cacheado exitosamente: ${videoUrl}`);
    } catch (error) {
        console.error('Error al cachear el video:', error);
    }
}

// Interceptar peticiones y servir desde el cache
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                // Si hay una respuesta en cache, usarla
                return cachedResponse;
            }
            // Si no, hacer la solicitud de red y almacenarla en cache si es un video
            return fetch(event.request).then(response => {
                const requestUrl = new URL(event.request.url);
                if (requestUrl.pathname.startsWith('/videos/')) {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                }
                return response;
            });
        })
    );
});
