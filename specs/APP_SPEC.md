# Expenses Application Specification

## 1. Overview
A mobile‑friendly Angular 18 web application (also packaged into an Android WebView) for:
- Rapid expense capture with an on‑screen numeric keypad and category grid.
- Real‑time balance tracking ("irregular" spending vs. fixed / regular categories).
- Multi‑level analytics: daily history, category share, cumulative irregular spend vs. budget, treemap composition, micro trend sparklines, pie & bar charts.
- Budget control via a single monthly "Irregular Budget" plus savings tracking.
- Local offline persistence (localStorage) with seamless upgrade to authenticated multi‑device sync through Firebase (Firestore + Auth).
- CSV export & data migration utilities.
- In‑app and browser (system) notifications summarizing spending & budget velocity.

Primary user goals:
1. Enter expenses in < 2 seconds.
2. Instantly see impact on remaining discretionary (irregular) budget & balance.
3. Understand composition of spend and detect pace / overspend early.
4. Export / migrate data or sync across devices.

## 2. Tech Stack
- Framework: Angular 18 (standalone components, lazy loaded routes, HammerJS gestures).
- Language: TypeScript.
- UI / Charts: ECharts, Chart.js (ng2-charts), custom SVG micro‑visualizations & gauges.
- Date/Time: Luxon.
- Auth & Backend Sync: Firebase Authentication (Google) + Cloud Firestore (collections: `expenses`, `balance`, `irregularBudget`, `savings`).
- Storage (offline / unauthenticated): `localStorage` via lightweight store services (BehaviorSubjects).
- Notifications: Custom in‑app notification service + Browser Notification API (with dynamic SVG data URL icons showing budget usage).
- Build / Deploy: Angular CLI; GitHub Pages (docs/); Android wrapper (gradle project) copying built web bundle.

## 3. Domain Model
Entity | Fields | Notes
-------|--------|------
Expense | id, uid, amount, category, currency, date (epoch ms), description?, isDeletedFromBalance? | `includeInBalance` on category controls balance impact; description may embed lightweight marker symbols for ad‑hoc tagging (see below).
Category | id, name, icon (FontAwesome), color, includeInBalance | Two logical groups: Irregular (includeInBalance = true) vs Regular/FIXED.
Balance | uid, value | Tracks remaining discretionary balance after irregular expenses.
IrregularBudget | uid, value | Monthly budget ceiling for irregular categories.
Savings | uid, value | User-defined savings amount (display & future planning).
DateFrame | start, finish, display, mode (DAY/WEEK/MONTH/YEAR) | Drives filtering & chart bucket logic.

Derived Concepts:
- Irregular Spend: Sum of expenses whose category.includeInBalance === true.
- Regular Spend: All other categories (fixed base commitments) – excluded from "balance" debit logic.
- Extra Spend ("Лишние"): Expenses whose description contains a question mark `!` (interpreted as potentially unnecessary / reconsidered purchases). Summed separately (`extra`).
- Non‑Essential Spend ("Необязательные"): Expenses whose description contains either `?` or an exclamation point `!` (broader set capturing impulse / celebratory / experimental buys). Summed separately (`nonEssential`).
- Spending Velocity: Pace vs. budget (daily average & projected month total).
- Category Aggregates: sum, count, average, cumulative percent (Pareto).

## 4. Data Flow & Persistence
Mode | Source of Truth | Read Path | Write Path | Sync Strategy
-----|-----------------|-----------|-----------|--------------
Unauthenticated | localStorage + BehaviorSubjects | Store services (e.g. `ExpenseStoreService`) | localStorage mutation then subject next | Acts as offline cache.
Authenticated | Firestore collections | Firestore queries filtered by `uid` | Firestore writes (doc set/update/delete) | Helper `withUserId` chooses Firestore else fallback.

Migration: `exportFirebase(uid)` in `ExportComponent` pushes local JSON expenses into Firestore then clears local copy.

## 5. Core Features
1. Expense Entry Screen (`/`):
   - Numeric expression input (supports arithmetic via `ExpressionEvaluator`).
   - Category tap creates expense; optional description field.
   - Irregular categories auto‑decrement balance; regular ones ignore balance.
   - Long press gesture (global) navigates to Details; horizontal swipes to other pages (implemented via HammerJS / custom listeners).
   - Immediate notification summarizing category day/month totals and budget context.
   - After add, triggers browser notification summary (one‑shot) with: today total, month total, irregular usage %, budget remaining, velocity icons.
2. History (`/history`):
   - Infinite‑style grouped list by day with day subtotal.
   - Edit amount & description (prompts) updating Firestore/local & adjusting balance accordingly.
   - Delete expense with balance restitution for irregular categories.
   - Filters: Date frame, categories multi‑select, description substring.
   - Swipe navigation (left/right) to Statistics / Home.
3. Statistics (`/statistics`):
   - Donut (pie) chart (ECharts) of category share within selected period.
   - Bars listing categories with dynamic color keyed to relative percentage (green → red gradient) + hide capability (exclusion list logic).
   - Checkboxes to toggle Regular vs Irregular groups (applies category exclusion sets).
   - Composition Treemap.
4. Details / Analytics (`/details`): consolidated advanced analytics
   - Filter panel identical to History (multi filter + date).
   - Irregular Budget Gauge (circular SVG; stroke-dash array %).
   - Irregular Cumulative Line (custom SVG polyline vs budget dashed line; supports DAY/WEEK/MONTH/YEAR bucketization; shows pace).
   - Bar Chart (reuses generic bar component) for day distribution.
   - Treemap (composition) – category dominance.
   - Micro Visuals Table:
     * Lollipop share bars.
     * Sparkline trends (compressed to max virtual width 40).
     * Sortable columns: Sum, Share (%), Trend (active days count).
     * Category removal / isolation interactions (X / click row label).
   - Collapsible sections; navigation context (back & alternate target) resolves from query param `back-url`.
5. Export & Settings (`/export`):
   - View & edit Irregular Budget and Savings (prompt dialogs).
   - Authentication (Google sign‑in) supporting native Android WebView hook & web popup fallback.
   - CSV export (all expenses fields) with escaping & file download.
   - Local → Firestore migration.
6. Notifications:
  - In‑app panel (HTML capable) for contextual insights.
  - Browser notifications with dynamic ASCII progress bar, SVG icon gauge, textual pace & velocity diagnostics.
  - Additional metrics (if description markers present):
    * `Лишние` (Extra) total € — sum of `!` tagged expenses in current month.
    * `Необязательные` (Non‑Essential) total € — sum of `?` or `!` tagged expenses (extends Extra set).
    Shown as separate lines inside notification body after budget line.

## 6. Analytics & Visualization Inventory
Chart / Visual | Component | Purpose | Key Logic
---------------|-----------|---------|----------
Pie (Donut) | `StatisticsComponent` | Category proportional spend | ECharts pie; center label total €.
Category Bars | `StatisticsBarComponent` | Highlight top categories with color-coded intensity | Gradients based on percentage, hide/exclude.
Treemap | `CompositionChartsComponent` | Visual share & hierarchical layout | Category aggregates mapped to treemap nodes.
Irregular Gauge | `IrregularBudgetGaugeComponent` | Budget usage % | stroke-dasharray = percent + remainder.
Irregular Cumulative | `IrregularCumulativeComponent` | Pace vs. budget line | Bucketization by mode (hour/day/week/month).
Micro Lollipop + Sparkline Table | `MicroVisualsComponent` | Compact comparative trend & share table | Date key normalization; per-category series, active day counts.
Daily/Period Bar (not shown in code excerpt but implied) | `BarChartComponent` | Temporal distribution of spend | Group by day/hour.
Browser Notification ASCII & Icon | `ExpenseSummaryService` | At-a-glance status outside app | Textual bar (●/○) + inline generated SVG.

Ad-hoc Marker Metrics | `ExpenseSummaryService` | Surface qualitative self‑labeled spend buckets | Parses description for `!` (extra) and `?`/`!` (non‑essential) to build additional totals.

Pace / Velocity Indicators:
- Daily Avg vs Today (icons: 🔥, 📈, 📊, 📉, 💰).
- Velocity vs Budget (🚨 critical, ⚠️ overrun, 📊 near, 💚 under with potential savings).

## 7. Filtering & Query Semantics
Filter Dimension | Implementation
-----------------|---------------
Date | `DateFrame` objects (Luxon start/end); Firestore query `where('date','>=',...)` & `<=` with ordering.
Category | Firestore `where('category','in', [...])` if provided; local filter.
Description | Client substring filter (lowercased) after fetch.
Persistent Cross-Navigation | `DateFilterService` temporarily stores date, categories, description when moving between pages.

## 8. Balance & Budget Mechanics
- On add expense: if category.includeInBalance => decrement `balance` service value (persisted). Regular categories are purely informational.
- On delete / edit amount: balance is adjusted to refund or reapply difference (only for irregular categories and if not marked `isDeletedFromBalance`).
- Budget vs Spent metrics compute using irregular subset only.
 - Marker Totals: Do not affect balance; purely analytical overlays derived from description content.

## 9. Authentication & Native Bridge
- `AuthService.signInWithGoogle()` distinguishes:
  * Android WebView with native JS interface (`NativeAuth.requestGoogleSignIn`) → waits/retries for interface readiness.
  * Web fallback uses popup sign-in.
- Native returns ID token via `onNativeGoogleIdToken` global; credential sign-in triggers full reload to rebuild reactive pipes with authenticated user.

## 10. Offline / Online Strategy
- All CRUD operations use `withUserId()` helper: if user present => Firestore; else fallback to local store (localStorage + BehaviorSubject) so the UI is always reactive.
- On later sign-in, user may migrate local data to Firestore (manual exportFirebase step).

## 11. Gestures & Navigation
Gesture | Context | Outcome
--------|---------|--------
Swipe Left / Right | History / Statistics / Details / Home | Navigational transitions.
Long Press (global on home when keypad visible & no input) | Home | Opens Details page.
Tap Category | Home | Creates expense & triggers notifications.
Tap Budget Info (header) | Home | Shows in-app budget breakdown.

## 12. Export & Data Interoperability
- CSV export fields: id, uid, category, amount, currency, date (ms), description.
- Local → Firestore migration iterates existing local JSON, writes with `uid`, clears local copy.

## 13. Notifications (Detailed)
Type | Trigger | Payload Includes
-----|---------|-----------------
In-app Add Expense | After successful add | Added amount & category, today category sum, month category sum, month total, budget summary lines.
Header Budget Info | Tap header budget area | Budget value, spent irregular, remaining, percentages, monthly total.
Browser Summary | After add (once per fetch cycle using take(1)) | ASCII progress bar, today totals, monthly totals, irregular usage %, budget vs remaining, Extra (Лишние) €, Non‑Essential (Необязательные) €, daily average & projected, velocity assessment.

## 14. Security & Privacy Considerations
- Firestore queries always filtered by `uid` preventing cross-user data leakage.
- Local storage persists unencrypted; user should manage device security (potential future: encryption or IndexedDB with crypto).
- Notifications sanitize message for browser notifications (HTML stripped) to prevent injection.

## 15. Build & Deployment
Flow:
1. `ng build` outputs to `docs/browser`.
2. Post-build script moves content to `docs/` for GitHub Pages hosting (branch `gh-pages`).
3. Android pipeline: `npm run android:apk` builds web (android configuration) then copies into WebView wrapper Gradle project producing an APK.

## 16. High-Level Architecture (Text Diagram)
```
[UI Components]
  |-- ExpenseComponent (entry)
  |-- HistoryComponent
  |-- StatisticsComponent
  |-- DetailsComponent (advanced analytics)
  |-- ExportComponent (settings/export)
  |-- Shared: Filter components, NotificationComponent, Category grids, Charts

[Services]
  ExpenseService ----> Firestore 'expenses' (if auth) / ExpenseStoreService (local)
  BalanceService ----> Firestore 'balance' / BalanceStoreService
  IrregularBudgetService -> 'irregularBudget' / IrregularBudgetStoreService
  SavingService -------> 'savings' / SavingStoreService
  ExpenseSummaryService (aggregates) -> NotificationService
  DateFilterService (shared filter state)
  AuthService (Google / Native bridge)

[Persistence]
  Firestore (remote) <-> LocalStore (fallback)

[Analytics Layer]
  CategoryAnalyticsService, irregular utils, custom visualization components
```

## 17. Extensibility & Future Improvements
Area | Enhancement Ideas
-----|------------------
Data Integrity | Conflict resolution & merge when migrating local -> remote with overlaps.
Budgeting | Multiple envelopes / per-category budgets; rollover logic.
Authentication | Support email/password; session persistence UI.
Offline Sync | Background sync queue for pending writes when offline.
Analytics | Anomaly detection (spikes), correlation matrix UI (folders suggest planned features: `anomaly/`, `variance/`, `correlation/`).
UX | Keyboard shortcuts (desktop), progressive web app (install prompt), theming (dark mode), accessibility audits.
Security | Encrypt local sensitive data, add Firestore security rules summary.
Localization | Dynamic language switching (currently Russian labels embedded).
Testing | Expand unit tests & visual regression tests for charts / calculations.
Tagging | Replace symbol-based markers with a first-class tagging system (multi-tag select, stored fields, retroactive refactor/migration) allowing richer semantics (e.g. NEED vs WANT).

## 18. Glossary
Term | Definition
-----|-----------
Irregular Expense | Discretionary category included in balance & budget tracking.
Regular Expense | Fixed or baseline category excluded from balance decrease.
Balance | Remaining discretionary funds after irregular spend.
Irregular Budget | Monthly cap for irregular categories.
Velocity | Projected month spend vs budget based on current daily average.
Extra (Лишние) | Sum of expenses whose description contains `!`.
Non‑Essential (Необязательные) | Sum of expenses whose description contains `?` or `!`.

---
Generated on: 2025-09-20
