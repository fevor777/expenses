import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Categories } from '../common/model/categories';
import {
  MultiFilter,
  MultiFilterComponent,
} from '../common/component/filter/multi/multi-filter.component';
import { Expense } from '../common/model/expense.model';
import { ExpenseService } from '../common/service/expense.service';
import { MultiChartComponent } from '../common/component/chart/multi/multi-chart.component';
import { CompositionChartsComponent } from '../statistics/composition/composition-charts.component';
import { MicroVisualsComponent } from './micro/micro-visuals.component';
import { DateFrame } from '../common/component/filter/date/dateFrame.model';
import { DateFilterService } from '../common/component/filter/date/date-filter.service';
import { IrregularSummaryComponent } from '../common/component/irregular-summary.component';
import { Mode } from '../common/component/filter/date/dateFrame.model';
import { GLOBAL_SWIPE_LENGTH } from '../constants';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MultiFilterComponent,
    MultiChartComponent,
    CompositionChartsComponent,
    MicroVisualsComponent,
  IrregularSummaryComponent,
  ],
})
export class DetailsComponent implements OnInit, OnDestroy {
  amountForDay: number = 0;
  amountForMonth: number = 0;
  amountForYear: number = 0;
  backUrl: string = '';
  backLabel: string = '< Home';
  altUrl: string = '/history';
  altLabel: string = 'History >';
  selectedCategory: string = '';
  initialFilter: MultiFilter;
  defaultDateValue: DateFrame;
  currentFilter: MultiFilter;
  totalAmount: number = 0;
  expenses: Expense[] = [];
  // collapse state for each chart section
  collapsed: Record<'irregularSummary' | 'bar' | 'composition' | 'micro', boolean> = {
    irregularSummary: false,
    bar: false,
    composition: false,
    micro: false,
  };

  private readonly destroySubject: Subject<void> = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private expenseService: ExpenseService,
    private dateFilterService: DateFilterService
  ) {}

  ngOnInit(): void {
    this.initialFilter = {
      date: this.dateFilterService.getInitialMonthValue(),
      categories: [],
      description: '',
    };
    this.defaultDateValue = this.dateFilterService.getInitialMonthValue();
    this.currentFilter = {
      categories: [],
      date: this.dateFilterService.getInitialMonthValue(),
      description: '',
    };
    this.initDetails();
  }

  toggle(section: 'irregularSummary' | 'bar' | 'composition' | 'micro') {
    this.collapsed[section] = !this.collapsed[section];
  }

  get isMonth(): boolean {
    return (
      (this.currentFilter?.date?.mode || this.defaultDateValue?.mode) ===
      Mode.MONTH
    );
  }

  initDetails(): void {
    this.backUrl = this.activatedRoute.snapshot.queryParamMap.get('back-url');
    this.configureNav();
    const categoryFilters = this.dateFilterService.categories;
    const descriptionFilter = this.dateFilterService.description;
    if (Array.isArray(categoryFilters) && categoryFilters.length > 0) {
      this.initialFilter = {
        ...this.initialFilter,
        categories: categoryFilters,
      };
      this.dateFilterService.categories = undefined;
    }
    this.initialFilter = {
      ...this.initialFilter,
      date:
        this.dateFilterService.dateFilter ||
        this.dateFilterService.getInitialMonthValue(),
    };
    this.dateFilterService.dateFilter = undefined;
    if (descriptionFilter) {
      this.initialFilter = {
        ...this.initialFilter,
        description: descriptionFilter,
      };
      this.dateFilterService.description = undefined;
    }
    this.applyFilters(this.initialFilter);
  }

  private configureNav(): void {
    const raw = this.backUrl || '';
    if (raw === '/history') {
      this.backLabel = '< History';
      this.backUrl = '/history';
      this.altUrl = '/';
      this.altLabel = 'Home >';
    } else if (raw === '/statistics') {
      this.backLabel = '< Statistics';
      this.backUrl = '/statistics';
      this.altUrl = '/';
      this.altLabel = 'Home >';
    } else if (!raw || raw === '/') {
      // Already at home context – both sides show Home semantics
      this.backLabel = '< Home';
      this.backUrl = '/';
      this.altUrl = '/';
      this.altLabel = 'Home >';
    } else {
      // Any other non-empty path: treat as generic back, right side is Home
      this.backLabel = '< Back';
      this.backUrl = raw;
      this.altUrl = '/';
      this.altLabel = 'Home >';
    }
  }

  applyFilters(filter: MultiFilter): void {
    const updatedFilter = {
      date: filter?.date || this.dateFilterService.getInitialMonthValue(),
      categories: filter?.categories || [],
      description: filter?.description || '',
    };
    if (!filter?.date) {
      this.initialFilter = {
        categories: [],
        date: this.dateFilterService.getInitialMonthValue(),
        description: '',
      };
    }
    this.expenseService
      .getExpenses(
        updatedFilter.date,
        updatedFilter.categories,
        updatedFilter.description
      )
      .pipe(takeUntil(this.destroySubject))
      .subscribe(expenses => {
        this.currentFilter = updatedFilter;
        this.expenses = expenses;
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
      if (deltaX > GLOBAL_SWIPE_LENGTH) {
        this.navigateBack();
      } else if (deltaX < -GLOBAL_SWIPE_LENGTH) {
        this.navigateAlt();
      }
    }
  }

  navigateBack() {
    this.router.navigate([this.backUrl || '/']);
  }

  navigateAlt() {
    this.router.navigate([this.altUrl || '/']);
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

  onCategorySelected(catId: string) {
    if (!catId) return;
    const date =
      this.currentFilter?.date || this.dateFilterService.getInitialMonthValue();
    const description = this.currentFilter?.description || '';
    this.currentFilter = { categories: [catId], date, description };
    this.initialFilter = { categories: [catId], date, description }; // keep description
    this.applyFilters(this.currentFilter);
  }

  onCategoryRemoved(catId: string) {
    const date =
      this.currentFilter?.date || this.dateFilterService.getInitialMonthValue();
    const description = this.currentFilter?.description || '';
    // remove category if present
    const categories =
      this.currentFilter?.categories.length > 0
        ? this.currentFilter?.categories
        : Categories.map(c => c.id);
    let remaining = categories.filter(c => c !== catId);
    // if we removed the last visible category, interpret as clearing category filter (empty array)
    if (remaining.length === 0) {
      remaining = [];
    }
    this.currentFilter = { categories: remaining, date, description };
    this.initialFilter = { categories: remaining, date, description };
    this.applyFilters(this.currentFilter);
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
