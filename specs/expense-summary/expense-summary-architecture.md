# Expense Summary Architecture

_Last updated: 2025-09-27_

This document describes the modular architecture of the expense summary feature after refactoring. It explains the purpose and relationships of each module, the data flow from raw inputs (expenses + budget) to the final browser notification, and extension points.

---
## 1. High-Level Flow
```
BudgetDataService
  └─ getExpensesWithBudget()  -> RollingFrameBudget { expenses[], budget?, dateFrame { start, finish } }
                                      │
                                      ▼
                           createExpenseSummary()
                    (factory orchestrating pure modules)
                                      │
       ┌────────────────────────────────┼────────────────────────────────┐
       ▼                                ▼                                ▼
classifier (expense-summary.classifier) pace (expense-summary.pace)  energy (expense-summary.energy)
       │                                │                                │
       └───────────────┬────────────────┴────────────────┬────────────────┘
                       ▼                                 │
                ExpenseSummarySnapshot <------------------┘ (energyScore appended)
                       │
                       ▼
formatter (expense-summary.formatter) -> composeSummaryMessage(snapshot)
                       │
                       ▼
NotificationService.showBrowserNotification(title, message, icon)
```

---
## 2. Core Data Types (Defined in `expense-summary.types.ts`)
- `RollingFrameBudget`: Source input structure (expenses + optional budget + frame).
- `ExpenseSummarySnapshot`: Plain immutable (by convention) output containing all computed metrics needed for presentation.
- `TimeFrameStats`: Derived temporal context (daysPassed, daysLeft, elapsedPct, etc.).
- `SummaryBuildConfig`: Tunable thresholds (spike multiplier, velocity thresholds, weighting).
- `Clock`: Abstraction for deterministic testing (allows injecting frozen time).

---
## 3. Modules & Responsibilities
### 3.1 Factory (`expense-summary.factory.ts`)
Single orchestration point. Responsibilities:
- Normalize inputs (extract budget value, compute frame stats).
- Invoke classifier to aggregate raw expense metrics.
- Compute pacing / velocity metrics and budget exhaustion label.
- Compute need-per-day & today's need ratio.
- Compute energy score.
- Assemble + return `ExpenseSummarySnapshot`.
- (Future) Optionally freeze snapshot for immutability.

### 3.2 Classifier (`expense-summary.classifier.ts`)
Pure functions scanning all expenses once:
- Distinguish irregular vs non-irregular based on category flag `includeInBalance`.
- Detect discretionary markers in description (`!` and `?`).
- Track totals for extra, non-essential, irregular, today's subsets.
- Maintain latest occurrence timestamps for discretionary types.
- Helpers: `avgPerDay`, `daysSince`, `isSpike`, rounding, newest-date utility.

### 3.3 Pace (`expense-summary.pace.ts`)
Responsible for temporal budget dynamics:
- Calculate `percentUsed`, `remaining`, `dailyBudget`, `velocityRatio`, projected totals and overruns.
- Classify qualitative velocity state used later for energy scoring.
- Provide `computeNeedPerDay` (dynamic allowance to finish on budget) and today's need ratio.
- Provide `computeExhaustionLabel` (user-friendly date label) when budget not yet exhausted.

### 3.4 Energy (`expense-summary.energy.ts`)
Applies heuristic weighting model:
- Inputs: discretionary percentage (`extraPct`), velocity state, spike flags count.
- Produces scalar `energyScore` (higher = higher risk / overspend tendency).
- Weight constants supplied through config.

### 3.5 Formatter (`expense-summary.formatter.ts`)
Presentation-only functions:
- `composeSummaryMessage(snapshot, opts?)` builds multiline notification string.
- Renders progress bar, daily line, budget & pacing lines, velocity with energy, discretionary lines, frame total.
- Contains arrow icon selection logic (shared ladder for need ratio & velocity).
- Intentionally stateless: inputs fully derived from snapshot.

### 3.6 Service (`expense-summary.service.ts`)
Angular injectable orchestrator:
- Fetches data (`BudgetDataService`).
- Guards against out-of-frame execution (date sanity check).
- Builds snapshot (via wrapper `new ExpensesSummary(...)` currently; can directly call factory).
- Calls formatter, generates SVG icon (circular budget progress), dispatches notification.
- Transitional: still contains icon generation logic (could be moved to separate `icon` module later).

### 3.7 Wrapper Class (`expense-summary.model.ts`)
Temporary backward compatibility:
- `ExpenseSummary` class implements the snapshot interface and delegates to factory.
- Exists to avoid mass refactor of `new ExpensesSummary(...)` call sites.
- Planned removal after consumers adopt `createExpenseSummary` directly.

---
## 4. Key Functions (Signatures Simplified)
```ts
createExpenseSummary(rolling, frameStartMs, frameFinishMs, options?) => ExpenseSummarySnapshot
classifyExpenses(expenses, { startOfToday }) => { frameTotal, periodIrregular, classification }
computePace(periodIrregular, budgetValue, frameStats) => PaceMetrics
computeNeedPerDay(periodIrregular, todaysIrregular, budget, frameStats) => { needPerDay, todaysNeedRatio }
computeExhaustionLabel(periodIrregular, budget, frameStats) => string | undefined
computeEnergyScore(extraPct, velocityState, spikeFlags, weights) => number
composeSummaryMessage(snapshot, opts?) => string
```

---
## 5. Configuration (`expense-summary.config.ts`)
`DEFAULT_SUMMARY_CONFIG`:
- `spikeMultiplier`: Threshold for discretionary spike detection (default 2.0).
- `velocity`: (If extended later) could hold ratio boundaries.
- `energyWeights`: Weights for discretionary %, velocity, spike count (currently `{ discretionary:4, velocity:2, spike:1 }`).

Future: externalize config to user preferences or remote feature flags.

---
## 6. Error Handling & Edge Cases
- Division by zero protected in helper functions (`safePct`, `avgPerDay`).
- Missing budget results in suppressed velocity/need metrics (fields undefined or 0 by convention).
- Frame boundary sanity: if current system time outside rolling frame, service sends informational notification instead of metrics.
- Spikes require historical basis (no spike flagged if denominator / average is zero).

---
## 7. Mutability & Immutability
- Snapshot treated as value object. Currently mutable (plain object) but not mutated post-construction.
- Potential enhancement: `Object.freeze(snapshot)` in factory to guarantee immutability.

---
## 8. Testing Strategy (Planned)
Recommended test layers:
1. Classifier unit tests (discretionary parsing, spike detection, per-day aggregation).
2. Pace tests (velocity classification boundaries, exhaustion date edge cases).
3. Energy score weighting tests (combinatorial small matrix).
4. Factory integration test building a full snapshot from a synthetic expense set.
5. Formatter snapshot tests (golden multiline string with deterministic clock).

---
## 9. Extension Points & Future Work
| Area | Opportunity |
|------|-------------|
| Wrapper Removal | Replace class constructor usages with direct factory calls. |
| Integer Cents Arithmetic | Use integer cents internally to eliminate FP rounding drift. |
| i18n | Externalize Russian strings / icons into translation map. |
| Configurability | Expose spikeMultiplier & velocity thresholds in settings. |
| Energy Model | Add trend component or variance-based penalty. |
| Icons | Replace ASCII bar with Unicode blocks or mini sparkline. |
| Persistence | Cache last snapshot to compare deltas (change highlighting). |
| Time Zone Handling | Introduce configurable time zone / locale-specific midnight. |

---
## 10. Migration Notes
- Legacy fields (`medianDailyIrregular`, `irregularSpike`, forecast suppression rule) intentionally omitted in refactor to reduce complexity.
- Energy emoji selection now lives solely in formatter, not stored in snapshot.
- Consumers should prefer pure functions; avoid reintroducing stateful logic into service layer.

---
## 11. Directory Overview
```
src/app/common/model/
  expense-summary.types.ts        # Shared domain interfaces & utility types
  expense-summary.config.ts       # Default thresholds / weights
  expense-summary.classifier.ts   # Single-pass classification & helpers
  expense-summary.pace.ts         # Pacing, velocity, need-per-day, exhaustion
  expense-summary.energy.ts       # Energy score heuristic
  expense-summary.factory.ts      # Orchestrates full snapshot assembly
  expense-summary.formatter.ts    # Notification line composition & icons
  expense-summary.model.ts        # Transitional wrapper (to be removed)

src/app/common/service/
  expense-summary.service.ts      # Angular orchestrator & SVG icon generation
```

---
## 12. Glossary (Architecture Focus)
| Term | Definition |
|------|------------|
| Snapshot | Final immutable data object used by presentation layer. |
| Classification | Process of tagging & summing expenses by semantic markers. |
| Pace | Comparison of spend vs. time elapsed in frame. |
| Velocity Ratio | Current spend rate divided by planned daily allowance. |
| Need Per Day | Recomputed allowance required to finish exactly on budget. |
| Energy Score | Composite heuristic for discretionary + speed + spikes. |

---
_End of document._
