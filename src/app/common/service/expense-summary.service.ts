import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, first } from 'rxjs/operators';

import { BudgetDataService } from './budget-data.service';
import { NotificationService } from '../component/notification/notification.service';
import { getCategoryById } from '../model/categories';
import { Expense } from '../model/expense.model';

export interface ExpenseSummary {
  todaysTotal: number;
  todaysIrregular: number;
  /**
   * @deprecated Use frameTotal. This previously represented calendar month total; now the frame is authoritative.
   */
  monthlyTotal: number;
  /** Total spend inside the current rolling frame (all categories). */
  frameTotal: number;
  monthlyIrregular: number;
  budget: number;
  remaining: number;
  percentUsed: number;
  extra: number;
  nonEssential: number;
  extraPct?: number;
  nonEssentialPct?: number;
  daysSinceExtra?: number;
  daysSinceNonEssential?: number;
  // Anomaly detection fields
  medianDailyIrregular?: number; // median of irregular spend per day so far this month
  irregularSpike?: boolean; // true if today irregular > 1.5 * median
  todaysExtra?: number; // today's extra spend
  averageDailyExtra?: number; // average extra per day so far
  extraSpike?: boolean; // true if today's extra > 2 * average daily extra
  todaysNonEssential?: number; // today's non-essential spend
  averageDailyNonEssential?: number; // average non-essential per day
  nonEssentialSpike?: boolean; // spike flag for non-essential (same rule factor 2x avg)
  // Meta fields
  energyScore?: number; // composite score
  energyEmoji?: string; // mapped emoji
  dateFrameStart?: number; // rolling frame start (ms)
  dateFrameFinish?: number; // rolling frame finish (ms)
}

@Injectable({
  providedIn: 'root',
})
export class ExpenseSummaryService {
  constructor(
    private budgetDataService: BudgetDataService,
    private notificationService: NotificationService
  ) {}

  sendBrowserNotificationSummary(): Observable<void> {
    // All metrics computed strictly within the rolling frame provided by BudgetDataService.
    // If the current date is outside the provided frame (edge / data error), send an informational notification instead.
    return this.budgetDataService.getExpensesWithBudget().pipe(
      first(),
      switchMap(rolling => {
        const frameStart = rolling.dateFrame.start.toMillis();
        const frameFinish = rolling.dateFrame.finish.toMillis();
        const now = Date.now();
        if (now < frameStart || now > frameFinish) {
          const msg = this.outOfFrameMessage(frameStart, frameFinish);
            return this.notificationService.showBrowserNotification(
              'Сводка расходов',
              msg,
              { icon: undefined as any }
            );
        }
        const base = this.computeBaseMetrics(
          rolling.expenses,
          frameStart,
          frameFinish
        );
        const enriched = this.enrichWithBudget(
          base,
          rolling.budget?.value || 0,
          frameStart,
          frameFinish
        );
        const summary = {
          ...enriched,
          monthlyTotal: this.roundUp(base.monthlyTotal), // backward compat
          frameTotal: this.roundUp(base.frameTotal),
          dateFrameStart: frameStart,
          dateFrameFinish: frameFinish,
        };
        return this.pushSummaryNotification(summary);
      })
    );
  }

  private outOfFrameMessage(frameStart: number, frameFinish: number): string {
    const fmt = (ms: number) => {
      const d = new Date(ms);
      const dd = d.getDate().toString().padStart(2, '0');
      const mm = (d.getMonth() + 1).toString().padStart(2, '0');
      return `${dd}.${mm}`;
    };
    return `Текущая дата вне активного периода (${fmt(frameStart)} – ${fmt(frameFinish)}). Обновите дату начала бюджета.`;
  }

  private pushSummaryNotification(summary: ExpenseSummary): Observable<void> {
    const title = 'Сводка расходов';
    const message = this.composeSummaryMessage(summary);
    const icon = this.generateBudgetIcon(summary.percentUsed);
    return this.notificationService.showBrowserNotification(title, message, {
      icon,
      badge: icon,
    });
  }

  private composeSummaryMessage(summary: ExpenseSummary): string {
    // Re-ordered by actionable priority: overview/budget -> today -> pace -> behavioral levers -> aggregates -> context.
    const parts = [
      this.lineHeader(summary),
      this.lineToday(summary),
      this.lineBudget(summary),
      this.lineDailyAverage(summary),
      this.lineVelocity(summary),
      this.lineMonthlyIrregular(summary),
      this.lineExtra(summary),
      this.lineNonEssential(summary),
      this.lineEnergy(summary),
      this.lineMonth(summary),
    ].filter(Boolean);
    return parts.join('\n');
  }
  // Forecast snippet used inside velocity line.
  private velocityForecastSnippet(s: ExpenseSummary) {
    if (!s.budget || s.budget <= 0) return '';
    const stats = this.monthProgressStats(
      s.dateFrameStart,
      s.dateFrameFinish
    );
    if (stats.daysPassed <= 2) return '';
    const currentVelocity = s.monthlyIrregular / stats.daysPassed;
    if (currentVelocity <= 0) return '';
    const projected = currentVelocity * stats.daysInMonth;
    const diff = projected - s.budget;
    if (Math.abs(diff) < s.budget * 0.03) return '';
    const icon = diff > 0 ? '📈' : '✅';
    const sign = diff > 0 ? '+' : '-';
    const abs = Math.abs(diff).toFixed(0);
    return ` (${icon} ${sign}${abs}€) ${projected.toFixed(0)}€`;
  }
  /**
   * Behavior today: combine today's extra / non-essential if present and concise.
   */
  private lineBehaviorToday(s: ExpenseSummary) {
    return s.todaysNonEssential ? ` 💸: ${s.todaysNonEssential}€` : '';
  }
  private buildPaceAndForecast(summary: ExpenseSummary) {
    if (summary.budget <= 0) return { line: '', daysLeft: 0, exhaustion: '' };
    const stats = this.monthProgressStats(
      summary.dateFrameStart,
      summary.dateFrameFinish
    );
    const exhaustion = this.budgetExhaustionDate(summary, stats) || '';
    return {
      line: `${stats.elapsedPct.toFixed(0)}`,
      daysLeft: stats.daysLeft,
      exhaustion,
    };
  }
  private monthProgressStats(frameStart?: number, frameFinish?: number) {
    const now = new Date();
    if (frameStart && frameFinish) {
      const start = new Date(frameStart);
      const finish = new Date(frameFinish);
      // normalize start to start-of-day, finish to end-of-day
      const startDay = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate()
      ).getTime();
      const finishDayEnd = new Date(
        finish.getFullYear(),
        finish.getMonth(),
        finish.getDate(),
        23,
        59,
        59,
        999
      ).getTime();
      const totalDays = Math.max(
        1,
        Math.ceil((finishDayEnd - startDay + 1) / (1000 * 60 * 60 * 24))
      );
      const daysPassed = Math.min(
        totalDays,
        Math.max(
          0,
          Math.floor((now.getTime() - startDay) / (1000 * 60 * 60 * 24)) + 1
        )
      );
      const daysLeft = Math.max(totalDays - daysPassed, 0);
      return {
        daysInMonth: totalDays,
        daysPassed,
        daysLeft,
        elapsedPct: (daysPassed / totalDays) * 100,
        now,
      };
    }
    // fallback calendar month
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysPassed = now.getDate();
    return {
      daysInMonth,
      daysPassed,
      daysLeft: Math.max(daysInMonth - daysPassed, 0),
      elapsedPct: (daysPassed / daysInMonth) * 100,
      now,
    };
  }
  private budgetExhaustionDate(
    summary: ExpenseSummary,
    stats: ReturnType<typeof this.monthProgressStats>
  ) {
    if (
      summary.monthlyIrregular <= 0 ||
      summary.monthlyIrregular >= summary.budget
    )
      return undefined;
    const velocity = summary.monthlyIrregular / stats.daysPassed;
    if (velocity <= 0) return undefined;
    const remaining = summary.budget - summary.monthlyIrregular;
    const daysToExhaust = remaining / velocity;
    // Build candidate exhaustion date relative to 'now'
    const exhaustDate = new Date(stats.now.getTime());
    exhaustDate.setDate(exhaustDate.getDate() + Math.ceil(daysToExhaust));

    // Clamp to rolling frame finish if provided (avoid spilling past frame)
    if (summary.dateFrameFinish) {
      const frameFinishDate = new Date(summary.dateFrameFinish);
      const frameFinishEnd = new Date(
        frameFinishDate.getFullYear(),
        frameFinishDate.getMonth(),
        frameFinishDate.getDate(),
        23,
        59,
        59,
        999
      ).getTime();
      if (exhaustDate.getTime() > frameFinishEnd) {
        // Use frame finish date
        exhaustDate.setTime(frameFinishDate.getTime());
      }
    }

    const dd = exhaustDate.getDate().toString().padStart(2, '0');
    const mm = (exhaustDate.getMonth() + 1).toString().padStart(2, '0');
    return `F: ${dd}.${mm}`;
  }

  private percentLine(v?: number) {
    return v !== undefined ? ` (${v.toFixed(0)}%)` : '';
  }

  private daysLine(v?: number) {
    return v !== undefined && v >= 0 ? ` d${v}` : '';
  }

  // getExpenseSummary removed (logic inlined into sendBrowserNotificationSummary)

  private computeBaseMetrics(
    expenses: Expense[],
    frameStart?: number,
    frameFinish?: number
  ): Omit<
    ExpenseSummary,
    'budget' | 'remaining' | 'percentUsed' | 'energyScore' | 'energyEmoji'
  > {
    const ctx = this.initMetricsContext(frameStart, frameFinish);
    this.scanExpenses(expenses, ctx);
    return this.finalizeMetrics(ctx);
  }

  private initMetricsContext(frameStart?: number, frameFinish?: number) {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();
    let daysPassed = today.getDate(); // fallback calendar month
    if (frameStart && frameFinish) {
      // compute daysPassed inside rolling frame
      const startDay = new Date(frameStart);
      const startMidnight = new Date(
        startDay.getFullYear(),
        startDay.getMonth(),
        startDay.getDate()
      ).getTime();
      if (startMidnight <= startOfToday) {
        daysPassed =
          Math.floor((startOfToday - startMidnight) / (1000 * 60 * 60 * 24)) + 1;
      }
    }
    return {
      startOfDay: startOfToday,
      daysPassed,
      monthlyTotal: 0,
      frameTotal: 0,
      monthlyIrregular: 0,
      todaysTotal: 0,
      todaysIrregular: 0,
      extra: 0,
      nonEssential: 0,
      todaysExtra: 0,
      todaysNonEssential: 0,
      latestExtraDate: undefined as number | undefined,
      latestNonEssentialDate: undefined as number | undefined,
      irregularPerDay: new Map<number, number>(),
    };
  }

  private scanExpenses(
    expenses: Expense[],
    c: ReturnType<typeof this.initMetricsContext>
  ) {
    for (const e of expenses) this.processExpense(e, c);
  }
  private processExpense(
    e: Expense,
    c: ReturnType<typeof this.initMetricsContext>
  ) {
    const amt = e.amount || 0;
    c.monthlyTotal = this.roundUp(c.monthlyTotal + amt);
    c.frameTotal = this.roundUp(c.frameTotal + amt);
    const include = getCategoryById(e.category)?.includeInBalance;
    if (include) this.addIrregular(e, amt, c);
    this.classifyExpense(e, amt, c);
    if (e.date >= c.startOfDay) this.applyToday(e, amt, include, c);
  }
  private addIrregular(
    e: Expense,
    amt: number,
    c: ReturnType<typeof this.initMetricsContext>
  ) {
    c.monthlyIrregular = this.roundUp(c.monthlyIrregular + amt);
    const d = new Date(e.date).getDate();
    c.irregularPerDay.set(
      d,
      this.roundUp((c.irregularPerDay.get(d) || 0) + amt)
    );
  }
  private classifyExpense(
    e: Expense,
    amt: number,
    c: ReturnType<typeof this.initMetricsContext>
  ) {
    const desc = e.description || '';
    const bang = desc.includes('!');
    const nonEss = bang || desc.includes('?');
    if (bang) {
      c.extra = this.roundUp(c.extra + amt);
      c.latestExtraDate = this.newest(c.latestExtraDate, e.date);
    }
    if (nonEss) {
      c.nonEssential = this.roundUp(c.nonEssential + amt);
      c.latestNonEssentialDate = this.newest(c.latestNonEssentialDate, e.date);
    }
  }
  private applyToday(
    e: Expense,
    amt: number,
    include: boolean | undefined,
    c: ReturnType<typeof this.initMetricsContext>
  ) {
    c.todaysTotal = this.roundUp(c.todaysTotal + amt);
    if (include) c.todaysIrregular = this.roundUp(c.todaysIrregular + amt);
    const desc = e.description || '';
    if (desc.includes('!')) c.todaysExtra = this.roundUp(c.todaysExtra + amt);
    if (desc.includes('!') || desc.includes('?'))
      c.todaysNonEssential = this.roundUp(c.todaysNonEssential + amt);
  }

  private finalizeMetrics(c: ReturnType<typeof this.initMetricsContext>) {
    const extraPct = this.safePct(c.extra, c.monthlyIrregular);
    const nonEssentialPct = this.safePct(c.nonEssential, c.monthlyIrregular);
    const medianDailyIrregular = this.median([...c.irregularPerDay.values()]);
    const irregularSpike = this.isIrregularSpike(
      c.todaysIrregular,
      medianDailyIrregular
    );
    const averageDailyExtra = this.avgPerDay(c.extra, c.daysPassed);
    const extraSpike = this.isSpike(c.todaysExtra, averageDailyExtra);
    const averageDailyNonEssential = this.avgPerDay(
      c.nonEssential,
      c.daysPassed
    );
    const nonEssentialSpike = this.isSpike(
      c.todaysNonEssential,
      averageDailyNonEssential
    );
    return {
      todaysTotal: c.todaysTotal,
      todaysIrregular: c.todaysIrregular,
      monthlyTotal: c.monthlyTotal,
      frameTotal: c.frameTotal,
      monthlyIrregular: c.monthlyIrregular,
      extra: this.roundUp(c.extra),
      extraPct,
      nonEssential: this.roundUp(c.nonEssential),
      nonEssentialPct,
      daysSinceExtra: this.daysSince(c.latestExtraDate),
      daysSinceNonEssential: this.daysSince(c.latestNonEssentialDate),
      medianDailyIrregular,
      irregularSpike,
      todaysExtra: c.todaysExtra,
      averageDailyExtra: this.roundUp(averageDailyExtra),
      extraSpike,
      todaysNonEssential: c.todaysNonEssential,
      averageDailyNonEssential: this.roundUp(averageDailyNonEssential),
      nonEssentialSpike,
    };
  }
  private safePct(part: number, whole: number) {
    return whole ? Math.min((part / whole) * 100, 100) : 0;
  }
  private isIrregularSpike(today: number, median?: number) {
    return median !== undefined && today > median * 1.5;
  }
  private avgPerDay(total: number, days: number) {
    return days ? total / days : 0;
  }
  private isSpike(today: number, avg: number) {
    return today > avg * 2 && today > 0;
  }

  private enrichWithBudget(
    base: ReturnType<typeof this.computeBaseMetrics>,
    budgetValue: number,
    frameStart?: number,
    frameFinish?: number
  ): ExpenseSummary {
    const remaining = this.calcRemaining(base.monthlyIrregular, budgetValue);
    const percentUsed = this.calcPercentUsed(
      base.monthlyIrregular,
      budgetValue
    );
    const velocityState = this.calcVelocityState(
      base.monthlyIrregular,
      budgetValue,
      frameStart,
      frameFinish
    );
    const score = this.calcEnergyScore(base, velocityState);
    return { ...base, budget: budgetValue, remaining, percentUsed, ...score };
  }

  private calcRemaining(spent: number, budget: number) {
    return Math.max(budget - spent, 0);
  }
  private calcPercentUsed(spent: number, budget: number) {
    return budget ? Math.min((spent / budget) * 100, 100) : 0;
  }

  private calcVelocityState(
    spent: number,
    budget: number,
    frameStart?: number,
    frameFinish?: number
  ) {
    if (budget <= 0) return 0;
    const stats = this.monthProgressStats(frameStart, frameFinish);
    const daysPassed = Math.max(stats.daysPassed, 1);
    const currentVelocity = spent / daysPassed;
    const dailyBudget = budget / stats.daysInMonth;
    if (currentVelocity > dailyBudget * 1.2) return 2;
    if (currentVelocity > dailyBudget) return 1;
    return 0;
  }

  private calcEnergyScore(
    base: ReturnType<typeof this.computeBaseMetrics>,
    velocityState: number
  ) {
    const spikeFlags = [
      base.irregularSpike,
      base.extraSpike,
      base.nonEssentialSpike,
    ].filter(Boolean).length;
    const extraPctWeight = (base.extraPct || 0) / 100;
    const numeric = extraPctWeight * 4 + velocityState * 2 + spikeFlags;
    let emoji = '😇';
    if (numeric >= 9) emoji = '😱';
    else if (numeric >= 6) emoji = '😟';
    else if (numeric >= 3) emoji = '😐';
    else if (numeric >= 1.5) emoji = '🙂';
    return { energyScore: Math.round(numeric * 10) / 10, energyEmoji: emoji };
  }

  private newest(current: number | undefined, candidate: number): number {
    if (current === undefined) return candidate;
    return candidate > current ? candidate : current;
  }

  private daysSince(timestamp?: number): number | undefined {
    if (timestamp === undefined) return undefined;
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.floor((Date.now() - timestamp) / msPerDay);
  }

  private median(values: number[]): number | undefined {
    if (!values.length) return undefined;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
      return this.roundUp((sorted[mid - 1] + sorted[mid]) / 2);
    }
    return sorted[mid];
  }

  private roundUp(value: number): number {
    return Math.round(value * 100) / 100;
  }

  private generateBudgetChart(percentUsed: number): string {
    // Option 5: ASCII-safe compact bar. Example 43% => |====--|43%
    if (percentUsed <= 0) return '';
    const width = 7; // compact, readable
    const filled = Math.round((percentUsed / 100) * width);
    const bar = '='.repeat(filled) + '-'.repeat(width - filled);
    return `[${bar}] ${percentUsed.toFixed(0)}%`;
  }

  private generateBudgetIcon(percentUsed: number): string {
    const cfg = this.budgetIconConfig(percentUsed);
    return this.svgToDataUrl(this.buildBudgetSvg(cfg, percentUsed));
  }
  private budgetIconConfig(percentUsed: number) {
    const size = 64;
    const center = size / 2;
    const radius = 20;
    const angle = (percentUsed / 100) * 2 * Math.PI - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    const largeArc = percentUsed > 50 ? 1 : 0;
    const color = this.budgetColor(percentUsed);
    return { size, center, radius, x, y, largeArc, color };
  }
  private budgetColor(percentUsed: number) {
    if (percentUsed > 80) return '#F44336';
    if (percentUsed > 60) return '#FF9800';
    return '#4CAF50';
  }
  private buildBudgetSvg(cfg: any, percentUsed: number) {
    return `\n      <svg width="${cfg.size}" height="${cfg.size}" xmlns="http://www.w3.org/2000/svg">\n        <circle cx="${cfg.center}" cy="${cfg.center}" r="${cfg.radius}" fill="none" stroke="#E0E0E0" stroke-width="4"/>\n        ${percentUsed > 0 ? `<path d=\"M ${cfg.center} ${cfg.center - cfg.radius} A ${cfg.radius} ${cfg.radius} 0 ${cfg.largeArc} 1 ${cfg.x} ${cfg.y}\" fill=\"none\" stroke=\"${cfg.color}\" stroke-width=\"4\" stroke-linecap=\"round\"/>` : ''}\n        <text x="${cfg.center}" y="${cfg.center + 5}" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#333">${percentUsed.toFixed(0)}%</text>\n      </svg>\n    `;
  }
  private svgToDataUrl(svg: string) {
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  private generateDailyAverageChart(
    monthlyTotal: number,
    todaysTotal: number,
    frameStart: number | undefined,
    frameFinish: number | undefined,
    remaining?: number
  ): string {
    const ctx = this.dailyAverageContext(monthlyTotal, frameStart, frameFinish);
    const ratio = ctx.dailyAverage > 0 ? todaysTotal / ctx.dailyAverage : 0;
    const icon = this.dailyPaceIcon(ratio);
    let recommended = '';
    if (remaining !== undefined) {
      const stats = this.monthProgressStats(frameStart, frameFinish);
      if (stats.daysLeft > 0) {
        const rec = remaining / stats.daysLeft;
        if (rec > 0.01) recommended = ` | норм: ${rec.toFixed(1)}€/д`;
      }
    }
    return `${icon} Темп: ср.${ctx.dailyAverage.toFixed(1)}€/день${recommended}`;
  }
  private dailyAverageContext(
    monthlyTotal: number,
    frameStart?: number,
    frameFinish?: number
  ) {
    const stats = this.monthProgressStats(frameStart, frameFinish);
    const dailyAverage = monthlyTotal / Math.max(stats.daysPassed, 1);
    return { dailyAverage, projectedMonthly: dailyAverage * stats.daysInMonth };
  }
  private dailyPaceIcon(ratio: number) {
    if (ratio >= 2) return '🔥';
    if (ratio >= 1.5) return '📈';
    if (ratio >= 0.8) return '📊';
    if (ratio >= 0.3) return '📉';
    return '💰';
  }

  private generateSpendingVelocityChart(
    irregularSpent: number,
    budget: number,
    frameStart?: number,
    frameFinish?: number
  ): string {
    if (!budget || budget <= 0) return '⚡ Скорость: бюджет не установлен';
    const ctx = this.velocityContext(
      irregularSpent,
      budget,
      frameStart,
      frameFinish
    );
    const cls = this.velocityClassification(
      ctx.projectedOverrun,
      budget,
      ctx.currentVelocity,
      ctx.dailyBudget
    );
    return `${cls.icon} Скорость: ${cls.text}`;
  }
  private velocityContext(
    irregularSpent: number,
    budget: number,
    frameStart?: number,
    frameFinish?: number
  ) {
    const stats = this.monthProgressStats(frameStart, frameFinish);
    const dailyBudget = budget / stats.daysInMonth;
    const currentVelocity = irregularSpent / Math.max(stats.daysPassed, 1);
    const projectedOverrun = currentVelocity * stats.daysInMonth - budget;
    return { dailyBudget, currentVelocity, projectedOverrun };
  }
  private velocityClassification(
    overrun: number,
    budget: number,
    currentVelocity: number,
    dailyBudget: number
  ) {
    if (overrun > budget * 0.2) return { icon: '🚨', text: 'крит.' };
    if (overrun > 0) return { icon: '⚠️', text: 'прев.' };
    if (currentVelocity > dailyBudget * 0.9)
      return { icon: '📊', text: 'норм.' };
    return { icon: '💚', text: 'эконом.' };
  }

  // Message line helpers
  private lineHeader(s: ExpenseSummary) {
    return this.generateBudgetChart(s.percentUsed);
  }
  private lineToday(s: ExpenseSummary) {
    const irr =
      s.todaysTotal !== s.todaysIrregular
        ? ` (${s.todaysIrregular}€${s.irregularSpike ? ' ⚠️' : ''})`
        : '';
    return `• Сегодня: ${s.todaysTotal}€${irr}${this.lineBehaviorToday(s)}`;
  }
  private lineMonth(s: ExpenseSummary) {
    if (s.frameTotal !== undefined && s.frameTotal !== s.monthlyTotal) {
      return `• Период: ${s.frameTotal}€ (old: ${s.monthlyTotal}€)`;
    }
    return `• Период: ${s.frameTotal ?? s.monthlyTotal}€`;
  }
  private lineMonthlyIrregular(s: ExpenseSummary) {
    const p = this.buildPaceAndForecast(s);
    return `• Б: ${s.percentUsed.toFixed(0)}% П: ${p.line}% ${p.exhaustion ? ' ' + p.exhaustion : ''}`;
  }
  private lineBudget(s: ExpenseSummary) {
    const p = this.buildPaceAndForecast(s);
    return s.budget
      ? `• O: ${s.remaining.toFixed(0)}€ (d${p.daysLeft}) P: ${s.monthlyIrregular}€ Б: ${s.budget}€`
      : '';
  }
  private lineDailyAverage(s: ExpenseSummary) {
    return `• ${this.generateDailyAverageChart(
      s.monthlyIrregular,
      s.todaysTotal,
      s.dateFrameStart,
      s.dateFrameFinish,
      s.remaining
    )}`;
  }
  private lineVelocity(s: ExpenseSummary) {
    const base = this.generateSpendingVelocityChart(
      s.monthlyIrregular,
      s.budget,
      s.dateFrameStart,
      s.dateFrameFinish
    );
    const forecast = this.velocityForecastSnippet(s);
    return `• ${base}${forecast}`;
  }
  private lineExtra(s: ExpenseSummary) {
    return `• Экстра: ${s.extra}€${this.percentLine(s.extraPct)}${this.daysLine(s.daysSinceExtra)}${s.extraSpike ? ' ⚠️' : ''}`;
  }
  private lineNonEssential(s: ExpenseSummary) {
    return `• Хотелки: ${s.nonEssential}€${this.percentLine(s.nonEssentialPct)}${this.daysLine(s.daysSinceNonEssential)}${s.nonEssentialSpike ? ' ⚠️' : ''}`;
  }
  private lineEnergy(s: ExpenseSummary) {
    return s.energyEmoji
      ? `• Энергия: ${s.energyEmoji} (${s.energyScore?.toFixed(1)})`
      : '';
  }
}
