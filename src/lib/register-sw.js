export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("ServiceWorker registration successful");

          // Check for updates periodically
          setInterval(() => {
            registration.update();
            console.log("Checking for SW updates");
          }, 60 * 60 * 1000); // Check every hour

          // Handle updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;

            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New version available
                if (confirm("A new version is available. Reload to update?")) {
                  window.location.reload();
                }
              }
            });
          });
        })
        .catch((error) => {
          console.error("ServiceWorker registration failed:", error);
        });

      // Detect controller change (new SW took over)
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("New service worker controller");
      });
    });
  }
}
