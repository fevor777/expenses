import { AfterViewInit, Component, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as echarts from 'echarts';
import { first, Subject, takeUntil } from 'rxjs';

import { getCategoryById, getCategoryNameById } from '../common/categories';
import { DateFilterComponent } from '../common/component/filter/date/date-filter.component';
import { DateFilterService } from '../common/component/filter/date/date-filter.service';
import { DateFrame, Mode } from '../common/component/filter/date/dateFrame.model';
import { Expense } from '../common/expense.model';
import { ExpenseService } from '../common/expense.service';
import { getExpensesFromTo } from './functions/expense-helpers';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
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

  readonly initialFilterValue = DateFilterComponent.initialValue;

  currentFilter?: DateFrame = this.initialFilterValue;

  today: Date = new Date();

  chartDom: HTMLElement;
  myChart;

  regularCategoriesCheckboxValue: boolean = true;
  irregularCategoriesCheckboxValue: boolean = true;

  currentDay: string = this.today.toLocaleDateString('ru-RU', {
    weekday: 'short', // 'Thu'
    month: 'short', // 'Aug'
    day: 'numeric', // '12'
  });

  filteredExpenses: Expense[];

  constructor(
    private router: Router,
    private expenseService: ExpenseService,
    private dateFilterService: DateFilterService
  ) {}

  ngAfterViewInit(): void {
    this.chartDom = document.getElementById('donut-chart')!;
    this.myChart = echarts.init(this.chartDom);
    this.calculateCategoryTotals();
  }

  initPieChart() {
    const totalAmount = this.categoryTotals.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}€ ({d}%)',
      },
      series: [
        {
          name: 'Category',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'outside',
            formatter: [
              '{d|{b}}', // Bold category name
              // '{b|{c}€}', // Percentage
            ].join('\n'),
            rich: {
              d: {
                fontSize: 14,
              },
              // d: {
              //   color: '#616161',
              // },
            },
          },
          labelLine: {
            show: true,
            length: 5,
            length2: 5,
          },
          data: this.categoryTotals.map((item) => ({
            value: item.amount,
            name: getCategoryNameById(item.category),
          })),
        },
      ],
      graphic: {
        type: 'text',
        left: 'center',
        top: 'center',
        style: {
          text: totalAmount.toLocaleString() + '€',
          textAlign: 'center',
          fill: '#000',
          fontSize: 20,
          fontWeight: 'bold',
        },
      },
    };

    this.myChart.setOption(option);
  }

  onFilterChange(frame: DateFrame): void {
    if (frame?.display !== this.currentFilter?.display) {
      this.currentFilter = frame;
      this.excludedCategories = [];
      this.irregularCategoriesCheckboxValue = true;
      this.regularCategoriesCheckboxValue = true;
      this.calculateCategoryTotals();
    }
  }

  navigateToDetails(categoryId: string): void {
    this.dateFilterService.categories = [categoryId];
    this.dateFilterService.dateFilter = this.currentFilter;
    this.router.navigate(['/history']);
  }

  calculateCategoryTotals(): void {
    const categoryMap: { [key: string]: number } = {};
    let expensesFilteredByDate = [];
    this.totalAmount = 0;
    this.regularAmount = 0;
    this.irregularAmount = 0;

    this.expenseService
      .getExpenses()
      .pipe(first(), takeUntil(this.destroySubject))
      .subscribe((expenses) => {
        expensesFilteredByDate = getExpensesFromTo(
          expenses,
          this.currentFilter.start,
          this.currentFilter.finish
        );
        this.currentCategories = Array.from(
          new Set(expensesFilteredByDate.map((expense) => expense.category))
        );
        const expensesFiltered = expensesFilteredByDate.filter(
          (expense) => !this.excludedCategories.includes(expense.category)
        );
        this.filteredExpenses = expensesFiltered;
        expensesFiltered.forEach((expense) => {
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
        this.initPieChart();
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

  getColorForPieChart(): string {
    const red = Math.floor(Math.random() * 106) + 150;
    const green = Math.floor(Math.random() * 106) + 150;
    // Generate a random value for the blue component (200-255) to ensure it's a soft blue
    const blue = Math.floor(Math.random() * 56) + 200;

    // Convert the components to hexadecimal and pad with leading zeros if necessary
    const redHex = red.toString(16).padStart(2, '0');
    const greenHex = green.toString(16).padStart(2, '0');
    const blueHex = blue.toString(16).padStart(2, '0');

    // Combine the components into a single color string
    const hexColor = `#${redHex}${greenHex}${blueHex}`;
    return hexColor;
  }

  onRefresh(): void {
    this.categoryTotals = [];
    this.irregularCategoriesCheckboxValue = true;
    this.regularCategoriesCheckboxValue = true;
    this.excludedCategories = [];
    this.calculateCategoryTotals();
  }

  onBarClose(category: string): void {
    this.updateByExcludedCategories([category]);
  }

  onRegularCategoriesCheckboxClick(value: boolean): void {
    if (value) {
      const regularCategories = this.currentCategories
        .map(getCategoryById)
        .filter((category) => !category.includeInBalance)
        .map((category) => category.id);
      this.excludedCategories = this.excludedCategories.filter(
        (category) => !regularCategories.includes(category)
      );
      this.calculateCategoryTotals();
    } else {
      const regularCategories = this.currentCategories
        .map(getCategoryById)
        .filter((category) => !category.includeInBalance)
        .map((category) => category.id);
      this.updateByExcludedCategories(regularCategories);
    }
  }

  onIrregularCategoriesCheckboxClick(value: boolean): void {
    if (value) {
      const irregularCategories = this.currentCategories
        .map(getCategoryById)
        .filter((category) => category.includeInBalance)
        .map((category) => category.id);
      this.excludedCategories = this.excludedCategories.filter(
        (category) => !irregularCategories.includes(category)
      );
      this.calculateCategoryTotals();
    } else {
      const irregularCategories = this.currentCategories
        .map(getCategoryById)
        .filter((category) => category.includeInBalance)
        .map((category) => category.id);
      this.updateByExcludedCategories(irregularCategories);
    }
  }

  filterByCategory(category: string): void {
    const filteredCategories = this.currentCategories.filter((item) => item !== category);
    this.updateByExcludedCategories(filteredCategories);
  }

  private updateByExcludedCategories(categories: string[]): void {
    this.excludedCategories = Array.from(
      new Set([...this.excludedCategories, ...categories])
    );
    this.calculateCategoryTotals();
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
