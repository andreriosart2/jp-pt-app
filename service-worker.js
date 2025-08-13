// service-worker.js - fornece capacidades offline básicas

const CACHE_NAME = 'jp-pt-cache-v1';
const ASSETS = [
  '/',
  'index.html',
  'app.js',
  'content.json',
  'manifest.json'
];

// Durante a instalação, faz cache dos ativos essenciais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Intercepta pedidos e serve do cache se disponível
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
