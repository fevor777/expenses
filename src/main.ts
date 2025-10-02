import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'hammerjs';

import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    ngZoneEventCoalescing: true,
  })
  .catch(err => console.error(err));

// Register custom service worker (non-Angular managed) for notification click handling.
if ('serviceWorker' in navigator) {
  // Use relative path respecting baseHref: in GH Pages /expenses/ will serve /expenses/custom-sw.js
  const swUrl = './custom-sw.js';
  navigator.serviceWorker.register(swUrl).catch(err => {
    console.warn('Service worker registration failed', err);
  });

  // Listen for navigation requests coming from the service worker after notification clicks
  navigator.serviceWorker.addEventListener('message', ev => {
    if (ev.data?.type === 'NAVIGATE_HASH') {
      const hash: string = ev.data.hash;
      if (location.hash !== hash) {
        location.hash = hash;
      }
    }
  });
}
