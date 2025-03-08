// Use build timestamp for versioning
const VERSION = "v" + (self.TIMESTAMP || new Date().getTime());
const CACHE_NAME = "adhd-quest-tracker-" + VERSION;

// Assets to cache on install
const urlsToCache = [
  "/",
  "/manifest.json",
  "/icons/icon-192x192.png",
  // Add other critical assets
];

self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install", VERSION);
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
  console.log("[ServiceWorker] Activate", VERSION);
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName.startsWith("adhd-quest-tracker-") &&
              cacheName !== CACHE_NAME
            ) {
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

// Use a network-first strategy for navigation and HTML requests
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  // Special handling for navigation requests and HTML files
  const isNavigationOrHTML =
    event.request.mode === "navigate" ||
    (event.request.headers.get("accept") &&
      event.request.headers.get("accept").includes("text/html"));

  if (isNavigationOrHTML) {
    // Network-first strategy for navigation/HTML
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response to store in cache
          const responseToCache = response.clone();

          caches
            .open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            })
            .catch((err) => console.error("Cache put error:", err));

          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(event.request);
        })
    );
  } else {
    // Cache-first strategy for other assets (images, scripts, etc.)
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached response, but also update cache in background
          fetch(event.request)
            .then((networkResponse) => {
              caches
                .open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, networkResponse);
                })
                .catch((err) =>
                  console.error("Background cache update error:", err)
                );
            })
            .catch(() => {});

          return cachedResponse;
        }

        // If not in cache, fetch from network
        return fetch(event.request).then((response) => {
          // Clone the response to store in cache
          const responseToCache = response.clone();

          caches
            .open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            })
            .catch((err) => console.error("Cache put error:", err));

          return response;
        });
      })
    );
  }
});

// Handle messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
