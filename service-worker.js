

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('video-cache').then((cache) => {
            const storageRef = firebase.storage().ref();
            const videoNames = ['video1.mp4', 'video2.mp4']; // Lista de nombres de videos

            const urlPromises = videoNames.map((videoName) => {
                return storageRef.child(`videos/${videoName}`).getDownloadURL();
            });

            return Promise.all(urlPromises).then((urls) => {
                return cache.addAll(urls);
            }).catch((error) => {
                console.error('Error al obtener las URLs de los videos:', error);
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


