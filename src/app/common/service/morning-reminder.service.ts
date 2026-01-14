import { Injectable } from '@angular/core';
import { Observable, of, switchMap, first, map } from 'rxjs';
import { BudgetDataService } from './budget-data.service';
import { NotificationService } from '../component/notification/notification.service';
import { createBudgetSummary } from '../model/budget-summary/budget-summary.factory';

const STORAGE_KEY = 'morning-reminder-last-shown';
const MORNING_START_HOUR = 6;  // Показывать с 6:00
const MORNING_END_HOUR = 11;   // До 11:00

export interface MorningReminderConfig {
  enabled: boolean;
  startHour: number;
  endHour: number;
}

@Injectable({ providedIn: 'root' })
export class MorningReminderService {
  constructor(
    private budgetDataService: BudgetDataService,
    private notificationService: NotificationService
  ) {}

  /**
   * Check if morning reminder should be shown and display it.
   * Call this on app initialization.
   */
  checkAndShowMorningReminder(): Observable<boolean> {
    if (!this.shouldShowReminder()) {
      return of(false);
    }

    return this.budgetDataService.getExpensesWithBudget().pipe(
      first(),
      switchMap(data => {
        if (!data.budget?.value) {
          return of(false);
        }

        const frameStart = data.dateFrame.start.toMillis();
        const frameFinish = data.dateFrame.finish.toMillis();
        const now = Date.now();

        // Check if we're within the budget period
        if (now < frameStart || now > frameFinish) {
          return of(false);
        }

        const summary = createBudgetSummary(
          {
            expenses: data.expenses,
            budget: data.budget,
            dateFrame: data.dateFrame,
          },
          frameStart,
          frameFinish
        );

        const message = this.composeMorningMessage(summary);
        this.markAsShown();

        return this.notificationService
          .showBrowserNotification('☀️ Доброе утро!', message, {
            tag: 'morning-budget-reminder',
            requireInteraction: false,
          } as NotificationOptions)
          .pipe(map(() => true));
      })
    );
  }

  /**
   * Show in-app morning notification (for when browser notifications are blocked)
   */
  showInAppMorningReminder(): Observable<boolean> {
    if (!this.shouldShowReminder()) {
      return of(false);
    }

    return this.budgetDataService.getExpensesWithBudget().pipe(
      first(),
      map(data => {
        if (!data.budget?.value) {
          return false;
        }

        const frameStart = data.dateFrame.start.toMillis();
        const frameFinish = data.dateFrame.finish.toMillis();
        const now = Date.now();

        if (now < frameStart || now > frameFinish) {
          return false;
        }

        const summary = createBudgetSummary(
          {
            expenses: data.expenses,
            budget: data.budget,
            dateFrame: data.dateFrame,
          },
          frameStart,
          frameFinish
        );

        const lines = this.composeMorningMessageLines(summary);
        this.notificationService.showMessage(lines, 'info');
        this.markAsShown();
        return true;
      })
    );
  }

  private shouldShowReminder(): boolean {
    const config = this.getConfig();
    if (!config.enabled) {
      return false;
    }

    const now = new Date();
    const hour = now.getHours();

    // Check if within morning window
    if (hour < config.startHour || hour >= config.endHour) {
      return false;
    }

    // Check if already shown today
    const lastShown = localStorage.getItem(STORAGE_KEY);
    if (lastShown) {
      const lastDate = new Date(parseInt(lastShown, 10));
      const today = new Date();
      if (
        lastDate.getFullYear() === today.getFullYear() &&
        lastDate.getMonth() === today.getMonth() &&
        lastDate.getDate() === today.getDate()
      ) {
        return false; // Already shown today
      }
    }

    return true;
  }

  private markAsShown(): void {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  }

  private composeMorningMessage(summary: any): string {
    const lines: string[] = [];

    // Daily budget
    const dailyBudget = summary.budgetPerDay || 0;
    const needPerDay = summary.needPerDay || dailyBudget;
    
    lines.push(`💰 Сегодня можно: ${this.fmt(needPerDay)}€`);

    // Remaining budget
    if (summary.remaining !== undefined) {
      lines.push(`📊 Осталось: ${this.fmt(summary.remaining)}€ из ${this.fmt(summary.budget)}€`);
    }

    // Days left
    if (summary.daysLeft !== undefined) {
      lines.push(`📅 Дней до конца: ${summary.daysLeft}`);
    }

    // Yesterday comparison (if available from meta)
    if (summary.dailyAverage) {
      const comparison = needPerDay >= summary.dailyAverage ? '✅ в норме' : '⚠️ экономь';
      lines.push(`Темп: ${comparison}`);
    }

    return lines.join('\n');
  }

  private composeMorningMessageLines(summary: any): string[] {
    const lines: string[] = [];

    const dailyBudget = summary.budgetPerDay || 0;
    const needPerDay = summary.needPerDay || dailyBudget;

    lines.push(`☀️ Доброе утро!`);
    lines.push(`💰 Дневной лимит: ${this.fmt(needPerDay)}€`);

    if (summary.remaining !== undefined) {
      lines.push(`📊 Осталось: ${this.fmt(summary.remaining)}€`);
    }

    if (summary.percentUsed !== undefined) {
      const emoji = summary.percentUsed > 80 ? '🔴' : summary.percentUsed > 60 ? '🟡' : '🟢';
      lines.push(`${emoji} Бюджет: ${summary.percentUsed.toFixed(0)}%`);
    }

    return lines;
  }

  private fmt(n: number): string {
    if (n === undefined || isNaN(n)) return '0';
    return Math.abs(n - Math.round(n)) < 0.05
      ? Math.round(n).toString()
      : n.toFixed(1);
  }

  // Configuration management
  getConfig(): MorningReminderConfig {
    const stored = localStorage.getItem('morning-reminder-config');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return {
      enabled: true,
      startHour: MORNING_START_HOUR,
      endHour: MORNING_END_HOUR,
    };
  }

  saveConfig(config: MorningReminderConfig): void {
    localStorage.setItem('morning-reminder-config', JSON.stringify(config));
  }

  /** Reset the "shown today" flag (for testing) */
  resetTodayFlag(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
