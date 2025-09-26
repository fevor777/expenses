# Expense Summary Metrics & Budget Logic Specification

_Last updated: 2025-09-26_

This document describes in detail how the expense summary and budget notification logic works as implemented in `expense-summary.service.ts`. It defines data sources, computed fields, formulas, thresholds, classification heuristics, notification formatting, and design intentions.

---
## 1. Purpose
Provide a concise but information-dense browser notification summarizing daily + rolling period spending performance vs. budget, while surfacing behavioral signals ("extra" or "non-essential" spending), pacing vs. time, anomaly spikes, and a composite "energy" (risk) score.

---
## 2. Data Sources
| Source | Service | Notes |
|--------|---------|-------|
| Rolling expenses + budget + frame | `BudgetDataService.getExpensesWithBudget()` | Supplies `expenses[]`, `budget`, and a rolling `dateFrame { start, finish }` (not necessarily calendar month). |
| Calendar month expenses | `ExpenseService.getExpenses(calendarMonthFrame)` | Used ONLY to override `monthlyTotal` (pure calendar month total). |
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
## 4. Computed Fields (Interface `ExpenseSummary`)
| Field | Type | Source / Formula | Notes |
|-------|------|------------------|-------|
| `todaysTotal` | number | Sum(amount where date ≥ startOfToday) | All categories. |
| `todaysIrregular` | number | Sum(irregular where date ≥ startOfToday) | Budget-relevant today. Spike checked. |
| `monthlyTotal` | number | Calendar month sum (override) | Ignores rolling frame for this field only. |
| `monthlyIrregular` | number | Sum(irregular in rolling frame) | Key pacing metric. |
| `budget` | number | From `BudgetDataService` | 0 if undefined. |
| `remaining` | number | `max(budget - monthlyIrregular, 0)` | Non-negative. |
| `percentUsed` | number | `budget ? clamp((monthlyIrregular / budget)*100, 0..100) : 0` | Drives budget chart & icon. |
| `extra` | number | Sum(amount with `!`) | Rolling frame. |
| `nonEssential` | number | Sum(amount with `!` or `?`) | Rolling frame. |
| `extraPct` | number | `extra / monthlyIrregular * 100` (0 if divisor 0) | Capped 100. |
| `nonEssentialPct` | number | `nonEssential / monthlyIrregular * 100` | Capped 100. |
| `daysSinceExtra` | number? | Days since last `!` expense | Undefined if none. |
| `daysSinceNonEssential` | number? | Days since last `!` or `?` expense | Undefined if none. |
| `medianDailyIrregular` | number? | Median of per-day irregular totals | Uses map keyed by calendar day-of-month. |
| `irregularSpike` | boolean? | `todaysIrregular > 1.5 * medianDailyIrregular` | Requires median. |
| `todaysExtra` | number | Sum of today's `!` amounts | For spike calc. |
| `averageDailyExtra` | number | `extra / daysPassedInFrame` | Rounded after calc. |
| `extraSpike` | boolean? | `todaysExtra > 2 * averageDailyExtra && todaysExtra > 0` | |
| `todaysNonEssential` | number | Sum of today's `!` or `?` | For spike calc. |
| `averageDailyNonEssential` | number | `nonEssential / daysPassedInFrame` | Rounded after calc. |
| `nonEssentialSpike` | boolean? | Same 2× rule as extra | |
| `energyScore` | number | Composite (see below) | Rounded to 0.1 after weighting. |
| `energyEmoji` | string | Mapping based on score thresholds | Visual risk indicator. |
| `dateFrameStart` | number | Rolling frame start (ms) | For pacing computations. |
| `dateFrameFinish` | number | Rolling frame finish (ms) | Limits exhaustion projection. |

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
### Velocity Classification (`calcVelocityState`)
1. Compute: `currentVelocity = spent / daysPassed` and `dailyBudget = budget / daysInMonth`.
2. State codes: `2` if `currentVelocity > dailyBudget * 1.2`, `1` if `> dailyBudget`, else `0`.

### Notification Velocity Line
Text built by `generateSpendingVelocityChart`:
- Context: same inputs above plus projected overrun `projectedOverrun = currentVelocity * daysInMonth - budget`.
- Classification icons:
  - `🚨` critical: `overrun > 0.2 * budget`
  - `⚠️` over: `overrun > 0`
  - `📊` near: `currentVelocity > dailyBudget * 0.9`
  - `💚` economical: otherwise

### Forecast Snippet (`velocityForecastSnippet`)
Conditions to display (appended):
- Requires `budget > 0` and `daysPassed > 2`.
- `currentVelocity = monthlyIrregular / daysPassed`.
- `projected = currentVelocity * daysInMonth`.
- If `abs(projected - budget) >= 3% * budget`, show `(<icon> ±diff€) projected€` where:
  - `icon`: `📈` if overshoot, `✅` if under.
  - `diff = projected - budget`.

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
## 10. Notification Composition
Lines (order reflects priority):
1. Budget progress bar: ASCII compact `[====--] 57%` (hidden if 0%).
2. Today line: `• Сегодня: <todaysTotal>€ (<todaysIrregular>€ ⚠️?) 💸: <todaysNonEssential>€` (irregular part only shown if differs from total). Spike icon `⚠️` appears on irregular spike.
3. Budget line: `• Б: <budget>€ O: <remaining>€ P: <monthlyIrregular>€` (shown only if budget > 0).
4. Monthly irregular pace summary: `• Б(%): <percentUsed> М(%): <elapsedPct> дн: <daysLeft> F: dd.mm?`.
5. Velocity line: `• <icon> Скорость: <class> (<forecast>)`.
6. Daily average / recommended pace: includes average irregular spend and recommended per-day allowance: `норм: X€/д` if days left > 0 and remaining > 0.
7. Extra line: `• Экстра: <extra>€ (<extraPct>%) d<daysSinceExtra> ⚠️?`.
8. Non-essential line: `• Хотелки: <nonEssential>€ (<nonEssentialPct>%) d<daysSinceNonEssential> ⚠️?`.
9. Energy line: `• Энергия: <emoji> (<score>)`.
10. Month total line: `• Месяц: <monthlyTotal>€` (calendar-month context).

Empty / zero-value conditional hiding rules ensure brevity (e.g., no budget → hide budget lines; no spikes → omit `⚠️`).

---
## 11. Charts & Icons
### Budget Circular Icon (SVG → Base64)
- Circle background + arc from top center proportionally to `percentUsed`.
- Colors: Green `#4CAF50` ≤ 60%, Orange `#FF9800` ≤ 80%, Red `#F44336` > 80%.
- Text: center shows integer percent.

### ASCII Budget Bar
Width = 7 characters. `filled = round(percentUsed/100 * width)`. `'=' * filled + '-' * (width-filled)`.

### Daily Pace Icons
| Ratio (today / avg) | Icon |
|---------------------|------|
| ≥ 2.0 | 🔥 |
| ≥ 1.5 | 📈 |
| ≥ 0.8 | 📊 |
| ≥ 0.3 | 📉 |
| < 0.3 | 💰 |

### Velocity Classification Icons
As per section 6.

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
## 16. Quick Reference (Formulas Summary)
```
remaining = max(budget - monthlyIrregular, 0)
percentUsed = budget ? clamp(monthlyIrregular / budget * 100, 0..100) : 0
extraPct = monthlyIrregular ? extra / monthlyIrregular * 100 : 0
nonEssentialPct = monthlyIrregular ? nonEssential / monthlyIrregular * 100 : 0
medianDailyIrregular = median(irregularPerDay.values)
irregularSpike = medianDailyIrregular && todaysIrregular > 1.5 * medianDailyIrregular
avgDailyExtra = daysPassed ? extra / daysPassed : 0
extraSpike = todaysExtra > 2 * avgDailyExtra && todaysExtra > 0
avgDailyNonEssential = daysPassed ? nonEssential / daysPassed : 0
nonEssentialSpike = todaysNonEssential > 2 * avgDailyNonEssential && todaysNonEssential > 0
velocityState = (currentVelocity > 1.2*dailyBudget ? 2 : currentVelocity > dailyBudget ? 1 : 0)
energyScore = round( (extraPct/100)*4 + velocityState*2 + spikeFlags , 1)
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
Primary logic: `src/app/common/service/expense-summary.service.ts`.

Refactoring, extension, or questions: add comments in code + reference this spec to keep parity.

---
_End of document._
