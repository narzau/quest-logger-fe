"use client";

import { useEffect } from "react";
import { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered successfully:",
            registration.scope
          );

          // Optional: Handle service worker updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            console.log("Service Worker update found");

            newWorker?.addEventListener("statechange", () => {
              if (newWorker.state === "installed") {
                console.log("Service Worker updated");
              }
            });
          });
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  return <>{children}</>;
}
