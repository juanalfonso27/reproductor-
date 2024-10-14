// Nombre de la base de datos y la versión
const DB_NAME = 'videoDB';
const DB_VERSION = 1;
const STORE_NAME = 'videos';

// Función para abrir o crear la base de datos en IndexedDB
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            // Crea el almacén de videos si no existe
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'url' });
            }
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

// Función para guardar un video en IndexedDB
function saveVideo(url, videoBlob) {
    openDB().then((db) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put({ url: url, videoBlob: videoBlob });
        return tx.complete;
    }).catch((error) => {
        console.error('Error al guardar video en IndexedDB:', error);
    });
}

// Función para obtener un video desde IndexedDB
function getVideoFromDB(url) {
    return openDB().then((db) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        return store.get(url);
    });
}

// Intercepta las solicitudes de los videos
self.addEventListener('fetch', (event) => {
    const url = event.request.url;
    if (url.endsWith('.mp4') || url.endsWith('.mov')) {
        event.respondWith(
            getVideoFromDB(url).then((cachedVideo) => {
                if (cachedVideo) {
                    // Si el video ya está cacheado, devuélvelo
                    return new Response(cachedVideo.videoBlob);
                } else {
                    // Si no está en cache, busca el video, guárdalo en IndexedDB y luego respóndelo
                    return fetch(event.request).then((response) => {
                        return response.blob().then((videoBlob) => {
                            saveVideo(url, videoBlob);
                            return new Response(videoBlob);
                        });
                    });
                }
            })
        );
    }
});

