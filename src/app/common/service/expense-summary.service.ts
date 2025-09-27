import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';

import { BudgetDataService } from './budget-data.service';
import { NotificationService } from '../component/notification/notification.service';
// Removed direct expense scanning utilities; logic moved into model class.
import { ExpenseSummary, ExpensesSummary } from '../model/expense-summary/expense-summary.model';
import { composeSummaryMessage } from '../model/expense-summary/expense-summary.formatter';


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
        const summary = new ExpensesSummary(rolling, frameStart, frameFinish);
        return this.pushSummaryNotification(summary);
      })
    );
  }

  // (Removed budget computation helpers; logic now lives inside model class.)

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
    const message = composeSummaryMessage(summary); // externalized formatter
    const icon = this.generateBudgetIcon(summary.percentUsed);
    return this.notificationService.showBrowserNotification(title, message, {
      icon,
      badge: icon,
    });
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
