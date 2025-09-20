Here are a set of high‑value additions you can show in the browser notification, grouped by purpose, with formulas and quick implementation hints so you can pick & choose. (You already show totals, irregular %, budget remaining, extra (?), non‑essential (!), daily pace and velocity.)

## 1. Budget / Pace Intelligence
1. Percent of month elapsed  
   Formula: `(todayDay / daysInMonth) * 100`.  
   Use to compare with `percentUsed` to say “Ahead / Behind”.
2. Required daily allowance (remaining safe pace)  
   If `remaining > 0`: `remaining / daysRemaining`.  
   Display: `Допустимо: ~X€/день`.
3. Projected month irregular spend (you already compute via dailyAverage * daysInMonth implicitly; just surface it):  
   `proj = (monthlyIrregular / daysPassed) * daysInMonth`.
4. Over / under trajectory delta  
   `delta = proj - budget` (if budget > 0). Show: `Δ к бюджету: +60€` or `экономия -40€`.
5. Forecast date of budget exhaustion  
   If currentVelocity > 0: `daysToExhaust = (budget - monthlyIrregular) / currentVelocity`. Convert to calendar date if budget not yet exceeded.
6. Risk tier / grade  
   Combine (percentUsed – monthElapsed%) and projectedOverrun into a simple label: `LOW / WATCH / HIGH / CRITICAL`.

## 2. Behavioral & Quality Metrics
7. Number of expenses today & average per expense today  
   `countToday`, `avgToday = todaysTotal / countToday`. Helps detect “many small impulse buys.”
8. Median expense today / month (robust central tendency)  
   Median often more stable than average; highlights outlier days.
9. Largest category share of irregular spend  
   Find max irregular category total / monthlyIrregular * 100 → “Top cat 42% (Питание)”.
10. Top 3 irregular categories (compact list)  
    `Категории: Пит 42%, Сиг 18%, Вып 12%`.
11. Ratio: Extra / Non‑Essential vs Irregular  
    `extraPct = extra / monthlyIrregular * 100` – shows portion of discretionary burn flagged by you.

## 3. Temporal & Streak Insights
12. No‑spend streak (days with zero irregular spend)  
    Encourages positive behavior: `Серия экономии: 2 дня`.
13. Days since last “Extra” (`?`) and since last “Non‑Essential” (`? or !`)  
    Helps reduce impulse frequency.
14. Earliest hour of first expense today vs typical average hour (could store in localStorage).  
    “Ранний старт” indicator (spending earlier may correlate with higher day total).

## 4. Efficiency / Density
15. Spend density today  
    `todaysIrregular / monthlyIrregular * 100` → how much of month’s irregular happened today.
16. Average irregular per day so far vs Target daily allowance (difference).  
    `diff = dailyAverage - requiredAllowance` (if positive, you’re above the safe line).

## 5. Savings Context
17. Savings burn ratio (if you treat savings as protected)  
    `monthlyIrregular / (monthlyIrregular + savings)` or show savings untouched: `Сбережения: 1111€ (не тронуты)`.  
18. Potential end‑month savings delta if you cap at requiredAllowance: `(daysRemaining * requiredAllowance)` vs `remaining`.

## 6. Visual Micro‑Encodings
19. Mini category bar (top 5), ASCII:  
    Example: `▇▇▇▇ Пит | ▇▇ Сиг | ▇▇ Вып | ▇ Дом | ▇ Разн`  
    Each bar uses relative lengths scaled by top category.
20. Two-line “budget burn vs time” bar:  
    Line 1 (time): `[██████░░░░] 60% месяц`  
    Line 2 (budget): `[█████░░░░░] 50% нерег.`  
    Quick contrast shows if budget line is longer than time line (good or bad).

## 7. Anomaly / Spike Detection (Lightweight)
21. Today vs median daily irregular: if `todaysIrregular > medianDaily * 1.5` show `⚠️ Спайк`.
22. Extra spend spike: if today’s `extra` > average daily extra * 2.

## 8. Quality-of-Life / Meta
23. Last expense timestamp (HH:mm) and time since last expense  
    `Последняя: 22:48 (1ч назад)`.
24. Energy / impulse emoji summarizer:  
    Assign a composite score = (extraPct * weight + velocityState + spikeFlags); map to emoji (😇, 🙂, 😐, 😟, 😱).

## Suggested Ordering (Maintain Brevity)
Keep core lines first, then a “details” block only if user has allowed expanded notifications (you could persist a `notificationDetailLevel` in localStorage):
1. Budget bar
2. Today irregular / total
3. Month irregular / budget % + remaining
4. Required daily allowance & projected month
5. Extra / Non‑Essential
6. Risk / delta line
7. Optional extended block (top categories + counts/pacing)

## Implementation Hints

### 1. Add new computations
Inside `getExpenseSummary()` you already return core totals. Additional derived metrics can be computed in `sendBrowserNotificationSummary()` after you receive `summary`, to avoid altering the interface immediately:

```ts
const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
const daysPassed = now.getDate();
const monthElapsedPct = (daysPassed / daysInMonth) * 100;

const projectedIrregular = summary.monthlyIrregular > 0
  ? (summary.monthlyIrregular / daysPassed) * daysInMonth
  : 0;

const requiredPerDay = summary.budget > 0 && summary.remaining > 0
  ? summary.remaining / (daysInMonth - daysPassed)
  : 0;

const deltaToBudget = projectedIrregular - summary.budget;

const risk = (() => {
  if (!summary.budget) return '—';
  if (deltaToBudget > summary.budget * 0.2) return 'CRITICAL';
  if (deltaToBudget > 0) return 'HIGH';
  if (summary.percentUsed > monthElapsedPct + 10) return 'WATCH';
  return 'OK';
})();
```

### 2. Category aggregates (reuse existing logic)
Fetch monthly expenses once (you already do) → build category sums:

```ts
const catTotals: Record<string, number> = {};
expenses.forEach(e => {
  if (!catTotals[e.category]) catTotals[e.category] = 0;
  catTotals[e.category] = +(catTotals[e.category] + e.amount).toFixed(2);
});
const top = Object.entries(catTotals)
  .sort((a,b) => b[1] - a[1])
  .slice(0, 3)
  .map(([id, amt]) => `${getCategoryNameById(id).slice(0,5)} ${Math.round((amt/summary.monthlyIrregular||0)*100)}%`)
  .join(', ');
```

### 3. Optional two-line time vs budget bars
```ts
function bar(p: number) {
  const len = 10;
  const filled = Math.min(len, Math.round((p/100)*len));
  return '█'.repeat(filled) + '░'.repeat(len - filled);
}
const timeBar = bar(monthElapsedPct) + ` ${monthElapsedPct.toFixed(0)}% мес.`;
const budgetBar = bar(summary.percentUsed) + ` ${summary.percentUsed.toFixed(0)}% нерег.`;
```

Append after main lines if you want expanded mode.

### 4. Inject compact vs expanded
Store user preference:
```ts
const expanded = localStorage.getItem('notifExpanded') === '1';
```
Then conditionally append additional sections.

### 5. Keep Notification Body Under Limits
Desktop notifications truncate on some OS after ~200–250 chars. Provide a compressed version when `message.length > 250` (strip lines or top categories). You can auto‑minify:

```ts
if (message.length > 260) {
  message = message
    .replace(/Необязательные:[^\n]+\\n/, '') // drop some detail
    .replace(/Лишние:[^\n]+\\n/, '');
}
```

### 6. Consider Caching Expensive Aggregates
If you add median or percentile, compute once and cache in session (localStorage or a module singleton) keyed by month to avoid recomputation on every add.

### 7. Data Evolution Path
Later you can promote symbols to explicit tags; design the summary builder to read from an array of tag groups so you only swap the detection function.

## Prioritized Short List (If You Pick Only 5)
1. Month elapsed vs budget used comparison + risk label.
2. Required daily allowance (remaining / daysRemaining).
3. Projected irregular spend & Δ to budget.
4. Top 3 irregular categories share.
5. Expense count + average per expense today.

These five add strong predictive, behavioral, and categorical insight without clutter.

Let me know which group you want implemented next—I can patch the service with an expanded summary builder when you choose.