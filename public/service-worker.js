const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/styles.css",
    "/index.js",
    "/manifest.webmanifest",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

self.addEventListener("install", (evt) => {
    evt.waitUntil(
        cache.open(CACHE_NAME).then(cache => {
            console.log("Your files were pre-cached successfully")
            return cache.addAll(FILES_TO_CACHE);
        })
    )
    self.skipWaiting();
});

self.addEventListener("activate", (evt) => {
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if(key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("Removing old cache data", key);
                        return caches.delete(key)
                    }
                })
            )
        })
    )
    self.ClientRectList.claim()
});

self.addEventListener("fetch", function(evt) {
    if (evt.request.url.includes("/")) {
      evt.respondWith(
          caches.open(CACHE_NAME).then(cache => {
            return cache.match(evt.request).then(response => {
              return response || fetch(evt.request);
            });
          })
        );
    }
    return Response
})