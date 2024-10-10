    <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-storage-compat.js"></script>

        // Configuración de Firebase
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
