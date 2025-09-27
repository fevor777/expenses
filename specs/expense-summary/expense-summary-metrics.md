# Expense Summary Metrics & Budget Logic Specification

_Last updated: 2025-09-27_

This document describes in detail how the expense summary and budget notification logic works. The original monolithic implementation in `expense-summary.service.ts` has been refactored into a functional pipeline (classifier → pace → energy → snapshot → formatter). This spec mirrors the current implementation and lists the **active, user‑visible metrics**. Legacy / removed fields are called out for clarity.

---
## 1. Purpose
Provide a concise but information-dense browser notification summarizing daily + rolling period spending performance vs. budget, while surfacing behavioral signals ("extra" or "non-essential" spending), pacing vs. time, anomaly spikes, and a composite "energy" (risk) score.

---
## 2. Data Sources
| Source | Service | Notes |
|--------|---------|-------|
| Rolling expenses + budget + frame | `BudgetDataService.getExpensesWithBudget()` | Supplies `expenses[]`, `budget`, and a rolling `dateFrame { start, finish }` (not necessarily calendar month). |
| Calendar month expenses | `ExpenseService.getExpenses(calendarMonthFrame)` | (Deprecated) Previously used to override `monthlyTotal`; now removed in favor of frame-based `frameTotal` only. |
| Date frame boundary | `DateFilterService.getInitialMonthValue()` | Provides calendar month boundaries for the override. |
| Browser notifications | `NotificationService.showBrowserNotification()` | Delivery channel for composed summary. |
| Categories metadata | `getCategoryById(id)` | Field `includeInBalance` determines inclusion into irregular/budget spend. |

---
## 3. Terminology
- **Irregular Spend**: Sum of expenses whose category `includeInBalance` is truthy. This is the budget-controlled part.
- **Monthly Total**: Sum of ALL expenses in the calendar month (regardless of frame and category inclusion). Used for user context.
- **Rolling Frame**: Dynamic period (start → finish) used for budget pacing (may be calendar month, or a shifted window).
- **Extra / Non-Essential Flags**: Heuristic classification based on special characters in description:
  - `!` ⇒ "extra" (strong discretionary)
  - `!` or `?` ⇒ "non-essential" (broader discretionary)

---
## 4. Computed Fields (Current Snapshot Shape)
The factory `createExpenseSummary()` returns a plain object (`ExpenseSummarySnapshot`).
| Field | Type | Source / Formula | Notes |
|-------|------|------------------|-------|
| `percentUsed` | number | `(periodIrregular / budget)*100` (clamped, 0 if no budget) | Drives progress bar + icon. |
| `budget` | number | `rolling.budget?.value || 0` | 0 when absent. |
| `remaining` | number | `max(budget - periodIrregular, 0)` | Non-negative.
| `progressPct` | number | `(daysPassed / daysInFrame)*100` | Time elapsed proportion.
| `frameTotal` | number | Sum all expenses in frame | Replaces legacy `monthlyTotal`.
| `periodIrregular` | number | Sum irregular (includeInBalance) | Replaces `monthlyIrregular`.
| `todaysTotal` | number | Sum all expenses today | Includes non-irregular.
| `todaysIrregular` | number | Sum irregular expenses today | Used for need ratio.
| `todaysNonEssential` | number? | Sum of today `!` or `?` | Undefined if none.
| `dailyAverage` | number | `periodIrregular / daysPassed` (rounded up) | Pace baseline.
| `budgetPerDay` | number | `budget / daysInFrame` | Planned allowance.
| `needPerDay` | number? | Dynamic allowance needed to finish on budget | Undefined if no budget.
| `todaysNeedRatio` | number? | `todaysIrregular / needPerDay` | Arrow icon selection.
| `daysLeft` | number | Remaining inclusive days in frame | 0 when last day.
| `velocityRatio` | number? | `currentVelocity / dailyBudget` | Pace vs plan ratio.
| `velocityOverrun` | number? | `projectedTotal - budget` | Negative removed → 0.
| `velocityProjectedTotal` | number? | `currentVelocity * daysInFrame` | Forecast end spend.
| `energyScore` | number? | Composite discretionary + velocity + spikes | 0..≈10.
| `budgetExhaustion` | string? | Date (dd.mm) budget hits 0 (if applicable) | Clamped to frame end.
| `extra` | number | Sum `!` | Discretionary core.
| `extraPct` | number | `extra / periodIrregular * 100` | Capped 100.
| `daysSinceExtra` | number? | Days since last `!` | Undefined if none.
| `extraSpike` | boolean? | Today `!` > 2× avg & >0 | Spike heuristic.
| `nonEssential` | number | Sum `!` or `?` | Broader discretionary.
| `nonEssentialPct` | number | `nonEssential / periodIrregular * 100` | Capped 100.
| `daysSinceNonEssential` | number? | Days since last `!`/`?` | Undefined if none.
| `nonEssentialSpike` | boolean? | Spike heuristic | See §8.
| `meta` | object | Diagnostics (velocityState, daysPassed, etc.) | Not presented.

Removed/Deprecated: `medianDailyIrregular`, `irregularSpike`, `energyEmoji`, calendar month overrides, dedicated forecast suppression rule.

### Internal Context Values
| Name | Description |
|------|------------|
| `daysPassed` | Days elapsed within rolling frame up to & incl. today. Fallback: `today.getDate()` for calendar month if frame absent. |
| `irregularPerDay` | Map(dayOfMonth → irregular sum) used for median. |
| `startOfDay` | Local midnight of current day. |

---
## 5. Day & Frame Calculations
### Determining `daysPassed`
If rolling frame is present: `floor( (startOfToday - startMidnight(frameStart)) / 1d ) + 1` (bounded ≥ 1). Else fallback to calendar day-of-month.

### Month Progress Stats Helper
`monthProgressStats(frameStart?, frameFinish?)` returns:
- `daysInMonth`: If frame provided → inclusive day span of frame; else calendar month length.
- `daysPassed`: Inclusive days elapsed (min 0, max daysInMonth).
- `daysLeft`: `daysInMonth - daysPassed` (≥0).
- `elapsedPct`: `(daysPassed / daysInMonth) * 100`.
- `now`: Current Date.

---
## 6. Velocity & Forecasting
### Velocity Classification (Refactored Pace Module)
`velocityRatio = currentVelocity / dailyBudget` where:
 - `currentVelocity = periodIrregular / daysPassed`
 - `dailyBudget = budget / daysInFrame`

State (internal qualitative mapping):
 - `fast` if `velocityRatio > 1.2`
 - `over` if `> 1.0`
 - `near` if `> 0.9`
 - `ok` otherwise

Icons (formatter): ↑ (≥1.4) / ↗ (≥1.1) / → (≥0.9) / ↘ (≥0.6) / ↓ (<0.6).

### Velocity Line (Current)
Format: `• Скорость: <arrow> ±diff€ (<projected€>) <emojiScore?>`
 - `diff€` is positive overrun or `+0€` if under/flat (underrun negative signs preserved if desired later; currently collapsed to +/- style).
 - `projected€` matches `velocityProjectedTotal`.
 - Energy emoji + score appended when available.

Legacy forecast snippet (±3% noise filter and 📈/✅ icons) removed; simplified always-on projection shown when budget > 0.

### Budget Exhaustion Date (`budgetExhaustionDate`)
Displayed (prefix `F:`) if `0 < monthlyIrregular < budget`:
1. `velocity = monthlyIrregular / daysPassed`.
2. `daysToExhaust = (budget - monthlyIrregular) / velocity`.
3. Exhaust date = today + `ceil(daysToExhaust)`.
4. Clamped not to exceed rolling frame finish day.
5. Formatted `dd.mm`.

---
## 7. Behavioral Classification
| Marker | Effect |
|--------|--------|
| `!` | Increments `extra` and `nonEssential`. Also counts toward today's extra/non-essential and updates `latestExtraDate`. |
| `?` | Increments `nonEssential` only. Updates `latestNonEssentialDate`. |

Percentages: `extraPct`, `nonEssentialPct` relative to `monthlyIrregular` (not total spend). Protects denominator zero with 0 fallback.

---
## 8. Spike / Anomaly Detection
| Type | Condition | Rationale |
|------|-----------|-----------|
| Irregular Spike | `todaysIrregular > 1.5 * medianDailyIrregular` | Median robust to outliers. 1.5× signals anomaly. |
| Extra Spike | `todaysExtra > 2 * averageDailyExtra && todaysExtra > 0` | Stricter because discretionary. |
| Non-Essential Spike | `todaysNonEssential > 2 * averageDailyNonEssential && todaysNonEssential > 0` | Same rule as extra. |

Median: Computed over per-day irregular sums collected in `irregularPerDay`. For even count: rounded average of two middle values.

---
## 9. Energy Score & Emoji
### Formula
```
extraPctWeight = (extraPct / 100)
spikeFlags = count(irregularSpike, extraSpike, nonEssentialSpike where true)
numeric = extraPctWeight * 4 + velocityState * 2 + spikeFlags
energyScore = round(numeric, 1)
```

### Emoji Mapping
| Threshold (>=) | Emoji | Meaning |
|---------------|-------|---------|
| 9 | 😱 | Extreme risk / overspend pattern |
| 6 | 😟 | High concern |
| 3 | 😐 | Neutral / watch |
| 1.5 | 🙂 | Mildly good / low risk |
| else | 😇 | Calm / very healthy |

---
## 10. Notification Composition (Current)
Produced by `composeSummaryMessage`:
1. Progress bar `[===---] 54%` (hidden if `percentUsed <= 0`).
2. Today: `• Сегодня:<icon?> total€ (irreg€) 💸: nonEssential€` (parts hidden if redundant / missing).
3. Budget: `• O: remaining€ (d<daysLeft>) P: periodIrregular€ Б: budget€` (shown only if budget>0).
4. Pace: `• Темп: dailyAverage (п<budgetPerDay> н<needPerDay>)` (plan/need segments optional).
5. Velocity: `• Скорость: <arrow> ±diff€ (projected€) <emojiScore?>`.
6. Progress summary: `• Б: percentUsed% П: progressPct% <budgetExhaustion?>`.
7. Extra line.
8. Non-essential line.
9. Frame total line.

Differences vs legacy: energy folded into velocity line; forecast always visible; unified arrow icon system; consolidated progress summary.

---
## 11. Charts & Icons
### Budget Circular Icon (SVG → Base64)
- Circle background + arc from top center proportionally to `percentUsed`.
- Colors: Green `#4CAF50` ≤ 60%, Orange `#FF9800` ≤ 80%, Red `#F44336` > 80%.
- Text: center shows integer percent.

### ASCII Budget Bar
Width = 7 characters. `filled = round(percentUsed/100 * width)`. `'=' * filled + '-' * (width-filled)`.

### Daily Need Ratio Icons (Current)
| Ratio | Icon |
|-------|------|
| ≥ 1.4 | ↑ |
| ≥ 1.1 | ↗ |
| ≥ 0.9 | → |
| ≥ 0.6 | ↘ |
| < 0.6 | ↓ |

### Velocity Classification Icons
Same threshold map as Daily Need Ratio (reused glyphs for cognitive simplicity).

---
## 12. Rounding & Precision
- All monetary sums rounded via `roundUp(value*100)/100` after each accumulation to mitigate floating drift.
- Percentages shown with `toFixed(0)` when embedded in bar or summary lines.
- Recommended per-day and averages sometimes `toFixed(1)` for clarity.

---
## 13. Edge Cases & Safeguards
| Scenario | Handling |
|----------|----------|
| No budget | Many lines suppressed; percentUsed = 0; velocity states skipped. |
| Division by zero | Guarded (e.g., safePct, avgPerDay). |
| No expenses | Most metrics 0; medians undefined; spikes false. |
| Single-day frame | daysInMonth = 1; daysPassed min 1 ensures velocity defined. |
| Large spike first day | Median undefined → irregularSpike cannot trigger (requires median). |
| Future-dated expense | If date ≥ startOfToday it counts as today (implicit assumption). Could be sanitized in future. |
| Frame shorter than calendar month | Pacing and daysLeft computed against frame length, not calendar. |
| Projected diff within ±3% of budget | Forecast snippet suppressed as noise. |
| Over-spent budget (spent ≥ budget) | Exhaustion date suppressed. |

---
## 14. Design Rationale
- Use rolling frame for behavioral pacing to allow mid-month resets or sliding windows.
- Keep calendar-month total for user familiarity and alignment with bank statements.
- Median-based spike detection reduces false positives early in period.
- Character-based classification (`!` / `?`) provides zero-config tagging of discretionary spend.
- Composite energy score intentionally interpretable (weighting transparent) yet compact.

---
## 15. Potential Improvements
| Area | Idea |
|------|------|
| Classification | Move from punctuation to tag metadata or ML classifier. |
| Forecast | Add confidence interval based on variance of daily irregular. |
| Visualization | Multi-color bar segments for essential vs. extra vs. non-essential. |
| Energy Score | Incorporate trend (accelerating/decaying) using short EMA. |
| Localization | Externalize Russian labels & icons to i18n dictionary. |
| Time Zones | Normalize dates using a configured TZ instead of local system time. |
| Duplicate Spend Detection | Compare same amount + merchant in short window for merge suggestions. |
| Spike Thresholds | Make factors (1.5x, 2x) user-configurable. |
| Budget Strategy | Adaptive daily allowance recalculated from trailing 7-day spend. |

---
## 16. Quick Reference (Formulas Summary – Current)
```
remaining = max(budget - periodIrregular, 0)
percentUsed = budget ? clamp(periodIrregular / budget * 100, 0..100) : 0
extraPct = periodIrregular ? extra / periodIrregular * 100 : 0
nonEssentialPct = periodIrregular ? nonEssential / periodIrregular * 100 : 0
currentVelocity = periodIrregular / daysPassed
dailyBudget = budget / daysInFrame
velocityRatio = currentVelocity / dailyBudget
projectedTotal = currentVelocity * daysInFrame
overrun = max(projectedTotal - budget, 0)
needPerDay = (remaining > 0 && daysLeft > 0) ? remaining / daysLeft : undefined
todaysNeedRatio = needPerDay ? todaysIrregular / needPerDay : undefined
energyScore = round( (extraPct/100)*4 + velocityStateWeight + spikeFlags , 1)
```

---
## 17. Glossary
| Term | Meaning |
|------|---------|
| Pace | Spend rate relative to time elapsed. |
| Velocity | Current daily irregular spend compared to budget-derived daily allowance. |
| Exhaustion Date | Estimated date when budget would reach zero if current velocity persists. |
| Spike | A statistically simple anomaly based on multiplier thresholds. |
| Energy | Composite heuristic summarizing risk and discretionary intensity. |

---
## 18. File Ownership & Contact
Primary build logic: `src/app/common/model/expense-summary.factory.ts`
Supporting modules: classifier (`expense-summary.classifier.ts`), pace (`expense-summary.pace.ts`), energy (`expense-summary.energy.ts`).
Formatting: `expense-summary.formatter.ts`.
Service orchestrator: `expense-summary.service.ts`.

Refactoring, extension, or questions: update this spec & the architecture doc together for parity.

---
_End of document._
