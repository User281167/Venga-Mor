// Service Worker básico para permitir la instalación de la PWA
self.addEventListener('install', (event) => {
  console.log('Venga Mor SW: Instalado');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Venga Mor SW: Activo');
});

self.addEventListener('fetch', (event) => {
  // Estrategia simple de red para asegurar contenido actualizado
  event.respondWith(fetch(event.request));
});