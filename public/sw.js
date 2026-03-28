const CACHE_NAME = 'anobiblico-cache-v1';
const BIBLE_API_URL = 'https://bolls.life';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(['/']);
        })
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Cache Bible API requests
    if (url.origin === BIBLE_API_URL) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(request).then((response) => {
                    return (
                        response ||
                        fetch(request).then((fetchResponse) => {
                            cache.put(request, fetchResponse.clone());
                            return fetchResponse;
                        })
                    );
                });
            })
        );
    } else {
        // Stale-while-revalidate for local assets
        event.respondWith(
            caches.match(request).then((response) => {
                return response || fetch(request);
            })
        );
    }
});
