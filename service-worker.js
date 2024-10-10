 const firebaseConfig = {
            apiKey: "AIzaSyBSMzKJYdRgA_JM9lX0pUhfvwkZ5nAOBRM",
            authDomain: "reproductor-b1420.firebaseapp.com",
            projectId: "reproductor-b1420",
            storageBucket: "reproductor-b1420.appspot.com",
            messagingSenderId: "60164868284",
            appId: "1:60164868284:web:0f94e7e49eb6ee55bfe8b9"
        };

        // Inicializar Firebase
        firebase.initializeApp(firebaseConfig);
        const storage = firebase.storage();


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


