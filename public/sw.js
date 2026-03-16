self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalado');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activado');
});

self.addEventListener('fetch', (event) => {
  // Necesario para cumplir con los requisitos de PWA instalable
});