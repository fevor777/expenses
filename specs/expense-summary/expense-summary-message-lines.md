# Expense Summary Notification Lines Reference

_Last updated: 2025-09-27_

This document describes **each line** produced by `composeSummaryMessage()` in `expense-summary.formatter.ts`.
For every line we list: example(s), included metrics, semantic meaning, formulas, and visibility rules.

---
## 1. Progress Bar (Header)
**Example:**
```
[=====-] 73%
```
**Metrics Used:** `percentUsed`
**Meaning:** Shows how much of the budgeted irregular spend has been consumed relative to the full budget.
**Formula:**
```
percentUsed = budget ? clamp(periodIrregular / budget * 100, 0..100) : 0
barWidth = 7 (fixed)
filled = round(percentUsed/100 * barWidth)
bar = '=' * filled + '-' * (barWidth - filled)
```
**Visibility:** Hidden if `percentUsed <= 0` (i.e., no budget or no spend yet).

---
## 2. Today Line
**Example:**
```
• Сегодня: ↗ 120€ (90€) 💸: 30€
```
**Metrics Used:** `todaysTotal`, `todaysIrregular`, `todaysNonEssential`, `todaysNeedRatio`, `needPerDay`
**Meaning:** Summarizes today's total spend, the budget-relevant portion (irregular), discretionary (non-essential) portion, and short-term pacing vs. required allowance.
**Formulas:**
```
startOfToday = local midnight
todaysTotal = sum(all expenses date >= startOfToday)
todaysIrregular = sum(irregular expenses date >= startOfToday)
nonEssential today = sum(expenses with ! or ? today)
needPerDay = (remaining > 0 && daysLeft > 0) ? remaining / daysLeft : undefined
todaysNeedRatio = needPerDay ? todaysIrregular / needPerDay : undefined
arrow icon thresholds: >=1.4 ↑, >=1.1 ↗, >=0.9 →, >=0.6 ↘, else ↓
```
**Visibility Rules:**
- Irregular parentheses part `(todaysIrregular€)` omitted if equals `todaysTotal`.
- Non-essential segment omitted if `todaysNonEssential` undefined / 0.
- Arrow omitted if `todaysNeedRatio` undefined.

---
## 3. Budget Line
**Example:**
```
• O: 640€ (d12) P: 360€ Б: 1000€
```
**Metrics Used:** `remaining`, `daysLeft`, `periodIrregular`, `budget`
**Meaning:** Shows current remaining budget (`O` = Остаток), days left in frame, irregular spend so far (`P`), and total budget (`Б`).
**Formulas:**
```
remaining = max(budget - periodIrregular, 0)
daysLeft = frame.daysLeft
periodIrregular = sum(irregular in frame)
```
**Visibility:** Entire line hidden if `budget <= 0`.

---
## 4. Pace Line (Daily Average / Plan / Need)
**Example:**
```
• Темп: 45 (п33 н40)
```
**Metrics Used:** `dailyAverage`, `budgetPerDay`, `needPerDay`
**Meaning:** Compares observed average irregular spend per day (`dailyAverage`) with planned daily allowance (`п`) and dynamic required allowance to still hit the budget (`н`).
**Formulas:**
```
dailyAverage = periodIrregular / daysPassed
budgetPerDay = budget / daysInFrame
needPerDay = (remaining > 0 && daysLeft > 0) ? remaining / daysLeft : undefined
```
**Visibility:** `п` part omitted if `budgetPerDay` falsy. `н` part omitted if `needPerDay` undefined. Whole line always shown (defaults collapse gracefully).

---
## 5. Velocity Line
**Example:**
```
• Скорость: ↗ +60€ (660€) 🙂5.4
```
**Metrics Used:** `velocityRatio`, `velocityOverrun`, `velocityProjectedTotal`, `energyScore`
**Meaning:** Shows current spend rate vs. planned pace, projected frame-end spend, overrun/underrun, and composite behavioral risk (energy score).
**Formulas:**
```
currentVelocity = periodIrregular / daysPassed
dailyBudget = budget / daysInFrame
velocityRatio = currentVelocity / dailyBudget
velocityProjectedTotal = currentVelocity * daysInFrame
overrun = max(velocityProjectedTotal - budget, 0)
icon thresholds: same ladder as today line ratio (see §2)
energyScore = (extraPct/100)*4 + velocityStateWeight + spikeFlags (rounded 0.1)
energyEmoji thresholds: >=9 😱, >=6 😟, >=3 😐, >=1.5 🙂, else 😇
```
**Formatting Details:**
- Overrun displayed as `+X€`; if zero prints `+0€`.
- Energy appended as ` emoji<score>` (e.g., `🙂5.4`).
**Visibility:** If `budget <= 0` line still shown but may degrade; current implementation always prints with fallback (`⚡` variant previously, now arrow defaults). Optionally could hide in no-budget scenarios.

---
## 6. Progress Summary Line
**Example:**
```
• Б: 57% П: 60% 12.10
```
**Metrics Used:** `percentUsed`, `progressPct`, `budgetExhaustion`
**Meaning:** Side-by-side comparison of spend consumption vs. time elapsed; optional predicted exhaustion date.
**Formulas:**
```
percentUsed = (periodIrregular / budget) * 100 (clamped)
progressPct = (daysPassed / daysInFrame) * 100
budgetExhaustion = formatted dd.mm if 0 < periodIrregular < budget else undefined
```
**Visibility:** Always shown if budget > 0. Exhaustion date omitted if absent.

---
## 7. Extra Line
**Example:**
```
• Экстра: 140€ (28%) d3 ⚠️
```
**Metrics Used:** `extra`, `extraPct`, `daysSinceExtra`, `extraSpike`
**Meaning:** Highlights discretionary "extra" spend (strict marker `!`) proportion and recency, warning on spikes.
**Formulas:**
```
extra = sum(expenses with '!')
extraPct = periodIrregular ? extra / periodIrregular * 100 : 0
daysSinceExtra = daysSince(last '!')
extraSpike = todaysExtra > 2 * averageDailyExtra && todaysExtra > 0
```
**Visibility:** Always shown (even at 0€) to reinforce tagging habit; spike icon `⚠️` only if `extraSpike` true.

---
## 8. Non-Essential Line
**Example:**
```
• Хотелки: 310€ (62%) d1
```
**Metrics Used:** `nonEssential`, `nonEssentialPct`, `daysSinceNonEssential`, `nonEssentialSpike`
**Meaning:** Broader discretionary spend combining `!` and `?`, capturing lifestyle leakage beyond strict extras.
**Formulas:**
```
nonEssential = sum(expenses with '!' or '?')
nonEssentialPct = periodIrregular ? nonEssential / periodIrregular * 100 : 0
daysSinceNonEssential = daysSince(last '!' or '?')
nonEssentialSpike = todaysNonEssential > 2 * averageDailyNonEssential && todaysNonEssential > 0
```
**Visibility:** Always shown; spike icon if `nonEssentialSpike`.

---
## 9. Frame Total Line
**Example:**
```
• Период: 780€
```
**Metrics Used:** `frameTotal`
**Meaning:** Total spend (all categories) inside the active rolling frame (context anchor to differentiate from irregular-only lines).
**Formula:**
```
frameTotal = sum(all expenses in frame)
```
**Visibility:** Always shown (final context line).

---
## 10. Derived / Not Directly Shown (Referenced Inline)
| Name | Used In | Purpose | Formula |
|------|---------|---------|---------|
| `needPerDay` | Today & Pace lines | Required daily irregular to finish on budget | `(remaining)/(daysLeft)` if both >0 |
| `todaysNeedRatio` | Today line | Arrow indicator of daily pacing vs need | `todaysIrregular / needPerDay` |
| `velocityProjectedTotal` | Velocity line | Forecast total irregular spend | `currentVelocity * daysInFrame` |
| `overrun` | Velocity line | Budget overshoot at current rate | `max(projectedTotal - budget,0)` |
| `energyScore` | Velocity line | Composite behavioral risk | see section 5 |

---
## 11. Icon Threshold Summary
| Ratio | Arrow |
|-------|-------|
| ≥ 1.4 | ↑ |
| ≥ 1.1 | ↗ |
| ≥ 0.9 | → |
| ≥ 0.6 | ↘ |
| < 0.6 | ↓ |

---
## 12. Hiding Logic Summary
| Line | Hidden When |
|------|-------------|
| Progress Bar | `percentUsed <= 0` |
| Today (irregular part) | `todaysIrregular === todaysTotal` (parenthetical suppressed) |
| Today (non-essential) | `todaysNonEssential` undefined/0 |
| Today (arrow) | `todaysNeedRatio` undefined |
| Budget line | `budget <= 0` |
| Pace (plan part) | `budgetPerDay` falsy |
| Pace (need part) | `needPerDay` undefined |
| Progress summary | `budget <= 0` (in practice still appears only with budget) |
| Extra spike icon | `!extraSpike` |
| Non-essential spike icon | `!nonEssentialSpike` |
| Budget exhaustion date | undefined (no label added) |

---
## 13. Future Considerations
- **Localization:** Expose labels and symbols to i18n (replace Russian text & glyphs with tokens).
- **Adaptive Iconography:** Consider colorized arrows or Unicode blocks for more granular pacing gradients.
- **Optional Lines:** Allow user preference toggles (e.g., hide discretionary lines or velocity).
- **Cumulative Deltas:** Add changes since last notification (e.g., +45€ today) per line.
- **Spike Explanations:** Tooltip / secondary notification clarifying why a spike flagged.

---
_End of document._
