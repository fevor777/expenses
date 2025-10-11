/**
 * Custom Service Worker to support showing budget summary notifications and handling clicks
 * even when the Angular app tab is closed.
 */
const CACHE_VERSION = 'v1';
const PRECACHE = `expenses-precache-${CACHE_VERSION}`;
const RUNTIME = `expenses-runtime-${CACHE_VERSION}`;
// Core files to precache (minimal shell). Use relative paths so they work under /expenses/ and Android asset scheme.
const PRECACHE_URLS = [
  './', // index.html (base href relative)
  './index.html',
  './manifest.webmanifest',
  './favicon2.ico',
  // main bundles (keep minimal: styles + main; polyfills will be imported by main if needed)
  // We don't know hashed names ahead of time; a light strategy: cache first navigation then rely on runtime caching.
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(PRECACHE);
      await cache.addAll(PRECACHE_URLS);
    } catch (e) {
      // ignore precache errors
    }
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Clean old caches
    try {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter(k => ![PRECACHE, RUNTIME].includes(k))
          .map(k => caches.delete(k))
      );
    } catch {}
    await self.clients.claim();
  })());
});

// Handle explicit messages from the page to show a notification
self.addEventListener('message', async (event) => {
  const data = event.data;
  if (!data || !data.type) return;
  if (data.type === 'SHOW_BUDGET_NOTIFICATION') {
    const { title, body, tag } = data.payload || {};
    try {
      await self.registration.showNotification(title || 'Сводка расходов', {
        body: body || '',
        tag: tag || 'app-expenses-budget-summary',
        icon: 'favicon2.ico', // relative path works in GH Pages /expenses/ and preview
        badge: 'favicon2.ico',
        data: { route: '#/br-notification-redirect' }
      });
    } catch (e) {
      // ignore
    }
  } else if (data.type === 'CLEAR_NOTIFICATIONS') {
    const { tag } = data.payload || {};
    try {
      const notifications = await self.registration.getNotifications(tag ? { tag } : undefined);
      for (const n of notifications) {
        n.close();
      }
    } catch (e) {
      // ignore
    }
  }
});

self.addEventListener('notificationclick', (event) => {
  const routeHash = event.notification.data?.route || '#/';
  event.notification.close();
  event.waitUntil((async () => {
    const base = self.location.origin + '/expenses/';
    const fullUrl = base + routeHash;
    const clientList = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clientList) {
      if (client.url.startsWith(base)) {
        await client.focus();
        try { client.postMessage({ type: 'NAVIGATE_HASH', hash: routeHash }); } catch {}
        return;
      }
    }
    await clients.openWindow(fullUrl);
  })());
});

// Offline fallback response (loaded from precache)
async function offlineFallback(request) {
  // Only for navigation requests
  if (request.mode === 'navigate') {
    const cache = await caches.open(PRECACHE);
    const offlinePage = await cache.match('./offline.html');
    if (offlinePage) return offlinePage;
  }
  return new Response('Offline', { status: 503, statusText: 'Offline' });
}

// Runtime caching: HTML navigations (network-first with offline fallback), static assets (cache-first), other (network-first)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  // Ignore non-GET & service worker itself
  if (request.method !== 'GET') return;

  // Navigation requests: network first, fallback to cache/offline
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        // Optionally update precache for index.html
        const cache = await caches.open(PRECACHE);
        cache.put('./index.html', response.clone());
        return response;
      } catch {
        // Try cached index.html then offline page
        const cache = await caches.open(PRECACHE);
        const cached = await cache.match('./index.html');
        if (cached) return cached;
        return offlineFallback(request);
      }
    })());
    return;
  }

  // Static assets under our scope (fonts/images/css/js): cache-first
  if (url.origin === self.location.origin) {
    const isAsset = /\.(?:js|css|png|jpg|jpeg|gif|webp|svg|ico|ttf|woff2?)$/i.test(url.pathname);
    if (isAsset) {
      event.respondWith((async () => {
        const cache = await caches.open(RUNTIME);
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          cache.put(request, response.clone());
          return response;
        } catch {
          return cached || offlineFallback(request);
        }
      })());
      return;
    }
  }

  // Default network-first for other requests (e.g., API JSON); fallback to cache if previously stored.
  event.respondWith((async () => {
    const cache = await caches.open(RUNTIME);
    try {
      const response = await fetch(request);
      // Cache JSON/text responses for offline reuse
      if (response.ok && response.headers.get('Content-Type')?.includes('application/json')) {
        cache.put(request, response.clone());
      }
      return response;
    } catch {
      const cached = await cache.match(request);
      if (cached) return cached;
      return offlineFallback(request);
    }
  })());
});
