import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'hammerjs';

import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    ngZoneEventCoalescing: true,
  })
  .catch(err => console.error(err));

// Register custom service worker (non-Angular managed) for notification click handling.
// Conditional custom service worker registration:
// - Register in production contexts (GitHub Pages / Android asset build)
// - Do NOT register during local development (ng serve) to avoid stale caching of dev bundles.
if ('serviceWorker' in navigator) {
  const isLocalhost = /^(localhost|127\.0\.0\.1|::1)$/i.test(location.hostname);
  const hasPort = !!location.port; // ng serve usually sets a port
  const looksGhPages = /github\.io$/i.test(location.hostname);

  if (!isLocalhost && !hasPort || looksGhPages) {
    const swUrl = './custom-sw.js'; // relative path preserved
    console.info('[SW] Registering custom service worker (production mode)');
    navigator.serviceWorker.register(swUrl).catch(err => {
      console.warn('Service worker registration failed', err);
    });
    navigator.serviceWorker.addEventListener('message', ev => {
      if (ev.data?.type === 'NAVIGATE_HASH') {
        const hash: string = ev.data.hash;
        if (location.hash !== hash) {
          location.hash = hash;
        }
      }
    });
  } else {
    // Development: attempt to unregister existing service workers & clear caches that could interfere.
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(r => {
        if (r.active && /custom-sw\.js$/.test(r.active.scriptURL)) {
          console.info('[SW] Unregistering dev cached service worker:', r.active.scriptURL);
          r.unregister();
        }
      });
    });
    // Clear caches prefixed with expenses- to prevent stale asset serving in dev.
    caches.keys().then(keys => {
      keys.filter(k => /^expenses-(precache|runtime)-/.test(k)).forEach(k => {
        caches.delete(k);
        console.info('[SW] Deleted cache', k);
      });
    });
  }
}
