// Escuchar mensajes del cliente para cachear videos
self.addEventListener('message', event => {
    if (event.data.action === 'cacheVideo') {
        cacheVideo(event.data.url);
    }
});

// Función para cachear un video
async function cacheVideo(videoUrl) {
    try {
        const cache = await caches.open('video-cache');
        const response = await fetch(videoUrl, { mode: 'cors' }); // Habilitar CORS

        // Validar si la respuesta es correcta y es un video
        if (response.ok && response.headers.get('content-type').includes('video')) {
            await cache.put(videoUrl, response.clone());  // Clonar la respuesta para usarla luego
            console.log(`Video cacheado exitosamente: ${videoUrl}`);
            // Limitar el tamaño de la caché a 10 elementos
            limitCacheSize('video-cache', 10);
        } else {
            console.error('Error al obtener el video o la respuesta no es un video:', response.status);
        }
    } catch (error) {
        console.error('Error al cachear el video:', error);
    }
}

// Evento fetch para interceptar las solicitudes de video y usar la caché
self.addEventListener('fetch', event => {
    if (event.request.url.includes('/videos/')) {  // Asegurarse de que sea una URL de video
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;  // Servir desde la caché
                }
                // Si no está en caché, hacer una solicitud de red y cachearla
                return fetch(event.request).then(networkResponse => {
                    return caches.open('video-cache').then(cache => {
                        cache.put(event.request.url, networkResponse.clone());  // Cachear el video
                        return networkResponse;  // Servir el video de la red
                    });
                });
            })
        );
    }
});

