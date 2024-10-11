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
    }
});
