import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, map, of, switchMap, takeUntil, tap } from 'rxjs';

import {
  Categories,
  getCategoryById,
  getCategoryNameById,
} from '../common/categories';
import { Expense } from '../common/expense.model';
import { ExpenseService } from '../common/expense.service';
import { BalanceService } from '../common/balance.service';
import { getExpensesFromTo } from '../statistics/functions/expense-helpers';
import { DateFilterService } from '../common/component/filter/date-filter.service';

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

  categories = {
    regular: Categories.filter((category) => !category.includeInBalance),
    irregular: Categories.filter((category) => category.includeInBalance),
  };
  filterCategories: any = Categories.reduce((acc, category) => {
    acc[category.id] = false;
    return acc;
  }, {});
  currentPeriod: string = 'за сегодня';

  expandFilters: boolean = false;

  readonly getCategoryNameByIdFunc = getCategoryNameById;

  private readonly destroySubject: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private expenseService: ExpenseService,
    private balanceService: BalanceService,
    private dateFilterService: DateFilterService
  ) {}

  ngOnInit(): void {
    this.initiateExpenses().pipe(takeUntil(this.destroySubject)).subscribe(() => {
      this.sumValues();
      this.filterCategories.irregular = false;
      this.filterCategories.regular = false;
    });
    this.currentPeriod = this.dateFilterService.getCurrentDateFrame().display;
  }

  initiateExpenses(): Observable<Expense[]> {
    return this.expenseService.getExpenses().pipe(
      tap((expenses) => {
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
      })
    );
  }

  applyFilters(): void {
    console.log('apply filters')
    this.initiateExpenses().pipe(takeUntil(this.destroySubject)).subscribe(() => {
      console.log('apply filters subscribe')
      this.checkMainCategory();

      // Filter by category
      this.expenses = this.expenses.filter((expense) => {
        return (
          Object.values(this.filterCategories).every((value) => !value) ||
          Object.keys(this.filterCategories).some((key) => {
            return this.filterCategories[key] && expense.category === key;
          })
        );
      });

      // Filter by date
      const currentDateFrame = this.dateFilterService.getCurrentDateFrame();
      this.currentPeriod = currentDateFrame.display;
      console.log('history', currentDateFrame);
      this.expenses = getExpensesFromTo(this.expenses, currentDateFrame.start, currentDateFrame.finish);
     
      this.sumValues();
    });
  }

  applyFiltersAndClose(): void {
    this.applyFilters();
    this.expandFilters = false;
  }

  checkMainCategory(): { regularChecked: boolean; irregularChecked: boolean } {
    const regularIds = this.categories.regular.map((category) => category.id);
    const irregularIds = this.categories.irregular.map(
      (category) => category.id
    );
    const regularChecked = regularIds.every((id) => this.filterCategories[id]);
    const irregularChecked = irregularIds.every(
      (id) => this.filterCategories[id]
    );
    this.filterCategories.regular = regularChecked;
    this.filterCategories.irregular = irregularChecked;
    return {
      regularChecked,
      irregularChecked,
    };
  }

  filterMass(what: string): void {
    let idList: any[] =
      what === 'regular' ? this.categories.regular : this.categories.irregular;
    idList = idList.map((category) => category.id);

    if (this.filterCategories[what]) {
      idList.forEach((id) => {
        this.filterCategories[id] = false;
      });
    }

    for (const key in this.filterCategories) {
      if (idList.includes(key)) {
        this.filterCategories[key] = !this.filterCategories[key];
      }
    }

    this.applyFilters();
  }

  initiateFilterCategory(): void {
    for (const key in this.filterCategories) {
      this.filterCategories[key] = false;
    }
  }

  clearFilters(): void {
    this.initiateFilterCategory();
    this.dateFilterService.refreshDateFrame();
    this.applyFilters();
  }

  toggleExpandFilters(): void {
    this.applyFilters();
    this.expandFilters = !this.expandFilters;
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
          takeUntil(this.destroySubject),
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
      this.balanceService.addBalance(newBalance).pipe(takeUntil(this.destroySubject)).subscribe();
      
    }
    if (isDeleteFromBalance) {
      this.expenses[index].isDeletedFromBalance = isDeleteFromBalance;
      this.expenseService.updateExpense(this.expenses[index]).pipe(takeUntil(this.destroySubject)).subscribe();
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

  showCategoryDetails(categoryId: string): void {
    this.router.navigate(['/details'], {
      queryParams: { 'category-id': categoryId, 'back-url': '/history' },
    });
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
      if (deltaX > 50) {
        this.onSwipeRight();
      } else if (deltaX < -50) {
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
