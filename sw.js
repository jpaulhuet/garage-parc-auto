
const CACHE = "garage-parc-auto-v1";

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll(["./", "./index.html"])
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  if (new URL(event.request.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request)
    )
  );
});

self.addEventListener("push", event => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data?.text() || "" };
  }

  event.waitUntil(
    self.registration.showNotification(
      data.title || "GARAGE PARC AUTO",
      {
        body: data.body || "Une échéance nécessite votre attention.",
        tag: "garage-alerte"
      }
    )
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(self.registration.scope));
});
