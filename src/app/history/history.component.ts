import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  first,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

import { DateFilterService } from '../common/component/filter/date/date-filter.service';
import { DateFrame } from '../common/component/filter/date/dateFrame.model';
import { Mode } from '../common/component/filter/date/dateFrame.model';
import {
  MultiFilter,
  MultiFilterComponent,
} from '../common/component/filter/multi/multi-filter.component';
import { getCategoryById } from '../common/model/categories';
import { Expense } from '../common/model/expense.model';
import { BalanceService } from '../common/service/balance.service';
import { ExpenseService } from '../common/service/expense.service';
import { HistoryExpense } from './history-expense';
import { HistoryItemComponent } from './item/history-item.component';
import { GLOBAL_SWIPE_LENGTH } from '../constants';
import { ExpenseSummaryService } from '../common/service/expense-summary.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    MultiFilterComponent,
    HistoryItemComponent,
  ],
})
export class HistoryComponent implements OnInit, OnDestroy {
  expenses$: Observable<HistoryExpense[]>;
  totalAmount: number = 0;
  totalAmountPerDays: Map<number, number> = new Map();
  // Coverage metrics for multi-filter summary (active buckets / total buckets • expense entries)
  activeBucketCount: number = 0;
  totalBucketCount: number = 0;
  expenseEntryCount: number = 0;

  defaultDateValue: DateFrame;
  defaultFilter: MultiFilter;
  currentFilter: MultiFilter;

  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private touchEndX: number = 0;
  private touchEndY: number = 0;

  private temporaryDate: number = 0;

  private readonly destroySubject: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private expenseService: ExpenseService,
    private balanceService: BalanceService,
    private dateFilterService: DateFilterService,
    private expenseSummaryService: ExpenseSummaryService
  ) {}

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
    this.touchStartY = event.changedTouches[0].screenY;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.touchEndY = event.changedTouches[0].screenY;
    this.handleSwipeGesture();
  }

  ngOnInit(): void {
    this.initFilter();
    this.updateFilterAndLoadExpenses();
  }

  changeDescription(expense: Expense): void {
    let newDescription = prompt('Change description', expense?.description);
    if (newDescription !== null) {
      const oldDescription = expense.description ? expense.description : '';
      newDescription = newDescription ? newDescription?.trim() : '';
      if (oldDescription !== newDescription) {
        this.updateExpense({ ...expense, description: newDescription });
      }
    }
  }

  changeAmount(expense: Expense): void {
    const newAmountAsString = prompt(
      'Change amount',
      expense?.amount?.toString()
    );
    const newAmount = Number(newAmountAsString);
    if (newAmount && newAmount !== expense?.amount) {
      const oldAmount = expense.amount;
      this.expenseService
        .updateExpense({ ...expense, amount: Number(newAmount) })
        .pipe(
          switchMap(() => this.balanceService.getBalance()),
          first(),
          switchMap(balance => {
            const newBalance =
              Math.round((balance + oldAmount - newAmount) * 100) / 100;
            return this.balanceService.addBalance(newBalance);
          }),
          switchMap(() =>
            this.expenseSummaryService.sendBrowserNotificationWithBudgetSummary()
          ),
          takeUntil(this.destroySubject)
        )
        .subscribe();
    }
  }

  navigateToChart(categoryId: string): void {
    this.dateFilterService.categories = [categoryId];
    this.dateFilterService.dateFilter = this.currentFilter?.date;
    this.router.navigate(['/details'], {
      queryParams: { 'back-url': '/history' },
    });
  }

  updateFilterAndLoadExpenses(filter?: MultiFilter): void {
    if (filter) {
      this.currentFilter = {
        ...(filter || {
          categories: [],
          date: this.dateFilterService.getInitialMonthValue(),
          description: '',
        }),
      };
    }
    this.expenses$ = this.loadExpenses().pipe(takeUntil(this.destroySubject));
  }

  filterByCategory(category: string): void {
    this.defaultFilter = { ...this.currentFilter, categories: [category] };
    this.updateFilterAndLoadExpenses(this.defaultFilter);
    let top = document.getElementById('back');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  getTotalAmountPerDay(date: number): number {
    return this.totalAmountPerDays.get(date) || 0;
  }

  onDelete(item: HistoryExpense) {
    if (confirm('Delete?')) {
      this.updateBalance(item);
      const id = item.id;
      this.expenseService
        .deleteExpense(id)
        .pipe(takeUntil(this.destroySubject))
        .subscribe();
    }
  }

  onDeleteFromBalance(item: HistoryExpense): void {
    if (confirm('Return to balance?')) {
      this.updateBalance(item, true);
    }
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  private updateBalance(
    item: HistoryExpense,
    isDeleteFromBalance?: boolean
  ): void {
    const category = getCategoryById(item?.category);
    if (item && !item?.isDeletedFromBalance && category?.includeInBalance) {
      this.balanceService
        .getBalance()
        .pipe(
          first(),
          switchMap(balance => {
            const newBalance = Math.round((balance + item.amount) * 100) / 100;
            return this.balanceService.addBalance(newBalance);
          }),
          switchMap(() =>
            this.expenseSummaryService.sendBrowserNotificationWithBudgetSummary()
          ),
          takeUntil(this.destroySubject)
        )
        .subscribe();
    }
    if (isDeleteFromBalance) {
      item.isDeletedFromBalance = isDeleteFromBalance;
      this.expenseService
        .updateExpense(item)
        .pipe(
          takeUntil(this.destroySubject),
          switchMap(() =>
            this.expenseSummaryService.sendBrowserNotificationWithBudgetSummary()
          )
        )
        .subscribe();
    }
  }

  private handleSwipeGesture(): void {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;

    // Detect horizontal swipe only if it is more significant than vertical swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > GLOBAL_SWIPE_LENGTH) {
        this.navigateHome();
      } else if (deltaX < -GLOBAL_SWIPE_LENGTH) {
        this.navigateToDefaultStatistics();
      }
    }
  }

  navigateToDefaultStatistics(): void {
    this.router.navigate(['/statistics']);
  }

  navigateToStatistics(): void {
    this.dateFilterService.categories = this.currentFilter?.categories;
    this.dateFilterService.description = this.currentFilter?.description;
    this.dateFilterService.dateFilter = this.currentFilter?.date;
    this.router.navigate(['/statistics']);
  }

  private navigateHome(): void {
    this.router.navigate(['/']);
  }

  private loadExpenses(): Observable<HistoryExpense[]> {
    return this.expenseService
      .getExpenses(
        this.currentFilter?.date,
        this.currentFilter?.categories,
        this.currentFilter?.description
      )
      .pipe(map(expenses => this.calculateAmountsAndModifyExpenses(expenses)));
  }

  private isDatePanelVisible(timestamp: number): boolean {
    if (this.temporaryDate === 0) {
      this.temporaryDate = timestamp;
      return true;
    } else if (
      new Date(this.temporaryDate).toDateString() ===
      new Date(timestamp).toDateString()
    ) {
      return false;
    } else {
      this.temporaryDate = timestamp;
      return true;
    }
  }

  private calculateAmountsAndModifyExpenses(
    expenses: Expense[]
  ): HistoryExpense[] {
    this.temporaryDate = 0;
    let newAmount = 0;
    // Compute coverage counts before transforming
    this.computeCoverage(expenses);
    const result = expenses.map(expense => {
      newAmount = this.roundUp(newAmount + expense.amount);
      const showDateTitle = this.isDatePanelVisible(expense.date);
      if (showDateTitle) {
        this.totalAmountPerDays.set(expense.date, expense.amount);
      } else {
        const amount = this.totalAmountPerDays.get(this.temporaryDate) || 0;
        const newAmount = Math.round((amount + expense.amount) * 100) / 100;
        this.totalAmountPerDays.set(this.temporaryDate, newAmount);
      }
      return {
        ...expense,
        showDateTitle,
      } as HistoryExpense;
    });
    this.totalAmount = newAmount;
    return result;
  }

  private computeCoverage(expenses: Expense[]): void {
    const frame = this.currentFilter?.date;
    if (!frame) {
      this.activeBucketCount = 0;
      this.totalBucketCount = 0;
      this.expenseEntryCount = 0;
      return;
    }
    // Count expense entries (non-zero amounts)
    this.expenseEntryCount = expenses.filter(
      e => e.amount != null && e.amount !== 0
    ).length;
    // Determine mode
    const mode: Mode = (frame.mode as Mode) || Mode.MONTH;
    let totalBuckets = 0;
    let aggregates: number[] = [];
    const now = new Date();
    if (mode === Mode.DAY) {
      totalBuckets = 24;
      aggregates = new Array(totalBuckets).fill(0);
      expenses.forEach(e => {
        const d = new Date(e.date);
        const h = d.getHours();
        aggregates[h] = +(aggregates[h] + e.amount).toFixed(2);
      });
      // Mirror multi-chart behavior: zero out current in-progress hour if within frame
      const start =
        (frame.start as any)?.toJSDate?.() || new Date(frame.start as any);
      const finish =
        (frame.finish as any)?.toJSDate?.() || new Date(frame.finish as any);
      const t = now.getTime();
      if (start.getTime() <= t && finish.getTime() >= t) {
        aggregates[now.getHours()] = 0;
      }
    } else if (mode === Mode.WEEK) {
      totalBuckets = 7;
      aggregates = new Array(totalBuckets).fill(0);
      expenses.forEach(e => {
        const d = new Date(e.date);
        const dow = d.getDay();
        const idx = dow === 0 ? 6 : dow - 1; // Monday=0
        aggregates[idx] = +(aggregates[idx] + e.amount).toFixed(2);
      });
      const start =
        (frame.start as any)?.toJSDate?.() || new Date(frame.start as any);
      const finish =
        (frame.finish as any)?.toJSDate?.() || new Date(frame.finish as any);
      const t = now.getTime();
      if (start.getTime() <= t && finish.getTime() >= t) {
        const dow = now.getDay();
        const idx = dow === 0 ? 6 : dow - 1;
        aggregates[idx] = 0;
      }
    } else if (mode === Mode.MONTH) {
      // derive month length from frame.start
      const base =
        (frame.start as any)?.toJSDate?.() ||
        new Date(frame.start as any) ||
        now;
      const year = base.getFullYear();
      const month = base.getMonth();
      totalBuckets = new Date(year, month + 1, 0).getDate();
      aggregates = new Array(totalBuckets).fill(0);
      expenses.forEach(e => {
        const d = new Date(e.date);
        const dayIdx = d.getDate() - 1;
        if (dayIdx >= 0 && dayIdx < totalBuckets)
          aggregates[dayIdx] = +(aggregates[dayIdx] + e.amount).toFixed(2);
      });
      const start =
        (frame.start as any)?.toJSDate?.() || new Date(frame.start as any);
      const finish =
        (frame.finish as any)?.toJSDate?.() || new Date(frame.finish as any);
      const t = now.getTime();
      if (start.getTime() <= t && finish.getTime() >= t) {
        const idx = now.getDate() - 1;
        if (idx >= 0 && idx < totalBuckets) aggregates[idx] = 0;
      }
    } else if (mode === Mode.YEAR) {
      totalBuckets = 12;
      aggregates = new Array(totalBuckets).fill(0);
      expenses.forEach(e => {
        const d = new Date(e.date);
        const m = d.getMonth();
        aggregates[m] = +(aggregates[m] + e.amount).toFixed(2);
      });
      const start =
        (frame.start as any)?.toJSDate?.() || new Date(frame.start as any);
      const finish =
        (frame.finish as any)?.toJSDate?.() || new Date(frame.finish as any);
      const t = now.getTime();
      if (start.getTime() <= t && finish.getTime() >= t) {
        const idx = now.getMonth();
        aggregates[idx] = 0;
      }
    }
    this.totalBucketCount = totalBuckets;
    this.activeBucketCount = aggregates.filter(v => v !== 0).length;
  }

  private initFilter(): void {
    this.defaultDateValue = this.dateFilterService.getInitialMonthValue();
    if (this.dateFilterService.dateFilter) {
      this.defaultFilter = {
        ...this.defaultFilter,
        date: this.dateFilterService.dateFilter,
      };
      this.dateFilterService.dateFilter = undefined;
    } else {
      this.defaultFilter = {
        ...this.defaultFilter,
        date: this.dateFilterService.getInitialMonthValue(),
      };
    }
    const categoryFilters = this.dateFilterService.categories;
    if (Array.isArray(categoryFilters) && categoryFilters.length > 0) {
      this.defaultFilter = {
        ...this.defaultFilter,
        categories: categoryFilters,
      };
      this.dateFilterService.categories = undefined;
    } else {
      this.defaultFilter = {
        ...this.defaultFilter,
        categories: [],
      };
    }

    const descriptionFilter = this.dateFilterService.description;
    if (descriptionFilter) {
      this.defaultFilter = {
        ...this.defaultFilter,
        description: descriptionFilter,
      };
      this.dateFilterService.description = undefined;
    }

    this.currentFilter = {
      ...this.defaultFilter,
    };
  }

  private updateExpense(expense: Expense): void {
    this.expenseService
      .updateExpense(expense)
      .pipe(
        first(),
        takeUntil(this.destroySubject),
        switchMap(() =>
          this.expenseSummaryService.sendBrowserNotificationWithBudgetSummary()
        )
      )
      .subscribe();
  }

  private roundUp(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
