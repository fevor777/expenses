import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, first, map, tap } from 'rxjs/operators';

import { BudgetDataService } from './budget-data.service';
import { NotificationService } from '../component/notification/notification.service';
// Removed direct expense scanning utilities; logic moved into model class.
import { BudgetSummary } from '../model/budget-summary/budget-summary.model';
import { composeBudgetSummaryMessage } from '../model/budget-summary/budget-summary.br-notifi-formatter';
import { composeAppBudgetInfoMessage } from '../model/budget-summary/budget-summary.app-notifi-formatter';

export interface BudgetSummaryBuildResult {
  summary: BudgetSummary | null;
  error: string | null; // 'Бюджет не установлен' | 'Обновите дату начала бюджета.' | other future codes
}

@Injectable({
  providedIn: 'root',
})
export class BudgetSummaryService {
  constructor(
    private budgetDataService: BudgetDataService,
    private notificationService: NotificationService
  ) {}

  /**
   * Build current rolling frame summary. Returns null if now is outside of frame
   * OR if budget is not set (depending on consumer needs). Frame boundaries come
   * from BudgetDataService.
   */
  /** Result container carrying either a summary or an error message. */
  public static readonly BUILD_ERROR_OUT_OF_FRAME =
    'Обновите дату начала бюджета.';
  public static readonly BUILD_ERROR_NO_BUDGET = 'Бюджет не установлен';

  buildCurrentBudgetSummary(): Observable<BudgetSummaryBuildResult> {
    return this.budgetDataService.getExpensesWithBudget().pipe(
      first(),
      map(rolling => {
        if (!rolling.budget) {
          return {
            summary: null,
            error: BudgetSummaryService.BUILD_ERROR_NO_BUDGET,
          } as BudgetSummaryBuildResult;
        }
        const frameStart = rolling.dateFrame.start.toMillis();
        const frameFinish = rolling.dateFrame.finish.toMillis();
        const now = Date.now();
        if (now < frameStart || now > frameFinish) {
          return {
            summary: null,
            error: BudgetSummaryService.BUILD_ERROR_OUT_OF_FRAME,
          } as BudgetSummaryBuildResult;
        }
        const summary = new BudgetSummary(rolling, frameStart, frameFinish);
        return { summary, error: null } as BudgetSummaryBuildResult;
      })
    );
  }

  /** Send browser notification given a prepared summary snapshot */
  sendBrowserNotificationByBudgetSummary(
    result: BudgetSummaryBuildResult
  ): Observable<void> {
    if (!result.summary) {
      const msg = result.error || BudgetSummaryService.BUILD_ERROR_OUT_OF_FRAME;
      return this.notificationService.showBrowserNotification(
        'Сводка расходов',
        msg,
        {
          icon: undefined as any,
          tag: 'app-expenses-budget-summary',
          renotify: true,
        } as any
      );
    }
    return this.pushBudgetSummaryNotification(result.summary);
  }

  /** Send in-app (toast) notification given a prepared summary snapshot */
  sendAppNotificationByBudgetSummary(result: BudgetSummaryBuildResult): void {
    if (!result.summary) {
      this.notificationService.showMessage(
        result.error || 'Неизвестная ошибка',
        'warning'
      );
    }
    const summary = result.summary;
    const msg = composeAppBudgetInfoMessage(summary);
    const remaining = summary.remaining;
    const percentUsed = summary.percentUsed;
    this.notificationService.showMessage(
      msg,
      remaining <= 0 ? 'error' : percentUsed > 80 ? 'warning' : 'info'
    );
  }

  /** Backwards-compatible convenience wrappers (can be removed after migration) */
  sendBrowserNotificationWithBudgetSummary(): Observable<void> {
    return this.buildCurrentBudgetSummary().pipe(
      switchMap(result => this.sendBrowserNotificationByBudgetSummary(result))
    );
  }

  showAppBudgetInfo(): Observable<BudgetSummaryBuildResult> {
    return this.buildCurrentBudgetSummary().pipe(
      tap(result => this.sendAppNotificationByBudgetSummary(result))
    );
  }

  private pushBudgetSummaryNotification(
    summary: BudgetSummary
  ): Observable<void> {
    const title = 'Сводка расходов';
    const message = composeBudgetSummaryMessage(summary); // externalized formatter
    const icon = this.generateBudgetIcon(summary.percentUsed);
    return this.notificationService.showBrowserNotification(title, message, {
      icon,
      badge: icon,
      tag: 'app-expenses-budget-summary',
      renotify: true,
    } as any);
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
}
