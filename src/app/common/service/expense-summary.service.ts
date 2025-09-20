import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { ExpenseService } from './expense.service';
import { DateFilterService } from '../component/filter/date/date-filter.service';
import { IrregularBudgetService } from './irregular-budget.service';
import { NotificationService } from '../component/notification/notification.service';
import { getCategoryById } from '../model/categories';
import { Expense } from '../model/expense.model';

export interface ExpenseSummary {
  todaysTotal: number;
  todaysIrregular: number;
  monthlyTotal: number;
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
}

@Injectable({
  providedIn: 'root',
})
export class ExpenseSummaryService {
  constructor(
    private expenseService: ExpenseService,
    private dateFilterService: DateFilterService,
    private irregularBudgetService: IrregularBudgetService,
    private notificationService: NotificationService
  ) {}

  sendBrowserNotificationSummary(): Observable<void> {
    // One-shot summary: take(1) ensures we don't keep an open subscription that would
    // fire a new browser notification on every subsequent expenses change.
    return this.getExpenseSummary().pipe(
      take(1),
      switchMap(summary => {
        const title = 'Сводка расходов';
        const budgetChart = this.generateBudgetChart(summary.percentUsed);
        const dailyAvgChart = this.generateDailyAverageChart(
          summary.monthlyIrregular,
          summary.todaysTotal
        );
        const velocityChart = this.generateSpendingVelocityChart(
          summary.monthlyIrregular,
          summary.budget
        );

        // Month elapsed vs budget usage pace comparison
        let paceLine = '';
        let daysLeft = 0;
        let exhaustionLine = '';
        if (summary.budget > 0) {
          const now = new Date();
          // total days in current month
          const daysInMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0
          ).getDate();
          const daysPassed = now.getDate();
          const monthElapsedPct = (daysPassed / daysInMonth) * 100;
          daysLeft = Math.max(daysInMonth - daysPassed, 0);
          paceLine = ` - Пер.: ${monthElapsedPct.toFixed(0)}%`;

          // Forecast date of budget exhaustion (only if not already exceeded)
          if (summary.monthlyIrregular < summary.budget && summary.monthlyIrregular > 0) {
            const currentVelocity = summary.monthlyIrregular / daysPassed; // €/day
            if (currentVelocity > 0) {
              const remainingToSpend = summary.budget - summary.monthlyIrregular;
              const daysToExhaust = remainingToSpend / currentVelocity; // could be fractional
              const exhaustDate = new Date(now.getTime());
              exhaustDate.setDate(now.getDate() + Math.ceil(daysToExhaust));
              // Clamp to month end
              if (exhaustDate.getMonth() !== now.getMonth()) {
                exhaustDate.setFullYear(now.getFullYear(), now.getMonth(), daysInMonth);
              }
              const dd = exhaustDate.getDate().toString().padStart(2, '0');
              const mm = (exhaustDate.getMonth() + 1).toString().padStart(2, '0');
              exhaustionLine = `F: ${dd}.${mm}`;
            }
          }
        }

  const extraLinePct = summary.extraPct !== undefined ? ` (${summary.extraPct.toFixed(0)}%)` : '';
  const nonEssentialLinePct = summary.nonEssentialPct !== undefined ? ` (${summary.nonEssentialPct.toFixed(0)}%)` : '';
  const extraDays = summary.daysSinceExtra !== undefined && summary.daysSinceExtra >= 0 ? ` d${summary.daysSinceExtra}` : '';
  const nonEssentialDays = summary.daysSinceNonEssential !== undefined && summary.daysSinceNonEssential >= 0 ? ` d${summary.daysSinceNonEssential}` : '';
        const message =
          `${budgetChart}\n` +
          `- Сегодня: ${summary.todaysTotal}€ (${summary.todaysIrregular}€${summary.irregularSpike ? ' ⚠️' : ''})\n` +
          `- Месяц: ${summary.monthlyTotal}€\n` +
          `- Нерегул.: ${summary.monthlyIrregular}€ (${summary.percentUsed.toFixed(0)}%${paceLine})` +
          `\n- Лишние(!): ${summary.extra}€${extraLinePct}${extraDays}${summary.extraSpike ? ' ⚠️' : ''}` +
          `\n- Необязат.: ${summary.nonEssential}€${nonEssentialLinePct}${nonEssentialDays}` +
          (summary.nonEssentialSpike ? ' ⚠️' : '') +
          (summary.budget
            ? `\n- Бюд: ${summary.budget}€ Ост: ${summary.remaining.toFixed(0)}€ дн: ${daysLeft}${exhaustionLine ? ' ' + exhaustionLine : ''}`
            : '') +
          `\n${dailyAvgChart}\n` +
          `${velocityChart}\n` +
          (summary.energyEmoji ? `- Энергия: ${summary.energyEmoji} (${summary.energyScore?.toFixed(1)})\n` : '');

        // Generate a data URL icon based on budget percentage
        const icon = this.generateBudgetIcon(summary.percentUsed);

        return this.notificationService.showBrowserNotification(
          title,
          message,
          {
            icon: icon,
            badge: icon,
          }
        );
      })
    );
  }

  getExpenseSummary(): Observable<ExpenseSummary> {
    return this.expenseService
      .getExpenses(this.dateFilterService.getInitialMonthValue())
      .pipe(
        map(expenses => {
          const monthlyIrregular = this.getMonthlyIrregularTotal(expenses);
          const extra = this.getExtraTotal(expenses);
          const nonEssential = this.getNonEssentialTotal(expenses);
          const extraPct = monthlyIrregular > 0 ? Math.min((extra / monthlyIrregular) * 100, 100) : 0;
          const nonEssentialPct = monthlyIrregular > 0 ? Math.min((nonEssential / monthlyIrregular) * 100, 100) : 0;
          const daysSinceExtra = this.getDaysSinceMarker(expenses, '!');
          const daysSinceNonEssential = this.getDaysSinceNonEssential(expenses);
          const todaysIrregular = this.getTodaysIrregular(expenses);
          const todaysExtra = this.getTodaysExtra(expenses);
          const dailyIrregularBuckets = this.getDailyIrregularBuckets(expenses);
          const medianDailyIrregular = this.median(dailyIrregularBuckets);
          const irregularSpike = medianDailyIrregular !== undefined && todaysIrregular > medianDailyIrregular * 1.5;
          const averageDailyExtra = this.getAverageDailyExtra(expenses);
          const extraSpike = todaysExtra > averageDailyExtra * 2 && todaysExtra > 0; // ensure positive today
          const todaysNonEssential = this.getTodaysNonEssential(expenses);
          const averageDailyNonEssential = this.getAverageDailyNonEssential(expenses);
          const nonEssentialSpike = todaysNonEssential > averageDailyNonEssential * 2 && todaysNonEssential > 0;
          return {
            todaysTotal: this.getTodaysTotal(expenses),
            todaysIrregular,
            monthlyTotal: this.getMonthlyTotal(expenses),
            monthlyIrregular,
            extra,
            extraPct,
            nonEssential,
            nonEssentialPct,
            daysSinceExtra,
            daysSinceNonEssential,
            medianDailyIrregular,
            irregularSpike,
            todaysExtra,
            averageDailyExtra: this.roundUp(averageDailyExtra),
            extraSpike,
            todaysNonEssential,
            averageDailyNonEssential: this.roundUp(averageDailyNonEssential),
            nonEssentialSpike,
          };
        }),
        switchMap(totals =>
          this.irregularBudgetService.getValue().pipe(
            map(budget => {
              const budgetValue = budget || 0;
              const remaining = Math.max(
                budgetValue - totals.monthlyIrregular,
                0
              );
              const percentUsed = budgetValue
                ? Math.min((totals.monthlyIrregular / budgetValue) * 100, 100)
                : 0;

              // Velocity state (0 good, 1 warning, 2 critical)
              let velocityState = 0;
              if (budgetValue > 0) {
                const now = new Date();
                const daysPassed = now.getDate();
                const currentVelocity = totals.monthlyIrregular / Math.max(daysPassed, 1);
                const dailyBudget = budgetValue / new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                if (currentVelocity > dailyBudget * 1.2) velocityState = 2; // >120%
                else if (currentVelocity > dailyBudget) velocityState = 1; // over but <120%
              }

              const spikeFlags = [totals.irregularSpike, totals.extraSpike, totals.nonEssentialSpike].filter(Boolean).length;
              const extraPctWeight = (totals.extraPct || 0) / 100; // 0..1
              const score = extraPctWeight * 4 + velocityState * 2 + spikeFlags; // weighted composite
              let emoji = '😇';
              if (score >= 9) emoji = '😱';
              else if (score >= 6) emoji = '😟';
              else if (score >= 3) emoji = '😐';
              else if (score >= 1.5) emoji = '🙂';

              return {
                ...totals,
                budget: budgetValue,
                remaining,
                percentUsed,
                energyScore: Math.round(score * 10) / 10,
                energyEmoji: emoji,
              };
            })
          )
        )
      );
  }

  getNonEssentialTotal(expenses: Expense[]): number {
    return expenses
      .filter(
        expense =>
          expense?.description?.includes('?') ||
          expense?.description?.includes('!')
      )
      .reduce((total, expense) => this.roundUp(total + expense.amount), 0);
  }

  private getExtraTotal(expenses: Expense[]): number {
    return expenses
      .filter(expense => expense?.description?.includes('!'))
      .reduce((total, expense) => this.roundUp(total + expense.amount), 0);
  }

  private getTodaysTotal(expenses: Expense[]): number {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();

    return expenses
      .filter(expense => expense.date >= startOfDay)
      .reduce((total, expense) => this.roundUp(total + expense.amount), 0);
  }

  private getTodaysIrregular(expenses: Expense[]): number {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();

    return expenses
      .filter(expense => expense.date >= startOfDay)
      .filter(expense => getCategoryById(expense.category)?.includeInBalance)
      .reduce((total, expense) => this.roundUp(total + expense.amount), 0);
  }

  private getMonthlyTotal(expenses: Expense[]): number {
    return expenses.reduce(
      (total, expense) => this.roundUp(total + expense.amount),
      0
    );
  }

  private getMonthlyIrregularTotal(expenses: Expense[]): number {
    return expenses
      .filter(expense => getCategoryById(expense.category)?.includeInBalance)
      .reduce((total, expense) => this.roundUp(total + expense.amount), 0);
  }

  private getTodaysNonEssential(expenses: Expense[]): number {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();
    return expenses
      .filter(e => e.date >= startOfDay)
      .filter(e => e.description?.includes('!') || e.description?.includes('?'))
      .reduce((sum, e) => this.roundUp(sum + e.amount), 0);
  }

  private getAverageDailyNonEssential(expenses: Expense[]): number {
    const now = new Date();
    const daysPassed = now.getDate();
    if (daysPassed === 0) return 0;
    const total = expenses
      .filter(e => e.description?.includes('!') || e.description?.includes('?'))
      .reduce((sum, e) => this.roundUp(sum + e.amount), 0);
    return total / daysPassed;
  }

  private getTodaysExtra(expenses: Expense[]): number {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();
    return expenses
      .filter(e => e.date >= startOfDay)
      .filter(e => e.description?.includes('!'))
      .reduce((sum, e) => this.roundUp(sum + e.amount), 0);
  }

  private getDailyIrregularBuckets(expenses: Expense[]): number[] {
    // Map of day (date number) -> irregular spend
    const map = new Map<number, number>();
    expenses
      .filter(e => getCategoryById(e.category)?.includeInBalance)
      .forEach(e => {
        const d = new Date(e.date);
        const day = d.getDate();
        const current = map.get(day) || 0;
        map.set(day, this.roundUp(current + e.amount));
      });
    return Array.from(map.values());
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

  private getAverageDailyExtra(expenses: Expense[]): number {
    // Average extra per elapsed day that had any extra? Or per elapsed calendar day? Use elapsed calendar days for consistency.
    const now = new Date();
    const daysPassed = now.getDate();
    if (daysPassed === 0) return 0;
    const totalExtra = expenses
      .filter(e => e.description?.includes('!'))
      .reduce((sum, e) => this.roundUp(sum + e.amount), 0);
    return totalExtra / daysPassed;
  }

  private getDaysSinceMarker(expenses: Expense[], marker: string): number | undefined {
    const now = Date.now();
    // Find most recent expense containing marker in description
    const last = expenses
      .filter(e => e.description?.includes(marker))
      .sort((a, b) => b.date - a.date)[0];
    if (!last) return undefined;
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.floor((now - last.date) / msPerDay);
  }

  private getDaysSinceNonEssential(expenses: Expense[]): number | undefined {
    const now = Date.now();
    const last = expenses
      .filter(e => e.description?.includes('!') || e.description?.includes('?'))
      .sort((a, b) => b.date - a.date)[0];
    if (!last) return undefined;
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.floor((now - last.date) / msPerDay);
  }

  private roundUp(value: number): number {
    return Math.round(value * 100) / 100;
  }

  private generateBudgetChart(percentUsed: number): string {
    if (percentUsed === 0) return '';

    const barLength = 10;
    const filled = Math.round((percentUsed / 100) * barLength);
    const empty = barLength - filled;

    const filledBar = '●'.repeat(filled);
    const emptyBar = '○'.repeat(empty);

    return `[${filledBar}${emptyBar}] ${percentUsed.toFixed(0)}%`;
  }

  private generateBudgetIcon(percentUsed: number): string {
    // Create a simple circular chart as SVG and convert to data URL
    const size = 64;
    const center = size / 2;
    const radius = 20;

    // Calculate the arc path for the used percentage
    const angle = (percentUsed / 100) * 2 * Math.PI - Math.PI / 2; // Start from top
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    const largeArc = percentUsed > 50 ? 1 : 0;

    // Choose colors based on percentage
    let color = '#4CAF50'; // Green for good
    if (percentUsed > 80)
      color = '#F44336'; // Red for high usage
    else if (percentUsed > 60) color = '#FF9800'; // Orange for medium usage

    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="#E0E0E0" stroke-width="4"/>
        ${
          percentUsed > 0
            ? `
          <path d="M ${center} ${center - radius} A ${radius} ${radius} 0 ${largeArc} 1 ${x} ${y}" 
                fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
        `
            : ''
        }
        <text x="${center}" y="${center + 5}" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#333">
          ${percentUsed.toFixed(0)}%
        </text>
      </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  private generateDailyAverageChart(
    monthlyTotal: number,
    todaysTotal: number
  ): string {
    const currentDate = new Date();
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const daysPassed = currentDate.getDate();

    const dailyAverage = monthlyTotal / daysPassed; // average based on days passed
    const projectedMonthly = dailyAverage * daysInMonth;

    // Visual indicator for daily spending pace
    const todayVsAverage = dailyAverage > 0 ? todaysTotal / dailyAverage : 0;
    let paceIcon = '📊';

    if (todayVsAverage >= 2) {
      paceIcon = '🔥'; // Very high spending day
    } else if (todayVsAverage >= 1.5) {
      paceIcon = '📈'; // High spending day
    } else if (todayVsAverage >= 0.8) {
      paceIcon = '📊'; // Normal spending day
    } else if (todayVsAverage >= 0.3) {
      paceIcon = '📉'; // Low spending day
    } else {
      paceIcon = '💰'; // Very low/no spending day
    }

    return `${paceIcon} Темп: ср.${dailyAverage.toFixed(1)}€/день (прогноз: ${projectedMonthly.toFixed(0)}€)`;
  }

  private generateSpendingVelocityChart(
    irregularSpent: number,
    budget: number
  ): string {
    if (!budget || budget <= 0) {
      return '⚡ Скорость: бюджет не установлен';
    }

    const currentDate = new Date();
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const daysPassed = currentDate.getDate();
    const daysRemaining = daysInMonth - daysPassed;

    const dailyBudget = budget / daysInMonth;
    const currentVelocity = irregularSpent / daysPassed; // current daily spending rate
    const projectedOverrun = currentVelocity * daysInMonth - budget;

    // Visual velocity indicator
    let velocityIcon = '🚀';
    let velocityText = '';

    if (projectedOverrun > budget * 0.2) {
      // >120% of budget
      velocityIcon = '🚨';
      velocityText = `критичная (+${projectedOverrun.toFixed(0)}€)`;
    } else if (projectedOverrun > 0) {
      // Over budget but <120%
      velocityIcon = '⚠️';
      velocityText = `превышение (+${projectedOverrun.toFixed(0)}€)`;
    } else if (currentVelocity > dailyBudget * 0.9) {
      // Close to budget
      velocityIcon = '📊';
      velocityText = `норма (${currentVelocity.toFixed(1)}€/д)`;
    } else {
      // Under budget
      velocityIcon = '💚';
      const saving = Math.abs(projectedOverrun);
      velocityText = `экономия (-${saving.toFixed(0)}€)`;
    }

    return ` ${velocityIcon} Скорость: ${velocityText}`;
  }
}
