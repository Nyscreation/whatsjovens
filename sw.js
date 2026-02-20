const CACHE_NAME = 'jovem-app-v1';

// Arquivos base que o app precisa para abrir mesmo sem internet
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png'
];

// Instalando o Service Worker e salvando no Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Ativando e limpando caches antigos (útil quando você atualiza o app)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptando requisições (Estratégia: Tenta a Rede primeiro, se falhar/offline, usa o Cache)
self.addEventListener('fetch', event => {
  // Ignora requisições do Firebase/Firestore para não dar conflito no banco de dados
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});