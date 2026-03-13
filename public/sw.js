// Minimal service worker for PWA installability
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Pass through all requests (no offline caching in Phase 1)
  event.respondWith(fetch(event.request));
});
