# Copilot Project Instructions (Expenses)

Goal: Make correct, minimal, baseHref‑safe changes that preserve offline + Android + GH Pages behavior.

## Architecture & Routing
- Angular 18 app, hash routing (`useHash: true`) so deep links work on GitHub Pages & Android WebView. Routes in `src/app/app-routing.module.ts` lazy‑load standalone components (history, statistics, export, details, br-notification-redirect, root expense entry).
- Build outputs to `docs/` (serves as GH Pages root). Production baseHref `/expenses/`; Android build (`configuration android`) uses `./` to run from packaged assets.
- Service worker: custom file `public/custom-sw.js` registered manually in `src/main.ts` for notification click navigation (posts `{ type: 'NAVIGATE_HASH', hash }`). Keep relative path `./custom-sw.js`.

## Data & Offline Pattern
- Firestore access services live under `src/app/common/service/*`. Each remote service pairs with a *StoreService* using `localStorage` for offline + optimistic updates (e.g. `ExpenseService` ↔ `ExpenseStoreService`).
- Always wrap remote ops with `withUserId(afAuth, request, fallback, fallback)` (`with-user-id.helper.ts`) so unauthenticated or error paths fall back to local store and errors still update UI.
- Filtering parity: client/local filtering logic (date, categories, description substring) must mirror Firestore query + in‑memory filters. Reuse `ExpenseStoreService.filterExpenses` patterns; do not re‑implement ad hoc.

## Filtering & Navigation State
- Composite filter object `MultiFilter` (`multi-filter.component.ts`) holds `{ categories, date, description }`. Persist cross‑page context via `DateFilterService` before navigating (see `navigateToDetails` / `navigateToHistory`).
- Date ranges modeled by `DateFrame` & `Mode`; reuse helper functions (e.g. initial month/day getters) instead of constructing manual timestamps.

## Notifications & Service Worker
- `NotificationService` accepts either plain string or structured `NotificationPayload { message, type, context, expense }`; maintain backward compatibility with simple string emissions.
- Browser notifications prefer service worker messaging (`SHOW_BUDGET_NOTIFICATION`) so clicks route to `#/br-notification-redirect`. If extending, keep tag stability (`app-expenses-budget-summary`) and sanitize HTML (`createNotification`).

## Gestures & UI Conventions
- HammerJS configured globally via `CustomHammerConfig` (`common/custom-hammer.config.ts`) supplying horizontal swipe thresholds. Preserve gesture provider injection in `AppModule` when modifying module imports.
- Collapsible/detail UIs rely on centralized boolean maps; follow existing `details` component patterns rather than individual component state fields.

## Build & Scripts
- Dev: `npm start` (serve, baseHref still `/expenses/`).
- Prod publish to GH Pages: `npm run pp` (build then move `docs/browser/*` into `docs/` and commit with mandatory message `feat: build`). Keep commit message unchanged so scripted flow works.
- Android debug APK: `npm run android:apk` (angular build with `--configuration android`, copy assets via `android-webview/copy-web.sh`, then Gradle assemble). Assets end up in `android-webview/app/src/main/assets/www`.
- Formatting: `npm run format` / `format:check` on `src/**/*.{ts,html,scss,css,js,json}`.

## baseHref & Paths
- Use relative asset/service worker paths (`./custom-sw.js`, `favicon.ico` via public assets). Avoid leading `/` for resources that must work both at `/expenses/` and inside WebView.
- Navigation should always use absolute hash routes starting with `/#/` logically (Angular router link `/details` etc.)—do not introduce raw `location.href` changes except within service worker notification logic.

## Adding Features / Data Entities
- New stored entity: replicate pattern of existing service + store (local fallback, same filter semantics, id creation via `fireStore.createId()`). Ensure optimistic update path updates store first, then remote.
- New filter dimension: extend `MultiFilter`, propagate through `ExpenseStoreService.filterExpenses`, remote Firestore query builder, and components emitting `selectedFilters`.

## Android WebView Integration
- JS ↔ native auth bridge: keep calls `window.NativeAuth.requestGoogleSignIn()` and callback `window.onNativeGoogleIdToken(token)` stable; avoid renaming or moving invocation logic hidden behind framework wrappers.

## Safe Change Checklist
1. Respect offline parity (update both Firestore + local store). 2. Preserve baseHref relative paths. 3. Maintain hash routing & lazy import style. 4. Keep notification + SW message contract. 5. Keep commit script expectations (no changing `pp` script message).

(End)