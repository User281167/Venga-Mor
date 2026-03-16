// Service Worker básico para permitir la instalación PWA
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Estrategia de red primero para no interferir con el dinamismo de la app
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});