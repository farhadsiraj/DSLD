let DSLD_CACHE = 'DSLD';
const urlsToCache = ['/', '/index.html'];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(DSLD_CACHE).then(function (cache) {
      console.log('The gym cache is open.');
      return cache.addAll(urlsToCache);
    })
  );
});
