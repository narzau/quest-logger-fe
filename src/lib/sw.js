// src/app/lib/sw.js
const VERSION = "v" + new Date().getTime(); // Dynamic version based on build time
const CACHE_NAME = "adhd-quest-tracker-" + VERSION;
const urlsToCache = [
  "/",
  "/manifest.json",
  "/icons/icon-192x192.png",
  // Add other critical assets
];

self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Caching app shell");
      return cache.addAll(urlsToCache);
    })
  );
  // Force the waiting service worker to become active
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("[ServiceWorker] Removing old cache", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all clients/tabs immediately
        return self.clients.claim();
      })
  );
});

// Modify the fetch event to use a network-first strategy for HTML pages
self.addEventListener("fetch", (event) => {
  // Parse the URL
  const requestURL = new URL(event.request.url);

  // For HTML pages (navigation requests), use network-first strategy
  if (
    event.request.mode === "navigate" ||
    (event.request.method === "GET" &&
      event.request.headers.get("accept").includes("text/html"))
  ) {
    event.respondWith(
      fetch(event.request).catch((error) => {
        // Fall back to cache only if network fails
        return caches.match(event.request);
      })
    );
  } else {
    // For other assets, use cache-first strategy
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
