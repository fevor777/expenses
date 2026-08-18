import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateTime } from 'luxon';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  catchError,
  first,
  map,
  Observable,
  of,
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
import { GlobalSwipeLengthStoreService } from '../common/service/global-swipe-length-store.service';
import { BudgetSummaryService } from '../common/service/budget-summary.service';
import { ExpenseEditModalComponent } from './edit/expense-edit-modal.component';
import { SpinnerComponent } from '../common/component/spinner/spinner.component';
import { TagService } from '../common/service/tag.service';

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
    ExpenseEditModalComponent,
    SpinnerComponent,
  ],
})
export class HistoryComponent implements OnInit, OnDestroy {
  expenses$: Observable<HistoryExpense[]>;
  // Loading spinner state for expenses retrieval (covers remote + local fallback)
  isLoading: boolean = false;
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

  // Edit modal state
  editingExpense: Expense | null = null;
  showEditModal: boolean = false;
  tagNamesById: Record<string, string> = {};

  error: any;

  private globalSwipeLength = 70;
  constructor(
    private router: Router,
    private expenseService: ExpenseService,
    private balanceService: BalanceService,
    private dateFilterService: DateFilterService,
    private expenseSummaryService: BudgetSummaryService,
    private swipeLengthStore: GlobalSwipeLengthStoreService,
    private tagService: TagService
  ) {}

  // Fixed wrapper dynamic offset
  @ViewChild('historyFixed') private historyFixedRef?: ElementRef<HTMLElement>;
  @ViewChild('historyContent')
  private historyContentRef?: ElementRef<HTMLElement>;
  private fixedResizeObserver?: ResizeObserver;
  private fixedMutationObserver?: MutationObserver;
  private lastHeight = -1;
  private resizeHandler = () => this.applyContentOffset();
  private isMultiFilterExpanded = false;
  private stabilizationTimeouts: number[] = [];
  private offsetFramePending = false;

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
    this.globalSwipeLength = this.swipeLengthStore.getSwipeLength();
    this.tagService
      .getTags()
      .pipe(takeUntil(this.destroySubject))
      .subscribe(tags => {
        this.tagNamesById = (tags || []).reduce(
          (acc, tag) => ({ ...acc, [tag.id]: tag.name }),
          {}
        );
      });
    this.initFilter();
    this.updateFilterAndLoadExpenses();
    // Delay init until view children rendered
    queueMicrotask(() => this.initDynamicLayout());
    // Reset scroll on navigation to history page to avoid preserving previous route scroll
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  changeDescription(expense: Expense): void {
    let newDescription = prompt('Change description', expense?.description);
    if (newDescription !== null) {
      const oldDescription = expense.description ? expense.description : '';
      newDescription = newDescription ? newDescription?.trim() : '';
      if (oldDescription !== newDescription) {
        this.persistExpense({ ...expense, description: newDescription });
      }
    }
  }

  updateFilterAndLoadExpenses(filter?: MultiFilter): void {
    if (filter) {
      this.currentFilter = {
        ...(filter || {
          categories: [],
          date: this.dateFilterService.getInitialDayValue(),
          description: '',
        }),
      };
    }
    // Toggle loading state; postpone emission until subscription side effects complete
    this.isLoading = true;
    this.expenses$ = this.loadExpenses().pipe(
      catchError(err => {
        this.error = err;
        console.error('Error loading expenses:', err);
        // Return an empty array to keep the observable stream alive
        return of([] as HistoryExpense[]);
      }),
      tap(() => {
        // Computation done inside loadExpenses mapping; keep spinner until first emission
        this.isLoading = false;
      }),
      takeUntil(this.destroySubject)
    );
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
      const id = item.id;
      this.expenseService
        .deleteExpense(id)
        .pipe(takeUntil(this.destroySubject))
        .subscribe();
    }
  }

  onExcludeFromBudget(item: HistoryExpense): void {
    if (confirm('Exclude from budget?')) {
      this.updateExpenses(item);
    }
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
    this.teardownDynamicLayout();
  }

  private updateExpenses(item: HistoryExpense): void {
    const updatedItem = { ...item, includeInBalance: false };
    this.expenseService
      .updateExpense(updatedItem)
      .pipe(
        takeUntil(this.destroySubject),
        switchMap(() =>
          this.expenseSummaryService.sendBrowserNotificationWithBudgetSummary()
        )
      )
      .subscribe();
  }

  private handleSwipeGesture(): void {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;

    // Detect horizontal swipe only if it is more significant than vertical swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > this.globalSwipeLength) {
        this.navigateHome();
      } else if (deltaX < -this.globalSwipeLength) {
        // this.navigateToDefaultStatistics();
        this.navigateToStatistics();
      }
    }
  }

  navigateToDefaultStatistics(): void {
    this.router.navigate(['/statistics']);
  }

  navigateToStatistics(): void {
    this.dateFilterService.categories = this.currentFilter?.categories;
    this.dateFilterService.description = this.currentFilter?.description;
    this.dateFilterService.tagIds = this.currentFilter?.tagIds;
    this.dateFilterService.dateFilter = this.currentFilter?.date;
    this.router.navigate(['/statistics']);
  }

  updateExpense(expense: Expense): void {
    // Open modal for editing
    this.editingExpense = { ...expense };
    this.showEditModal = true;
  }

  persistExpense(expense: Expense): void {
    this.expenseService
      .updateExpense(expense)
      .pipe(
        first(),
        takeUntil(this.destroySubject),
        switchMap(() =>
          this.expenseSummaryService.sendBrowserNotificationWithBudgetSummary()
        )
      )
      .subscribe(() => {
        this.closeEditModal();
        // Reload list to reflect updated values (optimistic store should update, but ensure totals recompute)
        this.updateFilterAndLoadExpenses(this.currentFilter);
      });
  }

  onApplyEdit(expense: Expense): void {
    this.persistExpense(expense);
  }

  onDeleteEdit(expense: Expense): void {
    this.showEditModal = false;
    this.editingExpense = null;
    this.onDelete(expense as HistoryExpense);
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingExpense = null;
  }

  private navigateHome(): void {
    this.router.navigate(['/']);
  }

  private loadExpenses(): Observable<HistoryExpense[]> {
    return this.expenseService
      .getExpenses(
        this.currentFilter?.date,
        this.currentFilter?.categories,
        this.currentFilter?.description,
        true,
        this.currentFilter?.tagIds
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
    if (mode === Mode.CUSTOM) {
      const buckets = this.buildCustomCoverageBuckets(frame);
      totalBuckets = buckets.length;
      aggregates = new Array(totalBuckets).fill(0);
      expenses.forEach(expense => {
        const index = buckets.findIndex(
          bucket =>
            expense.date >= bucket.start.toMillis() &&
            expense.date <= bucket.finish.toMillis()
        );
        if (index >= 0)
          aggregates[index] = +(aggregates[index] + expense.amount).toFixed(2);
      });
      const nowValue = DateTime.now();
      const currentBucket = buckets.findIndex(
        bucket => nowValue >= bucket.start && nowValue <= bucket.finish
      );
      if (currentBucket >= 0) aggregates[currentBucket] = 0;
    } else if (mode === Mode.DAY) {
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

  private buildCustomCoverageBuckets(frame: DateFrame): DateFrame[] {
    const start = frame.start.startOf('day');
    const finish = frame.finish.endOf('day');
    const days = Math.floor(finish.startOf('day').diff(start, 'days').days) + 1;
    const granularity = days <= 31 ? 'day' : days <= 365 ? 'week' : 'month';
    const buckets: DateFrame[] = [];
    let cursor = start;

    while (cursor <= finish) {
      let bucketFinish =
        granularity === 'day'
          ? cursor.endOf('day')
          : granularity === 'week'
            ? cursor.endOf('week')
            : cursor.endOf('month');
      if (bucketFinish > finish) bucketFinish = finish;
      buckets.push({ start: cursor, finish: bucketFinish, mode: Mode.CUSTOM });
      cursor = bucketFinish.plus({ milliseconds: 1 }).startOf('day');
    }
    return buckets;
  }

  private initFilter(): void {
    this.defaultDateValue = this.dateFilterService.getInitialDayValue();
    if (this.dateFilterService.dateFilter) {
      this.defaultFilter = {
        ...this.defaultFilter,
        date: this.dateFilterService.dateFilter,
      };
      this.dateFilterService.dateFilter = undefined;
    } else {
      this.defaultFilter = {
        ...this.defaultFilter,
        date: this.dateFilterService.getInitialDayValue(),
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

    const tagIds = this.dateFilterService.tagIds;
    if (Array.isArray(tagIds) && tagIds.length > 0) {
      this.defaultFilter = {
        ...this.defaultFilter,
        tagIds,
      };
      this.dateFilterService.tagIds = undefined;
    }

    this.currentFilter = {
      ...this.defaultFilter,
    };
  }

  // ---- Dynamic layout methods ----
  private initDynamicLayout(): void {
    const el = this.historyFixedRef?.nativeElement;
    if (!el) {
      return;
    }
    this.fixedResizeObserver = new ResizeObserver(() =>
      this.scheduleStabilization()
    );
    this.fixedResizeObserver.observe(el);
    this.fixedMutationObserver = new MutationObserver(() =>
      this.scheduleStabilization()
    );
    this.fixedMutationObserver.observe(el, {
      childList: true,
      subtree: true,
    });
    window.addEventListener('resize', this.resizeHandler, { passive: true });
    this.scheduleStabilization();
  }

  private teardownDynamicLayout(): void {
    if (this.fixedResizeObserver && this.historyFixedRef?.nativeElement) {
      this.fixedResizeObserver.unobserve(this.historyFixedRef.nativeElement);
      this.fixedResizeObserver.disconnect();
    }
    this.fixedMutationObserver?.disconnect();
    window.removeEventListener('resize', this.resizeHandler);
    this.clearPendingStabilization();
  }

  private applyContentOffset(): void {
    if (this.offsetFramePending) {
      return;
    }

    this.offsetFramePending = true;
    requestAnimationFrame(() => {
      this.offsetFramePending = false;
      const wrapperEl = this.historyFixedRef?.nativeElement;
      const contentEl = this.historyContentRef?.nativeElement;
      if (!wrapperEl || !contentEl) {
        return;
      }
      const h = wrapperEl.offsetHeight || 0;
      // Use explicit expansion state from multi filter output
      const shouldBeFixed = !this.isMultiFilterExpanded;
      const hasClass = wrapperEl.classList.contains('is-fixed');
      if (shouldBeFixed && !hasClass) {
        wrapperEl.classList.add('is-fixed');
      } else if (!shouldBeFixed && hasClass) {
        wrapperEl.classList.remove('is-fixed');
      }
      const effectiveHeight = shouldBeFixed ? h : 0;
      if (effectiveHeight === this.lastHeight) {
        return;
      }
      this.lastHeight = effectiveHeight;
      contentEl.style.marginTop = effectiveHeight - 5 + 'px';
    });
  }

  private scheduleStabilization(
    iterations: number = 3,
    intervalMs: number = 40
  ): void {
    this.clearPendingStabilization();
    let i = 0;
    const run = () => {
      this.applyContentOffset();
      if (++i < iterations) {
        const timeoutId = window.setTimeout(run, intervalMs);
        this.stabilizationTimeouts.push(timeoutId);
      }
    };
    run();
  }

  private clearPendingStabilization(): void {
    this.stabilizationTimeouts.forEach(timeoutId =>
      window.clearTimeout(timeoutId)
    );
    this.stabilizationTimeouts = [];
  }

  onMultiFilterExpandChange(isExpanded: boolean): void {
    this.isMultiFilterExpanded = isExpanded;
    // When expanding filter, ensure user sees the full expanded panel at top.
    if (isExpanded) {
      // Use both window scroll and optional element scrollIntoView as fallback
      window.scrollTo({ top: 0, behavior: 'auto' });
      const topEl = document.getElementById('back');
      if (topEl) {
        topEl.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }
    // After state change, recalc offset (single pass to allow CSS transition to handle smooth movement)
    this.scheduleStabilization(1);
  }

  private roundUp(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
