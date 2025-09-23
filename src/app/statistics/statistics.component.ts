import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { first, Subject, takeUntil } from 'rxjs';

import { DateFilterComponent } from '../common/component/filter/date/date-filter.component';
import { DateFilterService } from '../common/component/filter/date/date-filter.service';
import { DateFrame } from '../common/component/filter/date/dateFrame.model';
import {
  Categories,
  getCategoryById,
  getCategoryNameById,
} from '../common/model/categories';
import { Expense } from '../common/model/expense.model';
import { CategoryListNamePipe } from '../common/pipe/category-list-name.pipe';
import { ExpenseService } from '../common/service/expense.service';
import { StatisticsBarComponent } from './bar/statistics-bar.component';
import { CommonModule } from '@angular/common';
import { AnalyticsSwitchComponent } from './analytics/analytics-switch.component';
import { MultiChartComponent } from '../common/component/chart/multi/multi-chart.component';
import { CollapsedPanelComponent } from '../common/component/collapsed-panel';
import { SearchInputComponent } from '../common/component/search-input';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  standalone: true,
  imports: [
    DateFilterComponent,
    FormsModule,
    CategoryListNamePipe,
    StatisticsBarComponent,
    MultiChartComponent,
    CommonModule,
  AnalyticsSwitchComponent,
    RouterModule,
    CollapsedPanelComponent,
    SearchInputComponent,
  ],
})
export class StatisticsComponent implements OnDestroy, AfterViewInit {
  categoryTotals: {
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }[] = [];
  totalAmount: number = 0;
  regularAmount: number = 0;
  irregularAmount: number = 0;
  readonly getCategoryNameByIdFunc = getCategoryNameById;
  excludedCategories: string[] = [];
  currentCategories: string[] = [];
  private readonly destroySubject: Subject<void> = new Subject();

  readonly initialFilterValue: DateFrame;

  currentFilter?: DateFrame;

  today: Date = new Date();
  // Removed direct donut chart DOM/ECharts usage; now handled inside AnalyticsSwitchComponent
  regularCategoriesCheckboxValue: boolean = true;
  irregularCategoriesCheckboxValue: boolean = true;

  filteredExpenses: Expense[];
  descriptionSearch: string = '';

  // collapse state for category filters and bars
  collapsed: Record<'categoryFilters', boolean> = {
    categoryFilters: false,
  };

  constructor(
    private router: Router,
    private expenseService: ExpenseService,
    private dateFilterService: DateFilterService
  ) {
    this.initialFilterValue = this.dateFilterService.getInitialDayValue();
    this.currentFilter = this.initialFilterValue;
  }

  onDescriptionSearchChange(value: string): void {
    // Debounce could be added if needed; for now immediate filter
    this.descriptionSearch = value?.trim();
    this.calculateCategoryTotals();
  }

  ngAfterViewInit(): void {
    // Initial totals still required for other statistics sections
    this.calculateCategoryTotals();
  }

  toggle(section: 'categoryFilters') {
    this.collapsed[section] = !this.collapsed[section];
  }

  // initPieChart removed; donut now lives in AnalyticsSwitchComponent

  onFilterChange(frame: DateFrame): void {
    if (frame?.display !== this.currentFilter?.display) {
      this.currentFilter = frame;
      this.calculateCategoryTotals();
    }
  }

  navigateToHistory(categoryId?: string): void {
    if (categoryId) {
      this.dateFilterService.categories = [categoryId];
    } else {
      this.dateFilterService.categories = this.getRemainCategories();
    }
    this.dateFilterService.description = this.descriptionSearch;
    this.dateFilterService.dateFilter = this.currentFilter;
    this.router.navigate(['/history']);
  }

  navigateToChart(categoryId: string): void {
    this.dateFilterService.categories = [categoryId];
    this.dateFilterService.dateFilter = this.currentFilter;
    this.router.navigate(['/details'], {
      queryParams: { 'back-url': '/statistics' },
    });
  }

  calculateCategoryTotals(
    category: string = '',
    isCurrentCategoriesUpdate: boolean = true
  ): void {
    const categoryMap: { [key: string]: number } = {};
    let expensesFilteredByDate = [];
    this.totalAmount = 0;
    this.regularAmount = 0;
    this.irregularAmount = 0;

    const categories = category ? [category] : this.getRemainCategories();
    this.expenseService
      .getExpenses(this.currentFilter, categories)
      .pipe(first(), takeUntil(this.destroySubject))
      .subscribe(expenses => {
        expensesFilteredByDate = expenses;
        if (this.descriptionSearch) {
          const lower = this.descriptionSearch.toLowerCase();
          expensesFilteredByDate = expensesFilteredByDate.filter(e =>
            (e.description || '').toLowerCase().includes(lower)
          );
        }
        if (isCurrentCategoriesUpdate) {
          this.currentCategories = Array.from(
            new Set(expensesFilteredByDate.map(expense => expense.category))
          );
        }
        this.filteredExpenses = expensesFilteredByDate;
        expensesFilteredByDate.forEach(expense => {
          if (!categoryMap[expense.category]) {
            categoryMap[expense.category] = 0;
          }
          categoryMap[expense.category] =
            Math.round((categoryMap[expense.category] + expense.amount) * 100) /
            100;
          if (!getCategoryById(expense.category)?.includeInBalance) {
            this.regularAmount =
              Math.round((this.regularAmount + expense.amount) * 100) / 100;
          } else {
            this.irregularAmount =
              Math.round((this.irregularAmount + expense.amount) * 100) / 100;
          }
          this.totalAmount =
            Math.round((this.totalAmount + expense.amount) * 100) / 100;
        });

        this.categoryTotals = [];
        // Calculate percentage for each category
        for (const category in categoryMap) {
          const amount = categoryMap[category];
          const percentage = (amount / this.totalAmount) * 100;
          const color = this.getColor(percentage);
          this.categoryTotals.push({ category, amount, percentage, color });
          this.categoryTotals.sort((a, b) => b.amount - a.amount);
        }
        // Donut rendering handled by child component
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
      if (deltaX > 150) {
        this.onSwipeRight();
      } else if (deltaX < -150) {
        this.onSwipeLeft();
      }
    }
  }

  onSwipeLeft() {
    this.router.navigate(['/']);
    // Handle the left swipe action here
  }
  onSwipeRight() {
    this.router.navigate(['/history']);
    // Handle the left swipe action here
  }

  getColor(percentage: number): string {
    const green = Math.min(255, Math.round((100 - percentage) * 2.55));
    const red = Math.min(180, Math.round(percentage * 1.8));
    return `rgb(${red}, ${green}, 0)`; // RGB color with variable red and green
  }

  onRefresh(): void {
    this.categoryTotals = [];
    this.irregularCategoriesCheckboxValue = true;
    this.regularCategoriesCheckboxValue = true;
    this.excludedCategories = [];
    this.calculateCategoryTotals(null, false);
  }

  onBarClose(category: string): void {
    this.updateByExcludedCategories([category]);
  }

  onRegularCategoriesCheckboxClick(value: boolean): void {
    if (!value) {
      if (this.irregularCategoriesCheckboxValue) {
        const regularCategories = this.currentCategories
          .map(getCategoryById)
          .filter(category => !category.includeInBalance)
          .map(category => category.id);
        this.excludedCategories = [...regularCategories];
        this.calculateCategoryTotals(null, false);
      } else {
        this.excludedCategories = [];
        this.calculateCategoryTotals(null, false);
      }
    } else {
      if (this.irregularCategoriesCheckboxValue) {
        this.excludedCategories = [];
        this.calculateCategoryTotals(null, false);
      } else {
        this.onIrregularCategoriesCheckboxClick(false);
      }
    }
  }

  onIrregularCategoriesCheckboxClick(value: boolean): void {
    if (!value) {
      if (this.regularCategoriesCheckboxValue) {
        const irregularCategories = this.currentCategories
          .map(getCategoryById)
          .filter(category => category.includeInBalance)
          .map(category => category.id);
        this.excludedCategories = [...irregularCategories];
        this.calculateCategoryTotals(null, false);
      } else {
        this.excludedCategories = [];
        this.calculateCategoryTotals(null, false);
      }
    } else {
      if (this.regularCategoriesCheckboxValue) {
        this.excludedCategories = [];
        this.calculateCategoryTotals(null, false);
      } else {
        this.onRegularCategoriesCheckboxClick(false);
      }
    }
  }

  filterByCategory(category: string): void {
    const filteredCategories = this.currentCategories.filter(
      item => item !== category
    );
    this.excludedCategories = Array.from(
      new Set([...this.excludedCategories, ...filteredCategories])
    );
    this.calculateCategoryTotals(category, false);
  }

  private updateByExcludedCategories(categories: string[]): void {
    const updatedExcludedCategories = Array.from(
      new Set([...this.excludedCategories, ...categories])
    );
    if (updatedExcludedCategories.length === this.currentCategories.length) {
      this.excludedCategories = [];
      this.irregularCategoriesCheckboxValue = true;
      this.regularCategoriesCheckboxValue = true;
    } else {
      this.excludedCategories = updatedExcludedCategories;
    }
    this.calculateCategoryTotals(null, false);
  }

  private getRemainCategories(): string[] {
    if (this.excludedCategories?.length === 0) {
      return [];
    }
    return Categories.filter(
      category => !this.excludedCategories.includes(category?.id)
    ).map(category => category.id);
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
