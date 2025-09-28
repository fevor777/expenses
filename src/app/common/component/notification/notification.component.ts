import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { NotificationService } from './notification.service';
import { ExpenseSummaryService } from '../../service/expense-summary.service';
import { ExpenseService } from '../../service/expense.service';

type NotificationVariant = 'info' | 'success' | 'error' | 'warning';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class NotificationComponent implements OnDestroy {
  message = '';
  show = false;
  hiding = false;
  variant: NotificationVariant = 'info';
  icon: string | null = null;
  // extra UI for expense-added context
  isExpenseAddedContext = false;
  lastExpense: any = null; // made public for template binding
  editableDescription: string = '';
  savingDescription = false;

  private hideTimeout: any;
  private autoCloseMs = 60000; // shorter default for UX

  private readonly destroySubject: Subject<void> = new Subject();

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private expenseSummaryService: ExpenseSummaryService,
    private expenseService: ExpenseService
  ) {
    this.notificationService.message$
      .pipe(takeUntil(this.destroySubject))
      .subscribe((payload: any) => {
        this.lastExpense = null;
        this.isExpenseAddedContext = false;
        // Support both legacy string and new object payload
        if (typeof payload === 'string') {
          this.showMessage(payload, 'info');
        } else if (
          payload &&
          typeof payload === 'object' &&
          'message' in payload
        ) {
          this.showMessage(payload.message, (payload.type as any) || 'info');
          // detect context
          this.isExpenseAddedContext = payload.context === 'expense-added';
          this.lastExpense = this.isExpenseAddedContext
            ? payload.expense
            : null;
          if (this.isExpenseAddedContext && this.lastExpense) {
            this.editableDescription = this.lastExpense.description || '';
          } else {
            this.editableDescription = '';
          }
        }
      });

    this.notificationService.hide$
      .pipe(takeUntil(this.destroySubject))
      .subscribe(() => this.startHide());
  }

  showMessage(message: string, variant: NotificationVariant = 'info') {
    this.clearPending();
    this.message = message;
    this.variant = variant;
    this.icon = this.resolveIcon(variant);
    this.hiding = false;
    this.show = true;
    this.hideTimeout = setTimeout(() => this.startHide(), this.autoCloseMs);
  }

  appendMark(mark: string) {
    if (!this.isExpenseAddedContext || !this.lastExpense) return;
    const desc: string = (this.lastExpense.description || '').trim();
    // Prevent duplicate marks
    if (desc.endsWith(mark.trim())) return; // avoid duplicates irrespective of leading space
    const updated = desc + mark;
    const originalDesc = desc;
    this.lastExpense.description = updated;
    // optimistic UI update
    try {
      // this.message = this.message.replace(originalDesc, updated);
    } catch {}
    // Persist to backend if id present
    if (this.lastExpense.id) {
      this.expenseService
        .updateExpense({ ...this.lastExpense })
        .pipe(takeUntil(this.destroySubject))
        .subscribe();
    }
  }

  saveDescription() {
    this.savingDescription = true;
    if (this.lastExpense.id) {
      this.expenseService
        .updateExpense({ ...this.lastExpense })
        .pipe(takeUntil(this.destroySubject))
        .subscribe({
          next: () => (this.savingDescription = false),
          error: () => (this.savingDescription = false),
        });
    } else {
      this.savingDescription = false;
    }
  }

  private resolveIcon(v: NotificationVariant): string | null {
    switch (v) {
      case 'success':
        return '&#10003;'; // check mark
      case 'error':
        return '&#9888;'; // warning symbol (triangle) could use 26A0; or heavy X
      case 'warning':
        return '&#9888;';
      case 'info':
      default:
        return '&#9432;'; // info symbol
    }
  }

  private startHide() {
    if (!this.show) return;
    this.hiding = true;
    // allow animation to finish
    setTimeout(() => {
      this.show = false;
      this.hiding = false;
    }, 250);
  }

  onCloseNotification() {
    this.startHide();
  }

  onNavigateDetails() {
    this.router.navigate(['/details']);
    this.startHide();
  }

  onSendBrowserNotification() {
    if (this.notificationService.summaryBuildResultCache) {
      this.expenseSummaryService
        .sendBrowserNotificationBySummary(
          this.notificationService.summaryBuildResultCache
        )
        .pipe(takeUntil(this.destroySubject))
        .subscribe();
      this.notificationService.summaryBuildResultCache = null;
    } else {
      this.expenseSummaryService
        .sendBrowserNotificationWithBudgetSummary()
        .pipe(takeUntil(this.destroySubject))
        .subscribe();
    }
  }

  private clearPending() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  ngOnDestroy(): void {
    this.clearPending();
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
