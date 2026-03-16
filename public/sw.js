// Service Worker básico para permitir la instalación PWA
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // En este prototipo, simplemente pasamos las peticiones a la red
  event.respondWith(fetch(event.request));
});