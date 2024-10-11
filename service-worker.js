self.addEventListener('message', event => {
    if (event.data.action === 'cacheVideo') {
        cacheVideo(event.data.url);
    }
});

async function cacheVideo(videoUrl) {
    try {
        const cache = await caches.open('video-cache');
        const response = await fetch(videoUrl, { mode: 'cors' }); // Habilitar CORS
        if (response.ok) {
            await cache.put(videoUrl, response);
            console.log(`Video cacheado exitosamente: ${videoUrl}`);
        } else {
            console.error('Error al obtener el video:', response.status);
        }
    } catch (error) {
        console.error('Error al cachear el video:', error);
    }
}
