"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/register-sw";

export default function ServiceWorkerInit() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // This component doesn't render anything
  return null;
}
