var cacheName = 'chess-clock-v1';
var filesToCache = [
  '/',
  '/app.html',
  '/service-worker.js',
  '/scripts/app.js',
  '/scripts/moment.min.js',
  '/styles/inline.css',
  '/styles/font-awesome.min.css',
  '/fonts/fontawesome-webfont.eot?v=4.7.0',
  '/fonts/fontawesome-webfont.svg?v=4.7.0',
  '/fonts/fontawesome-webfont.ttf?v=4.7.0',
  '/fonts/fontawesome-webfont.woff?v=4.7.0',
  '/fonts/fontawesome-webfont.woff2?v=4.7.0',
];

self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request)
  );
});

// self.addEventListener('activate', function (e) {
//   console.log('[ServiceWorker] Activate');
//   e.waitUntil(
//   );
//   /*
//    * Fixes a corner case in which the app wasn't returning the latest data.
//    * You can reproduce the corner case by commenting out the line below and
//    * then doing the following steps: 1) load app for first time so that the
//    * initial New York City data is shown 2) press the refresh button on the
//    * app 3) go offline 4) reload the app. You expect to see the newer NYC
//    * data, but you actually see the initial data. This happens because the
//    * service worker is not yet activated. The code below essentially lets
//    * you activate the service worker faster.
//    */
//   return self.clients.claim();
// });