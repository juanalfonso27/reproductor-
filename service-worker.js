const CACHE_NAME = 'video-cache-v1';
const urlsToCache = [
    // Aquí puedes agregar rutas estáticas si es necesario
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Archivos cacheados');
                return cache.addAll(urlsToCache);
            })
    );
// Escuchar eventos de instalación y activar el Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker instalado');
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eliminando caché antigua', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
self.addEventListener('activate', event => {
    console.log('Service Worker activado');
});

// Interceptar solicitudes de red para verificar si están cacheadas
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response; // Si está en caché, devuelve la respuesta cacheada
                }
                return fetch(event.request); // Si no, realiza la solicitud de red
            })
    );
// Escuchar mensajes enviados desde la página
self.addEventListener('message', event => {
    if (event.data.action === 'cacheVideo' && event.data.url) {
        cacheVideo(event.data.url);
    }
});

// Escuchar mensajes del script principal (por ejemplo, para cachear videos subidos)
self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'cacheVideo') {
        const videoUrl = event.data.url;
        caches.open(CACHE_NAME).then((cache) => {
            cache.add(videoUrl).then(() => {
                console.log(`Video cacheado: ${videoUrl}`);
            });
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
