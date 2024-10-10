

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('video-cache').then((cache) => {
            const storageRef = firebase.storage().ref('videos'); // Referencia al directorio de videos

            // Obtener la lista de archivos en el directorio de videos
            return storageRef.listAll().then((result) => {
                const urlPromises = result.items.map((itemRef) => {
                    return itemRef.getDownloadURL().catch((error) => {
                        console.error(`Error al obtener la URL de ${itemRef.name}:`, error);
                    });
                });

                return Promise.all(urlPromises).then((urls) => {
                    // Filtrar URLs undefined
                    const validUrls = urls.filter(url => url !== undefined);
                    return cache.addAll(validUrls);
                });
            }).catch((error) => {
                console.error('Error al listar los archivos:', error);
            });
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
