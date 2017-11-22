var CACHE_VERSION = 10;
var CACHE_NAME = 'thtodo-v'+CACHE_VERSION;
var OFFLINE_URL = '';

self.addEventListener('install', function(event) {
    // TODO: cache /skeleton rather than the root page

    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll([
                '/',
                'img/todo.png',
                'img/label.png',
                'img/add.png',
                'img/clear.png',
                'img/textarea.png',
                'img/lowpriority.png',
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
                    return /*cacheName.startsWith('thtodo-v') &&*/ cacheName != CACHE_NAME;
                
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    if ( event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request).then(function(response) {
                return response || fetch(event.request).then(function(fetch_resp){
                    console.log(fetch_resp.url);
                    return fetch_resp;
                });
            })
        );
    }
});

self.addEventListener('message', function(event) {
    if (event.data.actionsw === 'SKIPWAITING') {
        self.skipWaiting().then(function(t) {

            console.log("pulou a atualizacao", t);
        });
    }
});