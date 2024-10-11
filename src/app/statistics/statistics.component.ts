import { AfterViewInit, Component, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as echarts from 'echarts';
import { Subject, first, takeUntil } from 'rxjs';

import { getCategoryById, getCategoryNameById } from '../common/categories';
import { DateFrame, Mode } from '../common/component/filter/dateFrame.model';
import { Expense } from '../common/expense.model';
import { ExpenseService } from '../common/expense.service';
import { getExpensesFromTo } from './functions/expense-helpers';
import { DateFilterComponent } from '../common/component/filter/date-filter.component';

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

  currentFilter?: DateFrame = DateFilterComponent.initialValue;

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

  chartOptions: any = {
    datasets: [
      {
        data: [1],
        label: 'Expenses',
      },
    ],
    labels: ['1'],
    options: {
      responsive: true,
    },
    colors: [
      {
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)',
      },
    ],
    legend: false,
  };

  constructor(
    private router: Router,
    private expenseService: ExpenseService,
    // private dateFilterService: DateFilterService
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

  showCategoryDetails(categoryId: string): void {
    this.router.navigate(['/details'], {
      queryParams: {
        'category-id': categoryId,
        'back-url': '/statistics',
      },
    });
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

  calculateCategoryTotals(): void {
    // const currentDateFrame = this.dateFilterService.getCurrentDateFrame();
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
        this.calculateChartData(expensesFiltered);
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

  calculateChartData(expensesFiltered: Expense[]): void {
    // const currentDateFrame = this.dateFilterService.getCurrentDateFrame();
    if (!this.currentFilter.mode || this.currentFilter.mode === Mode.DAY) {
      this.chartOptions.labels = new Array(24).fill(0).map((_, i) => {
        return i + ':00';
      });
      this.chartOptions.datasets[0].data = new Array(24).fill(0);

      //data on hours after current make null
      for (let i = new Date().getHours(); i < 24; i++) {
        this.chartOptions.datasets[0].data[i] = null;
      }
    }

    if (this.currentFilter.mode === Mode.WEEK) {
      this.chartOptions.labels = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
      this.chartOptions.datasets[0].data = new Array(7).fill(0);

      //data on days after current make null
      for (let i = new Date().getDay(); i < 7; i++) {
        this.chartOptions.datasets[0].data[i] = null;
      }
    }

    if (this.currentFilter.mode === Mode.MONTH) {
      this.chartOptions.labels = new Array(31).fill(0).map((_, i) => {
        return i + 1;
      });
      this.chartOptions.datasets[0].data = new Array(31).fill(0);

      //data on days after current make null
      for (let i = new Date().getDate(); i < 31; i++) {
        this.chartOptions.datasets[0].data[i] = null;
      }
    }

    if (this.currentFilter.mode === Mode.YEAR) {
      this.chartOptions.labels = ['янв.', 'фев.', 'март', 'апр.', 'май', 'июнь', 'июль', 'авг.', 'сен.', 'окт.', 'нояб.', 'дек.'];
      this.chartOptions.datasets[0].data = new Array(12).fill(0);
      for (let i = new Date().getMonth(); i < 12; i++) {
        this.chartOptions.datasets[0].data[i] = null;
      }
    }

    expensesFiltered.forEach((expense) => {
      //sum data for chart
      if (!this.currentFilter.mode || this.currentFilter.mode === Mode.DAY) {
        const hour = new Date(expense.date).getHours();
        this.chartOptions.datasets[0].data[hour] =
          Math.round(
            (this.chartOptions.datasets[0].data[hour] + expense.amount) * 100
          ) / 100;
      }

      if (this.currentFilter.mode === Mode.WEEK) {
        const day = new Date(expense.date).getDay();
        this.chartOptions.datasets[0].data[day] =
          Math.round(
            (this.chartOptions.datasets[0].data[day] + expense.amount) * 100
          ) / 100;
      }

      if (this.currentFilter.mode === Mode.MONTH) {
        const day = new Date(expense.date).getDate();
        this.chartOptions.datasets[0].data[day - 1] =
          Math.round(
            (this.chartOptions.datasets[0].data[day - 1] + expense.amount) * 100
          ) / 100;
      }

      if (this.currentFilter.mode === Mode.YEAR) {
        const month = new Date(expense.date).getMonth();
        this.chartOptions.datasets[0].data[month] =
          Math.round(
            (this.chartOptions.datasets[0].data[month] + expense.amount) * 100
          ) / 100;
      }
    });

    if (this.currentFilter.mode === Mode.WEEK) {
      this.chartOptions.labels.push(this.chartOptions.labels.shift());
      this.chartOptions.datasets[0].data.push(
        this.chartOptions.datasets[0].data.shift()
      );

      //make null for sunday if its not sunday
      // if (new Date().getDay() !== 0) {
      //   this.chartOptions.datasets[0].data[6] = null;
      // }
    }

    this.chartOptions = {
      ...this.chartOptions,
      datasets: [...this.chartOptions.datasets],
    };
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
