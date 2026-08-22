import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { first, Subject, takeUntil } from 'rxjs';

import { DateFilterComponent } from '../common/component/filter/date/date-filter.component';
import { DateFilterService } from '../common/component/filter/date/date-filter.service';
import { DateFrame } from '../common/component/filter/date/dateFrame.model';
import { ResolvedCategory } from '../common/model/category.model';
import { Expense } from '../common/model/expense.model';
import { CategoryListNamePipe } from '../common/pipe/category-list-name.pipe';
import { ExpenseService } from '../common/service/expense.service';
import { StatisticsBarComponent } from './bar/statistics-bar.component';
import { CommonModule } from '@angular/common';
import { AnalyticsSwitchComponent } from './analytics/analytics-switch.component';
import { MultiChartComponent } from '../common/component/chart/multi/multi-chart.component';
import { CollapsedPanelComponent } from '../common/component/collapsed-panel';
import { SearchInputComponent } from '../common/component/search-input';
import { IrregularSummaryComponent } from '../common/component/irregular-summary.component';
import { SegmentedSwitchComponent } from '../common/component/segmented/segmented-switch.component';
import { MicroVisualsComponent } from '../period-summary/micro/micro-visuals.component';
import { CategoryTypeFiltersComponent } from './category-type-filters/category-type-filters.component';
import { CategoryFilterComponent } from '../common/component/filter/category/category-filter.component';
import { TagSelectorComponent } from '../common/component/tag-selector/tag-selector.component';
import {
  BalanceFilter,
  DEFAULT_BALANCE_FILTER,
} from '../common/model/balance-filter.model';
import {
  SelectDropdownComponent,
  SelectDropdownOption,
} from '../common/component/select-dropdown/select-dropdown.component';
// Dynamic swipe length from store (fallback constant inside service defaults)
import { GlobalSwipeLengthStoreService } from '../common/service/global-swipe-length-store.service';
import { PeriodSummaryIconComponent } from '../common/component/period-summary-icon/period-summary-icon.component';
import {
  trigger,
  transition,
  style,
  animate,
  group,
} from '@angular/animations';
import { SpinnerComponent } from '../common/component/spinner/spinner.component';
import { CategoryService } from '../common/service/category.service';
import { BudgetDataService } from '../common/service/budget-data.service';
import { BudgetLimitSummary } from '../common/model/budget.model';
import { BudgetLimitSummaryService } from '../common/service/budget-limit-summary.service';

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
    IrregularSummaryComponent,
    // Newly added components for category view switch
    SegmentedSwitchComponent,
    MicroVisualsComponent,
    CategoryTypeFiltersComponent,
    CategoryFilterComponent,
    TagSelectorComponent,
    SelectDropdownComponent,
    PeriodSummaryIconComponent,
    SpinnerComponent,
  ],
  animations: [
    trigger('amountValueChange', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateY(-8px) scale(.9)' }),
        animate(
          '390ms cubic-bezier(.22,.61,.36,1)',
          style({ opacity: 1, transform: 'translateY(0) scale(1)' })
        ),
      ]),
    ]),
    trigger('amountFlash', [
      transition('* => *', [
        style({ filter: 'brightness(1.35)', opacity: 0.9 }),
        animate(
          '290ms ease-out',
          style({ filter: 'brightness(1)', opacity: 1 })
        ),
      ]),
    ]),
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
  categories: ResolvedCategory[] = [];
  readonly getCategoryNameByIdFunc = (id: string) => this.getCategoryName(id);
  excludedCategories: string[] = [];
  currentCategories: string[] = [];
  private readonly destroySubject: Subject<void> = new Subject();

  readonly initialFilterValue: DateFrame;

  currentFilter?: DateFrame;

  today: Date = new Date();
  // Removed direct donut chart DOM/ECharts usage; now handled inside AnalyticsSwitchComponent
  regularCategoriesCheckboxValue: boolean = true;
  irregularCategoriesCheckboxValue: boolean = true;

  filteredExpenses: Expense[] = [];
  descriptionSearch: string = '';
  selectedTagIds: string[] = [];
  selectedBalanceFilter: BalanceFilter = DEFAULT_BALANCE_FILTER;
  budgetLimitSummaries: BudgetLimitSummary[] = [];
  // categoryFilterValuesStore: string[] = [];
  categoryFilterValues: string[] = [];
  isHowSuggestionDateButton: boolean = false;
  isFirstLoad: boolean = true;
  readonly balanceFilterOptions: SelectDropdownOption[] = [
    { value: 'all', label: 'Все' },
    { value: 'budget', label: 'Бюджетные' },
    { value: 'nonBudget', label: 'Внебюджетные' },
  ];

  // collapse state for category filters and bars
  collapsed: Record<
    'categoryFilters' | 'multiChart' | 'irregularSummary' | 'analytics',
    boolean
  > = {
    // Only this panel expanded by default; others collapsed
    categoryFilters: true,
    multiChart: true,
    irregularSummary: true,
    analytics: false,
  };

  // Category view switch state (bars | micro | filter)
  categoryView: 'bars' | 'micro' | 'filter' = 'bars';
  readonly categoryViewOptions: {
    value: 'bars' | 'micro' | 'filter';
    label: string;
    iconClass?: string;
    ariaLabel?: string;
  }[] = [
    {
      value: 'bars',
      label: 'Бары',
      iconClass: 'fa-solid fa-chart-bar',
      ariaLabel: 'Бары',
    },
    {
      value: 'micro',
      label: 'Тренды',
      iconClass: 'fa-solid fa-wave-square',
      ariaLabel: 'Тренды',
    },
    {
      value: 'filter',
      label: 'Фильтр',
      iconClass: 'fa-solid fa-filter',
      ariaLabel: 'Фильтр',
    },
  ];

  // Reference to ensure Angular/linters detect template usage of standalone imports (workaround for any false positive diagnostics)
  private readonly _standaloneRefs = [
    SegmentedSwitchComponent,
    MicroVisualsComponent,
  ];

  private globalSwipeLength = 70; // default until store emits

  constructor(
    private router: Router,
    private expenseService: ExpenseService,
    private dateFilterService: DateFilterService,
    private swipeLengthStore: GlobalSwipeLengthStoreService,
    private categoryService: CategoryService,
    private budgetDataService: BudgetDataService,
    private budgetLimitSummaryService: BudgetLimitSummaryService
  ) {
    this.categoryService.categories$
      .pipe(takeUntil(this.destroySubject))
      .subscribe(categories => (this.categories = categories));
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.destroySubject))
      .subscribe();
    this.budgetLimitSummaryService
      .getCurrentLimitSummaries()
      .pipe(takeUntil(this.destroySubject))
      .subscribe(summaries => (this.budgetLimitSummaries = summaries));
    this.initialFilterValue = this.dateFilterService.getInitialDayValue();
    this.initFilter();
  }

  onCategoryViewSelect(v: string) {
    if (v === 'bars' || v === 'micro' || v === 'filter') {
      this.categoryView = v;
    }
    // Category view change can alter filter height via injected content (single pass for smooth CSS transition)
    this.scheduleLayoutStabilization(1);
  }

  onMicroCategorySelected(id: string) {
    // Reuse existing bar filtering logic
    this.filterByCategory(id);
  }

  onMicroCategoryRemoved(id: string) {
    this.onBarClose(id);
  }

  getActiveCategories(): string[] {
    // Active categories are those currently displayed (not excluded). If none excluded, use currentCategories.
    if (!this.excludedCategories || this.excludedCategories.length === 0) {
      return this.currentCategories;
    }
    return this.currentCategories.filter(
      c => !this.excludedCategories.includes(c)
    );
  }

  private updateCategoriesFilterValues(filters: string[]): void {
    const isAllSelected =
      filters.length === 0 || filters.length === this.categories.length;
    const isAllCategoriesSelected =
      this.categoryFilterValues.length === 0 ||
      this.categoryFilterValues.length === this.categories.length;
    if (isAllSelected && isAllCategoriesSelected) {
      return;
    }
    if (filters?.length === this.categoryFilterValues?.length) {
      return;
    }
    if (filters?.length !== this.categoryFilterValues?.length) {
      this.categoryFilterValues = filters;
    }
  }

  private initFilter(): void {
    if (this.dateFilterService.dateFilter) {
      this.currentFilter = {
        ...this.dateFilterService.dateFilter,
      };
      this.dateFilterService.dateFilter = undefined;
    } else {
      this.currentFilter = {
        ...this.initialFilterValue,
      };
    }
    const categoryFilters = this.dateFilterService.categories;
    if (Array.isArray(categoryFilters) && categoryFilters.length > 0) {
      this.excludedCategories = this.categories
        .filter(
          category => !this.dateFilterService.categories.includes(category?.id)
        )
        .map(category => category.id);
      this.updateCategoriesFilterValues(this.dateFilterService.categories);
      this.dateFilterService.categories = undefined;
    }

    const descriptionFilter = this.dateFilterService.description;
    if (descriptionFilter) {
      this.descriptionSearch = descriptionFilter;
      this.dateFilterService.description = undefined;
    }

    const tagIds = this.dateFilterService.tagIds;
    if (Array.isArray(tagIds) && tagIds.length > 0) {
      this.selectedTagIds = [...tagIds];
      this.dateFilterService.tagIds = undefined;
    }

    this.selectedBalanceFilter =
      this.dateFilterService.balanceFilter || DEFAULT_BALANCE_FILTER;
    this.dateFilterService.balanceFilter = undefined;
  }

  onDescriptionSearchChange(value: string): void {
    // Debounce could be added if needed; for now immediate filter
    this.descriptionSearch = value?.trim();
    this.calculateCategoryTotals();
  }

  ngAfterViewInit(): void {
    // Load dynamic swipe threshold synchronously
    this.globalSwipeLength = this.swipeLengthStore.getSwipeLength();
    window.scrollTo({ top: 0, behavior: 'auto' });
    // Initial totals still required for other statistics sections
    this.calculateCategoryTotals();
    // Initialize dynamic layout once view children exist
    queueMicrotask(() => this.initDynamicLayout());
    // Defer fade-in of content so transition triggers (opacity start 0 in template)
    requestAnimationFrame(() => {
      const content = this.statsContentRef?.nativeElement;
      if (content) {
        content.style.opacity = '1';
      }
    });
  }

  toggle(
    section: 'categoryFilters' | 'multiChart' | 'irregularSummary' | 'analytics'
  ): void {
    const currentlyCollapsed = this.collapsed[section];
    // Collapse all panels first (exclusive expansion behavior)
    Object.keys(this.collapsed).forEach(key => {
      this.collapsed[key as keyof typeof this.collapsed] = true; // set all to collapsed
    });
    // If the target panel was collapsed, expand it; if it was expanded, keep all collapsed
    this.collapsed[section] = currentlyCollapsed; // currentlyCollapsed true means panel was collapsed; we want to invert after exclusive reset
    if (currentlyCollapsed) {
      // expand only the requested panel
      this.collapsed[section] = false;
    } else {
      // leave it collapsed (all collapsed state)
      this.collapsed[section] = true;
    }
    // Layout stabilization after height change
    this.scheduleLayoutStabilization(1);
  }

  // initPieChart removed; donut now lives in AnalyticsSwitchComponent

  onFilterChange(frame: DateFrame): void {
    if (frame?.display !== this.currentFilter?.display) {
      this.currentFilter = frame;
      this.calculateCategoryTotals();
    }
    // Filter UI may change wrapper height: recalc layout (single pass)
    this.scheduleLayoutStabilization(1);
  }

  navigateToHistory(categoryId?: string, dateFrame?: DateFrame): void {
    if (categoryId) {
      this.dateFilterService.categories = [categoryId];
    } else {
      this.dateFilterService.categories = this.getRemainCategories();
    }
    this.dateFilterService.description = this.descriptionSearch;
    this.dateFilterService.tagIds = this.selectedTagIds;
    this.dateFilterService.balanceFilter = this.selectedBalanceFilter;
    this.dateFilterService.dateFilter = dateFrame || this.currentFilter;
    this.router.navigate(['/history']);
  }

  navigateToPeriodSummary(): void {
    this.router.navigate(['/period-summary']);
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
    const useCache = this.currentFilter?.mode !== 'year';
    this.expenseService
      .getExpenses(
        this.currentFilter,
        categories,
        this.descriptionSearch,
        useCache,
        this.selectedTagIds,
        this.selectedBalanceFilter
      )
      .pipe(first(), takeUntil(this.destroySubject))
      .subscribe(expenses => {
        expensesFilteredByDate = expenses;
        if (isCurrentCategoriesUpdate) {
          this.currentCategories = Array.from(
            new Set(expensesFilteredByDate.map(expense => expense.category))
          );
        }
        this.filteredExpenses = expensesFilteredByDate;
        if (this.isFirstLoad) {
          this.isFirstLoad = false;
          this.isHowSuggestionDateButton = expensesFilteredByDate.length === 0;
        }
        expensesFilteredByDate.forEach(expense => {
          if (!categoryMap[expense.category]) {
            categoryMap[expense.category] = 0;
          }
          categoryMap[expense.category] =
            Math.round((categoryMap[expense.category] + expense.amount) * 100) /
            100;
          if (!expense.includeInBalance) {
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

  trackByCategoryTotal(
    index: number,
    item: {
      category: string;
      amount: number;
      percentage: number;
      color: string;
    }
  ) {
    // Category id is stable; using it prevents re-rendering unchanged bars.
    return item.category;
  }

  trackByBudgetLimitSummary(_: number, summary: BudgetLimitSummary): string {
    return summary.id;
  }

  getBudgetLimitProgressWidth(summary: BudgetLimitSummary): number {
    return Math.max(0, Math.min(100, summary.percentUsed));
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
      if (deltaX > this.globalSwipeLength) {
        this.onSwipeRight();
      } else if (deltaX < -this.globalSwipeLength) {
        this.onSwipeLeft();
      }
    }
  }

  onSwipeLeft() {
    this.router.navigate(['/']);
    // Handle the left swipe action here
  }
  onSwipeRight() {
    // this.router.navigate(['/history']);
    this.navigateToHistory();
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
    this.descriptionSearch = '';
    this.selectedTagIds = [];
    this.selectedBalanceFilter = DEFAULT_BALANCE_FILTER;
    this.updateCategoriesFilterValues([]);
    this.currentFilter = { ...this.initialFilterValue };
    this.calculateCategoryTotals(null, false);
  }

  onTagIdsChange(tagIds: string[]): void {
    this.selectedTagIds = tagIds || [];
    this.calculateCategoryTotals();
  }

  onBalanceFilterChange(balanceFilter: string | null): void {
    this.selectedBalanceFilter =
      (balanceFilter as BalanceFilter) || DEFAULT_BALANCE_FILTER;
    if (this.selectedBalanceFilter === 'budget') {
      this.budgetDataService
        .getCurrentBudgetFilterFrame()
        .pipe(first(), takeUntil(this.destroySubject))
        .subscribe(frame => {
          this.currentFilter = frame;
          this.calculateCategoryTotals();
          this.scheduleLayoutStabilization(1);
        });
      return;
    }

    this.calculateCategoryTotals();
  }

  onBudgetPeriodShortcut(frame: DateFrame): void {
    this.selectedBalanceFilter = 'budget';
    this.currentFilter = frame;
    this.calculateCategoryTotals();
    this.scheduleLayoutStabilization(1);
  }

  onCategoriesRefresh(): void {
    this.categoryTotals = [];
    this.irregularCategoriesCheckboxValue = true;
    this.regularCategoriesCheckboxValue = true;
    this.excludedCategories = [];
    this.updateCategoriesFilterValues([]);
    this.calculateCategoryTotals(null, false);
  }

  onBarClose(category: string): void {
    this.updateByExcludedCategories([category]);
  }

  onRegularCategoriesCheckboxClick(value: boolean): void {
    this.regularCategoriesCheckboxValue = value;
    if (!value) {
      if (this.irregularCategoriesCheckboxValue) {
        const regularCategories = this.categories
          .filter(category => !category.includeInBalance)
          .map(category => category.id);
        this.excludedCategories = [...regularCategories];
        this.updateCategoriesFilterValuesByExcluded(this.excludedCategories);
        this.calculateCategoryTotals(null, false);
      } else {
        this.excludedCategories = [];
        this.updateCategoriesFilterValuesByExcluded(this.excludedCategories);
        this.calculateCategoryTotals(null, false);
      }
    } else {
      if (this.irregularCategoriesCheckboxValue) {
        this.excludedCategories = [];
        this.updateCategoriesFilterValuesByExcluded(this.excludedCategories);
        this.calculateCategoryTotals(null, false);
      } else {
        this.onIrregularCategoriesCheckboxClick(false);
      }
    }
  }

  private updateCategoriesFilterValuesByExcluded(excludedCategories: string[]) {
    let filters = [];
    if (
      excludedCategories.length !== 0 &&
      excludedCategories.length !== this.categories.length
    ) {
      filters = this.categories
        .map(category => category.id)
        .filter(id => !excludedCategories.includes(id));
    }
    this.updateCategoriesFilterValues(filters);
  }

  onIrregularCategoriesCheckboxClick(value: boolean): void {
    this.irregularCategoriesCheckboxValue = value;
    if (!value) {
      if (this.regularCategoriesCheckboxValue) {
        const irregularCategories = this.categories
          .filter(category => category.includeInBalance)
          .map(category => category.id);
        this.excludedCategories = [...irregularCategories];
        this.updateCategoriesFilterValuesByExcluded(this.excludedCategories);
        this.calculateCategoryTotals(null, false);
      } else {
        this.excludedCategories = [];
        this.updateCategoriesFilterValuesByExcluded(this.excludedCategories);
        this.calculateCategoryTotals(null, false);
      }
    } else {
      if (this.regularCategoriesCheckboxValue) {
        this.excludedCategories = [];
        this.updateCategoriesFilterValuesByExcluded(this.excludedCategories);
        this.calculateCategoryTotals(null, false);
      } else {
        this.onRegularCategoriesCheckboxClick(false);
      }
    }
  }

  filterByCategory(category: string): void {
    const filteredCategories = this.categories
      .map(cat => cat.id)
      .filter(item => item !== category);
    const updatedCategorises = Array.from(
      new Set([...this.excludedCategories, ...filteredCategories])
    );
    this.excludedCategories = updatedCategorises;
    this.updateCategoriesFilterValues([category]);
    this.calculateCategoryTotals(category, false);
  }

  private updateByExcludedCategories(categories: string[]): void {
    const updatedExcludedCategories = Array.from(
      new Set([...this.excludedCategories, ...categories])
    );
    if (updatedExcludedCategories.length === this.categories.length) {
      this.excludedCategories = [];
      this.updateCategoriesFilterValues([]);
      this.irregularCategoriesCheckboxValue = true;
      this.regularCategoriesCheckboxValue = true;
    } else {
      this.excludedCategories = updatedExcludedCategories;
      this.updateCategoriesFilterValuesByExcluded(this.excludedCategories);
    }
    this.calculateCategoryTotals(null, false);
  }

  private getRemainCategories(): string[] {
    if (this.excludedCategories?.length === 0) {
      return [];
    }
    return this.categories
      .filter(category => !this.excludedCategories.includes(category?.id))
      .map(category => category.id);
  }

  onCategoryFilterSelected(categories: string[]): void {
    // Selected categories represent the ONLY categories to include.
    // Convert to excludedCategories list used by rest of logic.
    if (!categories || categories.length === 0) {
      // empty array means all categories
      this.excludedCategories = [];
    } else {
      const allIds = this.categories.map(c => c.id);
      this.excludedCategories = allIds.filter(id => !categories.includes(id));
    }
    this.categoryFilterValues = categories;
    this.calculateCategoryTotals(null, true);
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
    this.teardownDynamicLayout();
  }

  private getCategoryName(id: string): string {
    return (
      this.categories.find(category => category.id === id)?.name ||
      `Unknown category (${id})`
    );
  }

  // -------- Fixed wrapper height -> content offset --------
  @ViewChild('fixedWrapper') private fixedWrapperRef?: ElementRef<HTMLElement>;
  @ViewChild('statsContent') private statsContentRef?: ElementRef<HTMLElement>;

  private wrapperObserver?: ResizeObserver;
  private mutationObserver?: MutationObserver;
  private resizeHandler = () => this.applyContentOffset();
  private lastHeight = -1;
  private layoutTimeouts: number[] = [];
  private offsetFramePending = false;

  private initDynamicLayout(): void {
    const wrapperEl = this.fixedWrapperRef?.nativeElement;
    if (!wrapperEl) {
      return;
    }
    this.wrapperObserver = new ResizeObserver(() => this.applyContentOffset());
    this.wrapperObserver.observe(wrapperEl);
    this.mutationObserver = new MutationObserver(() =>
      this.applyContentOffset()
    );
    this.mutationObserver.observe(wrapperEl, {
      childList: true,
      subtree: true,
    });
    window.addEventListener('resize', this.resizeHandler, { passive: true });
    this.applyContentOffset();
  }

  private teardownDynamicLayout(): void {
    if (this.wrapperObserver && this.fixedWrapperRef?.nativeElement) {
      this.wrapperObserver.unobserve(this.fixedWrapperRef.nativeElement);
      this.wrapperObserver.disconnect();
    }
    this.mutationObserver?.disconnect();
    window.removeEventListener('resize', this.resizeHandler);
    this.clearPendingLayoutStabilization();
  }

  private applyContentOffset(): void {
    if (this.offsetFramePending) {
      return;
    }

    this.offsetFramePending = true;
    requestAnimationFrame(() => {
      this.offsetFramePending = false;
      const height = this.fixedWrapperRef?.nativeElement?.offsetHeight || 0;
      if (height === this.lastHeight) {
        return;
      }
      this.lastHeight = height;
      if (this.statsContentRef?.nativeElement) {
        this.statsContentRef.nativeElement.style.marginTop = height + 'px';
      }
    });
  }

  private scheduleLayoutStabilization(
    iterations: number = 3,
    intervalMs: number = 40
  ): void {
    this.clearPendingLayoutStabilization();
    let count = 0;
    const run = () => {
      this.applyContentOffset();
      if (++count < iterations) {
        const timeoutId = window.setTimeout(run, intervalMs);
        this.layoutTimeouts.push(timeoutId);
      }
    };
    run();
  }

  private clearPendingLayoutStabilization(): void {
    this.layoutTimeouts.forEach(timeoutId => window.clearTimeout(timeoutId));
    this.layoutTimeouts = [];
  }
}
