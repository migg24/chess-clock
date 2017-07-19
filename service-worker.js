var cacheName = 'chess-clock-v1';
var filesToCache = [
  'index.html',
  'service-worker.js',
  'scripts/app.js',
  'scripts/moment.min.js',
  'styles/inline.css',
  'styles/font-awesome.min.css',
  'fonts/fontawesome-webfont.eot?v=4.7.0',
  'fonts/fontawesome-webfont.svg?v=4.7.0',
  'fonts/fontawesome-webfont.ttf?v=4.7.0',
  'fonts/fontawesome-webfont.woff?v=4.7.0',
  'fonts/fontawesome-webfont.woff2?v=4.7.0',
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request)
  );
});