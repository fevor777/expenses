import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';

import { BalanceService } from '../common/balance.service';
import { getCategoryById, getCategoryNameById } from '../common/categories';
import { DateFilterComponent } from '../common/component/filter/date/date-filter.component';
import { DateFilterService } from '../common/component/filter/date/date-filter.service';
import { MultiFilter } from '../common/component/filter/multi/multi-filter.component';
import { Expense } from '../common/expense.model';
import { ExpenseService } from '../common/expense.service';
import { DateFrame } from '../common/component/filter/date/dateFrame.model';

type HistoryExpense = Expense & {
  showDateTitle: boolean;
  amountPerDay: number;
};

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit, OnDestroy {
  expenses: HistoryExpense[] = [];
  totalAmount: number = 0;
  temporaryDate: number = 0;
  totalAmountPerDays: Map<number, number> = new Map();
  getCategoryByIdFunc = getCategoryById;
  defaultDateValue: DateFrame = DateFilterComponent.initialMonthValue;

  defaultFilter: MultiFilter = {
    categories: [],
    date: DateFilterComponent.initialMonthValue,
  };
  currentFilter: MultiFilter = {
    categories: [],
    date: DateFilterComponent.initialMonthValue,
  };

  readonly getCategoryNameByIdFunc = getCategoryNameById;

  private readonly destroySubject: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private expenseService: ExpenseService,
    private balanceService: BalanceService,
    private dateFilterService: DateFilterService
  ) {}

  ngOnInit(): void {
    if (this.dateFilterService.dateFilter) {
      this.defaultFilter = {
        ...this.defaultFilter,
        date: this.dateFilterService.dateFilter,
      };
      this.dateFilterService.dateFilter = undefined;
    }
    const categoryFilters = this.dateFilterService.categories;
    if (Array.isArray(categoryFilters) && categoryFilters.length > 0) {
      this.defaultFilter = {
        ...this.defaultFilter,
        categories: categoryFilters,
      };
      this.dateFilterService.categories = undefined;
    }
    if (
      this.defaultFilter?.date ||
      this.defaultFilter?.categories?.length > 0
    ) {
      this.applyFilters(this.defaultFilter);
    } else {
      this.initiateExpenses()
        .pipe(first(), takeUntil(this.destroySubject))
        .subscribe(() => {
          this.sumValues();
        });
    }
  }

  initiateExpenses(): Observable<Expense[]> {
    return this.expenseService
      .getExpenses(this.currentFilter?.date, this.currentFilter?.categories)
      .pipe(
        tap((expenses) => {
          this.expenses = expenses.map((expense) => {
            const showDateTitle = this.isDatePanelVisible(expense.date);
            if (showDateTitle) {
              this.totalAmountPerDays.set(expense.date, expense.amount);
            } else {
              const amount =
                this.totalAmountPerDays.get(this.temporaryDate) || 0;
              const newAmount =
                Math.round((amount + expense.amount) * 100) / 100;
              this.totalAmountPerDays.set(this.temporaryDate, newAmount);
            }
            return {
              ...expense,
              showDateTitle,
            } as HistoryExpense;
          });
        })
      );
  }

  changeDescription(expense: Expense): void {
    let newDescription = prompt('Change description', expense?.description);
    if (newDescription !== null) {
      const oldDescription = expense.description ? expense.description : '';
      newDescription = newDescription ? newDescription?.trim() : '';
      if (oldDescription !== newDescription) {
        this.expenseService
          .updateExpense({ ...expense, description: newDescription })
          .pipe(first(), takeUntil(this.destroySubject))
          .subscribe(() => {
            this.applyFilters(this.currentFilter);
          });
      }
    }
  }

  navigateToChart(categoryId: string): void {
    this.dateFilterService.categories = [categoryId];
    this.dateFilterService.dateFilter = this.currentFilter?.date;
    this.router.navigate(['/details'], {
      queryParams: { 'back-url': '/history' },
    });
  }

  getCategoryFilters(): string {
    return this.defaultFilter?.categories.map(getCategoryNameById).join(', ');
  }

  applyFilters(filter: MultiFilter): void {
    this.currentFilter = {
      ...(filter || {
        categories: [],
        date: DateFilterComponent.initialMonthValue,
      }),
    };
    this.initiateExpenses()
      .pipe(first(), takeUntil(this.destroySubject))
      .subscribe(() => {
        this.sumValues();
      });
  }

  filterByCategory(category: string): void {
    this.defaultFilter = { ...this.currentFilter, categories: [category] };
    this.applyFilters(this.defaultFilter);
    let top = document.getElementById('back');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  getTotalAmountPerDay(date: number): number {
    return this.totalAmountPerDays.get(date) || 0;
  }

  onDelete(index: number) {
    if (confirm('Delete?')) {
      this.updateBalance(index);
      const id = this.expenses[index].id;
      this.expenseService
        .deleteExpense(id)
        .pipe(
          switchMap(() => this.initiateExpenses()),
          takeUntil(this.destroySubject)
        )
        .subscribe(() => this.sumValues());
    }
  }

  updateBalance(index: number, isDeleteFromBalance?: boolean): void {
    const balance = Number(localStorage.getItem('balance')) || 0;
    const category = getCategoryById(this.expenses[index].category);
    if (
      balance &&
      !this.expenses[index]?.isDeletedFromBalance &&
      category?.includeInBalance
    ) {
      const newBalance =
        Math.round((balance + this.expenses[index].amount) * 100) / 100;
      this.balanceService
        .addBalance(newBalance)
        .pipe(takeUntil(this.destroySubject))
        .subscribe();
    }
    if (isDeleteFromBalance) {
      this.expenses[index].isDeletedFromBalance = isDeleteFromBalance;
      this.expenseService
        .updateExpense(this.expenses[index])
        .pipe(takeUntil(this.destroySubject))
        .subscribe();
    }
  }

  onDeleteFromBalance(index: number): void {
    if (confirm('Return to balance?')) {
      this.updateBalance(index, true);
    }
  }

  onSwipeRight(): void {
    this.router.navigate(['/']);
  }

  isDatePanelVisible(timestamp: number): boolean {
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
  touchStartX: number = 0;
  touchStartY: number = 0;
  touchEndX: number = 0;
  touchEndY: number = 0;

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

  handleSwipeGesture() {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;

    // Detect horizontal swipe only if it is more significant than vertical swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 100) {
        this.onSwipeRight();
      } else if (deltaX < -100) {
        this.onSwipeLeft();
      }
    }
  }

  onSwipeLeft() {
    this.router.navigate(['/statistics']);
    // Handle the left swipe action here
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  private sumValues(): void {
    this.totalAmount = this.expenses.reduce(
      (total: number, expense: { amount: number }) => {
        const result = total + expense.amount;
        return Math.round(result * 100) / 100;
      },
      0
    );
  }
}
