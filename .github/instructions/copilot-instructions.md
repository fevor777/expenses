# Copilot Project Instructions (Expenses)

Concise guide for AI changes: follow existing patterns; keep edits minimal & reversible.

## Architecture
Angular 18 app with hash routing (`useHash: true`), baseHref `/expenses/` (web) vs `./` (Android). Lazy routes: `history`, `statistics`, `export`, `details`, root expense entry. Root `AppModule` + many `standalone` components (charts, filters, notification, details sections). Prefer new UI as `standalone: true` and add to parent `imports`.

## Data Layer Pattern
Each Firestore-backed entity has a Service + *StoreService* (localStorage/offline mirror). Always wrap remote ops with `withUserId(afAuth, request, fallback, fallback)`. Fallback updates Store optimistically (e.g. `ExpenseService` ↔ `ExpenseStoreService`, `IrregularBudgetService`). Keep remote & local filtering semantics identical.

## Filtering
Date & multi-filter state centralized in `DateFilterService` + `MultiFilter` model. Reuse `getInitialMonthValue()` / `getInitialDayValue()`; don't recompute date ranges manually. Description filtering happens client-side after Firestore query; mirror logic in store service.

## UI & Interaction
Collapsible sections use a single `collapsed: Record<... , boolean>` map (see `DetailsComponent`). Navigation labels derived from `back-url` query param; preserve supported sources (`/`, `/history`, `/statistics`). Swipe navigation relies on HammerJS config (`CustomHammerConfig` + `HAMMER_GESTURE_CONFIG`). Maintain gesture behavior on refactors.

## Notifications
`NotificationService` payloads accept plain string or object `{ message, type, context, expense }`. Keep backward compatibility; `expense-added` context enables inline description editing + mark append.

## Build & Scripts
`npm start` dev; `npm run build` prod to `docs/` (script flattens `docs/browser/*`). Quick publish: `npm run pp` (commit msg must stay `feat: build`). Android debug APK: `npm run android:apk` (build w/ config `android`, copy assets, gradle assemble). Formatting: `npm run format` / `format:check`.

## Android Wrapper
Built assets copied into `android-webview/app/src/main/assets/www`. Keep Google Sign-In bridge: `window.NativeAuth.requestGoogleSignIn()` and callback `window.onNativeGoogleIdToken(token)`.

## Conventions (DO / AVOID)
DO centralize auth calls via `withUserId`; update Firestore + local store optimistically. DO reuse date frame models & `MultiFilter`. AVOID absolute asset paths (`/img`); use relative so Android baseHref works. AVOID breaking hash routing (always navigate with absolute paths starting with `/`).

## Adding Features
Generate: `ng g component feature/example --standalone`. For new persisted data: clone pattern of `IrregularBudgetService` + corresponding StoreService. Extend `MultiFilter` if adding a new dimension; update both Firestore query and local filter.

## PR Checklist
Build passes; offline fallback tested (sign out to simulate). Asset paths baseHref-safe. Remote/local filtering parity preserved. Gesture & notification behaviors unchanged unless intentionally updated.

(End)

