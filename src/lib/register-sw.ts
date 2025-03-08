export function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", function () {
    const swUrl = "/sw.js";

    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log(
          "ServiceWorker registration successful with scope:",
          registration.scope
        );

        // Check for updates on page load
        registration.update();

        // Set up periodic checks for updates
        setInterval(() => {
          registration.update();
          console.log("Checking for SW updates...");
        }, 1000 * 60 * 60); // Check every hour

        // Handle updates when found
        registration.addEventListener("updatefound", () => {
          const installingWorker = registration.installing;

          if (!installingWorker) return;

          installingWorker.addEventListener("statechange", () => {
            if (installingWorker.state === "installed") {
              if (navigator.serviceWorker.controller) {
                // New content is available; notify user
                console.log("New version available!");

                // You can choose to show a UI notification here
                if (
                  window.confirm("New version available! Reload to update?")
                ) {
                  window.location.reload();
                }
              } else {
                // First time install
                console.log("Content is cached for offline use.");
              }
            }
          });
        });
      })
      .catch((error) => {
        console.error("ServiceWorker registration failed:", error);
      });

    // Handle controller changes (new SW activated)
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      console.log("New service worker controller, refreshing page");
      window.location.reload();
    });
  });
}

// Helper function to send message to SW
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sendMessageToSW(message: any) {
  return new Promise((resolve, reject) => {
    if (!navigator.serviceWorker.controller) {
      reject(new Error("No active service worker"));
      return;
    }

    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      resolve(event.data);
    };

    navigator.serviceWorker.controller.postMessage(message, [
      messageChannel.port2,
    ]);
  });
}

// Call this function when you want to force update
export function forceSwUpdate() {
  if (!("serviceWorker" in navigator)) return;

  navigator.serviceWorker.getRegistration().then((registration) => {
    if (registration) {
      registration.update().then(() => {
        if (registration.waiting) {
          // Send skip-waiting message
          sendMessageToSW({ type: "SKIP_WAITING" });
        }
      });
    }
  });
}
