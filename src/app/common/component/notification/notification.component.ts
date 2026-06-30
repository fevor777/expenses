import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { NotificationService } from './notification.service';
import { BudgetSummaryService } from '../../service/budget-summary.service';
import { ExpenseService } from '../../service/expense.service';
import { PeriodSummaryIconComponent } from '../period-summary-icon/period-summary-icon.component';
import { TagService } from '../../service/tag.service';
import { TagSelectorComponent } from '../tag-selector/tag-selector.component';

type NotificationVariant = 'info' | 'success' | 'error' | 'warning';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, PeriodSummaryIconComponent, TagSelectorComponent],
})
export class NotificationComponent implements OnDestroy {
  message = '';
  messageList: string[] = [];
  show = false;
  hiding = false;
  variant: NotificationVariant = 'info';
  icon: string | null = null;
  // extra UI for expense-added context
  isExpenseAddedContext = false;
  lastExpense: any = null; // made public for template binding
  tagNamesById: Record<string, string> = {};
  editableDescription: string = '';
  savingDescription = false;
  // animation flag for newly added budget info icon
  animateIconsIn = false;

  private hideTimeout: any;
  private autoCloseMs = 120000; // shorter default for UX

  private readonly destroySubject: Subject<void> = new Subject();

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private expenseSummaryService: BudgetSummaryService,
    private expenseService: ExpenseService,
    private tagService: TagService
  ) {
    this.tagService
      .getTags()
      .pipe(takeUntil(this.destroySubject))
      .subscribe(tags => {
        this.tagNamesById = (tags || []).reduce(
          (acc, tag) => ({ ...acc, [tag.id]: tag.name }),
          {}
        );
      });

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
          'message' in payload && !Array.isArray(payload.message)
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
        } else if (Array.isArray(payload.message) && payload?.message.length > 0) {
          this.lastExpense = null;
          this.editableDescription = '';
          this.isExpenseAddedContext = false;
          this.showMessageList(payload.message);
        }
      });

    this.notificationService.hide$
      .pipe(takeUntil(this.destroySubject))
      .subscribe(() => this.startHide());
  }

  showMessage(message: string, variant: NotificationVariant = 'info') {
    this.clearPending();
    this.messageList = [];
    this.message = message;
    this.setUtilValues(variant);
  }

  showMessageList(
    messageList: string[],
    variant: NotificationVariant = 'info'
  ) {
    this.clearPending();
    this.message = '';
    this.messageList = messageList;
    this.setUtilValues(variant);
  }

  get expenseTagNames(): string[] {
    if (!this.lastExpense?.tagIds?.length) {
      return [];
    }

    return this.lastExpense.tagIds
      .map((tagId: string) => this.tagNamesById[tagId] || tagId)
      .filter(Boolean);
  }

  onTagIdsChange(tagIds: string[]): void {
    if (!this.lastExpense) {
      return;
    }

    this.lastExpense = {
      ...this.lastExpense,
      tagIds: tagIds || [],
    };

    if (!this.lastExpense.id) {
      return;
    }

    this.savingDescription = true;
    this.expenseService
      .updateExpense({ ...this.lastExpense })
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: () => (this.savingDescription = false),
        error: () => (this.savingDescription = false),
      });
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
      this.message = '';
      this.messageList = [];
      this.notificationService.isShown = false;
      this.hiding = false;
    }, 250);
  }

  onCloseNotification() {
    this.notificationService.updateCloseeNotificationSubj();
    this.startHide();
  }

  onNavigateDetails() {
    this.router.navigate(['/period-summary']);
    this.startHide();
  }

  onSendBrowserNotification() {
    if (this.notificationService.summaryBuildResultCache) {
      this.expenseSummaryService
        .sendBrowserNotificationByBudgetSummary(
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

  private setUtilValues(variant: NotificationVariant): void {
    this.variant = variant;
    this.icon = this.resolveIcon(variant);
    this.hiding = false;
    this.show = true;
    this.notificationService.isShown = true;
    this.hideTimeout = setTimeout(() => this.startHide(), this.autoCloseMs);
    this.animateIconsIn = true;
    setTimeout(() => (this.animateIconsIn = false), 400);
  }

  onBudgetInfoIconClick(): void {
    this.expenseSummaryService
      .showAppBudgetInfo()
      .pipe(takeUntil(this.destroySubject))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.clearPending();
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
