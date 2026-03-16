self.addEventListener('install', (event) => {
  console.log('Venga Mor PWA: Service Worker instalado.');
});

self.addEventListener('fetch', (event) => {
  // Pass-through simple para permitir el funcionamiento de la PWA
  event.respondWith(fetch(event.request));
});