import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { first, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';

import { DateFilterService } from '../common/component/filter/date/date-filter.service';
import { DateFrame } from '../common/component/filter/date/dateFrame.model';
import { MultiFilter, MultiFilterComponent } from '../common/component/filter/multi/multi-filter.component';
import { getCategoryById } from '../common/model/categories';
import { Expense } from '../common/model/expense.model';
import { BalanceService } from '../common/service/balance.service';
import { ExpenseService } from '../common/service/expense.service';
import { HistoryExpense } from './history-expense';
import { HistoryItemComponent } from './item/history-item.component';

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
  expenses: HistoryExpense[] = [];
  totalAmount: number = 0;
  totalAmountPerDays: Map<number, number> = new Map();

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
    private dateFilterService: DateFilterService
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
      this.updateExpense({ ...expense, amount: Number(newAmount) });
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
        }),
      };
    }
    this.loadExpenses()
      .pipe(first(), takeUntil(this.destroySubject))
      .subscribe(() => {
        this.sumValues();
      });
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
        .pipe(
          switchMap(() => this.loadExpenses()),
          takeUntil(this.destroySubject)
        )
        .subscribe(() => this.sumValues());
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
    const balance = Number(localStorage.getItem('balance')) || 0;
    const expense = this.expenses.find((e) => e.id === item.id);
    const category = getCategoryById(expense?.category);
    if (
      expense &&
      balance &&
      !expense?.isDeletedFromBalance &&
      category?.includeInBalance
    ) {
      const newBalance = Math.round((balance + expense.amount) * 100) / 100;
      this.balanceService
        .addBalance(newBalance)
        .pipe(takeUntil(this.destroySubject))
        .subscribe();
    }
    if (isDeleteFromBalance) {
      expense.isDeletedFromBalance = isDeleteFromBalance;
      this.expenseService
        .updateExpense(expense)
        .pipe(takeUntil(this.destroySubject))
        .subscribe();
    }
  }

  private handleSwipeGesture(): void {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;

    // Detect horizontal swipe only if it is more significant than vertical swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 100) {
        this.navigateHome();
      } else if (deltaX < -100) {
        this.navigateToStatistics();
      }
    }
  }

  private navigateToStatistics(): void {
    this.router.navigate(['/statistics']);
  }

  private navigateHome(): void {
    this.router.navigate(['/']);
  }

  private loadExpenses(): Observable<Expense[]> {
    this.temporaryDate = 0;
    return this.expenseService
      .getExpenses(this.currentFilter?.date, this.currentFilter?.categories)
      .pipe(
        tap((expenses) => {
          this.updateExpenses(expenses);
        })
      );
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

  private updateExpenses(expenses: Expense[]): void {
    this.expenses = expenses.map((expense) => {
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
  }

  private initFilter(): void {
    this.defaultDateValue = this.dateFilterService.getInitialMonthValue();
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
      this.dateFilterService.dateFilter ||
      (Array.isArray(categoryFilters) && categoryFilters.length > 0)
    ) {
      this.currentFilter = {
        ...this.defaultFilter,
      };
    } else {
      this.setDefaultFilter();
    }
  }

  private setDefaultFilter(): void {
    this.defaultFilter = {
      categories: [],
      date: this.dateFilterService.getInitialMonthValue(),
    };
    this.currentFilter = {
      categories: [],
      date: this.dateFilterService.getInitialMonthValue(),
    };
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

  private updateExpense(expense: Expense): void {
    this.expenseService
      .updateExpense(expense)
      .pipe(first(), takeUntil(this.destroySubject))
      .subscribe(() => {
        this.updateFilterAndLoadExpenses(this.currentFilter);
      });
  }
}
