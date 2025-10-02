/**
 * Custom Service Worker to support showing budget summary notifications and handling clicks
 * even when the Angular app tab is closed.
 */
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
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
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        data: { route: '#/br-notification-redirect' }
      });
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
