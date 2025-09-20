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
        }

        const message =
          `${budgetChart}\n` +
          `Сегодня: ${summary.todaysTotal}€ (${summary.todaysIrregular}€)\n` +
          `Месяц: ${summary.monthlyTotal}€\n` +
          `Нерегул.: ${summary.monthlyIrregular}€ (${summary.percentUsed.toFixed(0)}%${paceLine})` +
          `\nЛишние(!): ${summary.extra}€` +
          `\nНеобязательные(?,!): ${summary.nonEssential}€` +
          (summary.budget
            ? `\nБюджет: ${summary.budget}€ | Ост.: ${summary.remaining.toFixed(0)}€ - ${daysLeft}дн`
            : '') +
          `\n ${dailyAvgChart}\n` +
          `${velocityChart}\n`;

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
        map(expenses => ({
          todaysTotal: this.getTodaysTotal(expenses),
          todaysIrregular: this.getTodaysIrregular(expenses),
          monthlyTotal: this.getMonthlyTotal(expenses),
          monthlyIrregular: this.getMonthlyIrregularTotal(expenses),
          extra: this.getExtraTotal(expenses),
          nonEssential: this.getNonEssentialTotal(expenses),
        })),
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

              return {
                ...totals,
                budget: budgetValue,
                remaining,
                percentUsed,
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
