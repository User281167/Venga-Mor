self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Estrategia Network Only para asegurar que el contenido esté siempre actualizado
  event.respondWith(fetch(event.request));
});
