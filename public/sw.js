// Minimal service worker: enables PWA installability.
// Network-first for everything; offline fallback message for navigations.
self.addEventListener("install", (e) => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(
        () =>
          new Response(
            "<!doctype html><meta charset='utf-8'><meta name='viewport' content='width=device-width'><body style='font-family:sans-serif;padding:2rem;text-align:center'><h2>SPeye is offline</h2><p>Scanning needs an internet connection. Reconnect and try again.</p></body>",
            { headers: { "Content-Type": "text/html" } }
          )
      )
    );
  }
});
