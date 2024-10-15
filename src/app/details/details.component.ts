import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first, Subject, takeUntil } from 'rxjs';

import { getCategoryNameById } from '../common/categories';
import {
  MultiFilter,
  MultiFilterComponent,
} from '../common/component/filter/multi/multi-filter.component';
import { Expense } from '../common/expense.model';
import { ExpenseService } from '../common/expense.service';
import { getExpensesFromTo } from '../statistics/functions/expense-helpers';
import { BarChartComponent } from '../common/component/chart/bar/bar-chart.component';
import { DateFrame } from '../common/component/filter/date/dateFrame.model';
import { DateFilterService } from '../common/component/filter/date/date-filter.service';
import { DateFilterComponent } from '../common/component/filter/date/date-filter.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: true,
  imports: [MultiFilterComponent, BarChartComponent],
})
export class DetailsComponent implements OnInit, OnDestroy {
  amountForDay: number = 0;
  amountForMonth: number = 0;
  amountForYear: number = 0;
  backUrl: string = '';
  selectedCategory: string = '';
  initialFilter: MultiFilter = {
    date: DateFilterComponent.initialMonthValue,
    categories: [],
  };
  defaultDateValue: DateFrame = DateFilterComponent.initialMonthValue;
  currentFilter: MultiFilter = {
    categories: [],
    date: DateFilterComponent.initialMonthValue,
  };
  totalAmount: number = 0;
  expenses: Expense[] = [];

  private readonly destroySubject: Subject<void> = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private expenseService: ExpenseService,
    private dateFilterService: DateFilterService
  ) {}

  ngOnInit(): void {
    this.initDetails();
  }

  initDetails(): void {
    this.backUrl = this.activatedRoute.snapshot.queryParamMap.get('back-url');
    const categoryFilters = this.dateFilterService.categories;
    if (Array.isArray(categoryFilters) && categoryFilters.length > 0) {
      this.initialFilter = {
        ...this.initialFilter,
        categories: categoryFilters,
      };
      this.dateFilterService.categories = undefined;
      this.initialFilter = {
        ...this.initialFilter,
        date:
          this.dateFilterService.dateFilter ||
          DateFilterComponent.initialMonthValue,
      };
      this.dateFilterService.dateFilter = undefined;
    }
    this.applyFilters(this.initialFilter);
  }

  applyFilters(filter: MultiFilter): void {
    const updatedFilter = {
      date: filter?.date || DateFilterComponent.initialMonthValue,
      categories: filter?.categories || [],
    };
    if (!filter?.date) {
      this.initialFilter = {
        categories: [],
        date: DateFilterComponent.initialMonthValue,
      };
    }
    this.expenseService
      .getExpenses()
      .pipe(first(), takeUntil(this.destroySubject))
      .subscribe((expenses) => {
        let filteredExpenses = expenses;
        if (updatedFilter?.categories.length > 0) {
          filteredExpenses = filteredExpenses.filter((expense) => {
            return updatedFilter?.categories.includes(expense.category);
          });
        }

        // Filter by date
        filteredExpenses = getExpensesFromTo(
          filteredExpenses,
          updatedFilter?.date?.start,
          updatedFilter?.date?.finish
        );
        this.currentFilter = updatedFilter;
        this.expenses = filteredExpenses;
        this.sumValues();
      });
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
        this.navigateBack();
      } else if (deltaX < -100) {
        this.navigateBack();
      }
    }
  }

  navigateBack() {
    this.router.navigate([this.backUrl || '/']);
    // Handle the left swipe action here
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

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
