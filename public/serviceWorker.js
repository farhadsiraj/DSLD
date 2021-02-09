let DSLD_CACHE = 'DSLD';
const urlsToCache = ['/', '/index.html'];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(DSLD_CACHE).then(function (cache) {
      console.log('The gym cache is open.');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', function (event) {
  event.respondWith(caches.match(event.request)).then(function (response) {
    if (response) {
      return response;
    }
    return fetch(event.request);
  });
});
