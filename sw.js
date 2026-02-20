const CACHE_NAME = 'jovem-app-v2-svg';

// Arquivos base para o app funcionar offline.
// REMOVEMOS OS PNGs DAQUI POIS AGORA SÃO CÓDIGO EMBUTIDO.
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
  // Adicione style.css aqui se você criou um arquivo separado para ele
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.error('Erro no cache:', err))
  );
});

self.addEventListener('activate', event => {
  self.clients.claim();
  // Limpa caches antigos para garantir que a nova versão seja carregada
  event.waitUntil(
      caches.keys().then(keys => Promise.all(
          keys.map(key => {
              if (key !== CACHE_NAME) {
                  return caches.delete(key);
              }
          })
      ))
  );
});

self.addEventListener('fetch', event => {
  // Estratégia: Network First, depois Cache (para garantir dados frescos do Firebase)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});
