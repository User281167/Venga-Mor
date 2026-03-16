// Service Worker básico para permitir la instalación PWA
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // No cachear nada por ahora para evitar problemas de desarrollo, 
  // solo necesario para que el navegador lo detecte como PWA
  return;
});
