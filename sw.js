var staticCacheName = 'thtodo-static-v4';

self.addEventListener('install', function(event) {
    // TODO: cache /skeleton rather than the root page

    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll([
                'index.html',
                'img/todo.png',
                'img/label.png',
                'img/textarea.png',
                'js/index.js',
                'css/index.css'
            ]);
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('thtodo-') && cacheName != staticCacheName;
                
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    // TODO: respond to requests for the root page with
    // the page skeleton from the cache
    event.respondWith(
        /*caches.match(event.request.url === (location.origin + "/") ? "/skeleton" :  event.request).then(function(response) {
            return response || fetch(event.request);
        })*/
        fetch(event.request)
    );
});

self.addEventListener('message', function(event) {
    if (event.data.action === 'skipWaiting') {
        //self.skipWaiting();
    }
});