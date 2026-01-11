const CACHE_NAME = 'preacher-v2.1-cache';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  './mary.png',
  './misa.png',
  './misa_annoyed.png',
  // Si usas FontAwesome desde CDN, el SW intentará cachearlo, 
  // pero para offline total idealmente deberías descargar el CSS/Webfonts localmente.
  // Por ahora, cacheamos lo local crítico.
];

// 1. Instalación: Guardar archivos en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Cacheando archivos de la app');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// 2. Activación: Limpiar cachés viejas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});

// 3. Fetch: Servir desde caché si no hay internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si está en caché, devolverlo. Si no, pedirlo a la red.
        return response || fetch(event.request);
      })
      .catch(() => {
        // Fallback simple si falla todo (opcional)
        // return caches.match('./index.html');
      })
  );
});