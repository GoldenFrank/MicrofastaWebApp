// public/sw.js
const CACHE_NAME = 'logbook-loan-compass-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  // Placeholder for actual icons if they were added.
  // If you added specific icon paths to your project, list them here.
  // e.g., '/icons/icon-72x72.png',
  // Consider adding main CSS and JS bundles once their paths are stable.
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache opened successfully:', CACHE_NAME);
        return cache.addAll(urlsToCache)
          .then(() => {
            console.log('Service Worker: All urlsToCache successfully added to cache.');
          })
          .catch(addAllError => {
            console.error('Service Worker: Failed to addAll urlsToCache. URLs:', urlsToCache, 'Error:', addAllError);
            // Do not re-throw here for now to prevent [object Event] if addAllError is an Event.
          });
      })
      .catch(openCacheError => {
        console.error('Service Worker: Failed to open cache. Name:', CACHE_NAME, 'Error:', openCacheError);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
      .catch(fetchError => {
        console.error('Service Worker: Error in fetch handler for:', event.request.url, fetchError);
        // Potentially return a fallback page or response here
        // For now, rethrow to let the browser handle the network error.
        throw fetchError;
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
