import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as echarts from 'echarts';
import { Observable, Subject, takeUntil } from 'rxjs';

import { getCategoryNameById } from '../common/categories';
import { DateFilterService } from '../common/component/filter/date-filter.service';
import { DateFrame, Mode } from '../common/component/filter/dateFrame.model';
import { Expense } from '../common/expense.model';
import { ExpenseService } from '../common/expense.service';
import { getExpensesFromTo } from './functions/expense-helpers';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit, OnDestroy {
  categoryTotals: {
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }[] = [];
  totalAmount: number = 0;
  readonly getCategoryNameByIdFunc = getCategoryNameById;
  excludedCategories: string[] = [];
  showFilters: boolean = false;
  private readonly destroySubject: Subject<void> = new Subject();

  currentDateFrame?: Observable<DateFrame>;

  // chartData = new BehaviorSubject<any[]>([]);
  // chartLabels = new BehaviorSubject<string[]>([]);

  // chartData$ = this.chartData.asObservable();
  // chartLabels$ = this.chartLabels.asObservable();

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
    private dateFilterService: DateFilterService
  ) { }

  ngOnInit(): void {
    this.currentDateFrame = this.dateFilterService.dateFrame$;
    this.calculateCategoryTotals();
  }

  initPieChart() {
    const chartDom = document.getElementById('donut-chart')!;
    const myChart = echarts.init(chartDom);

    const totalAmount = this.categoryTotals.reduce((sum, item) => sum + item.amount, 0);

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
            formatter: '{b}\n{d}%)',
          },
          labelLine: {
            show: true,
            length: 20,
            length2: 20,
          },
          data: this.categoryTotals
            .map(item => ({
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
          text: totalAmount.toLocaleString() + ' €',
          textAlign: 'center',
          fill: '#000',
          fontSize: 30,
          fontWeight: 'bold',
        },
      },
    };

    myChart.setOption(option);
  }

  toggleExpandFilters(): void {
    this.showFilters = !this.showFilters;
  }

  showCategoryDetails(categoryId: string): void {
    this.router.navigate(['/details'], {
      queryParams: {
        'category-id': categoryId,
        'back-url': '/statistics',
      },
    });
  }


  calculateCategoryTotals(): void {
    const currentDateFrame = this.dateFilterService.getCurrentDateFrame();
    const categoryMap: { [key: string]: number } = {};
    let expensesFiltered = [];
    this.totalAmount = 0;

    this.expenseService.getExpenses().pipe(takeUntil(this.destroySubject)).subscribe((expenses) => {
      expensesFiltered = getExpensesFromTo(expenses, currentDateFrame.start, currentDateFrame.finish);
      this.calculateChartData(expensesFiltered);
      expensesFiltered.forEach((expense) => {
        if (!categoryMap[expense.category]) {
          categoryMap[expense.category] = 0;
        }
        categoryMap[expense.category] =
          Math.round((categoryMap[expense.category] + expense.amount) * 100) /
          100;
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
        this.categoryTotals.sort((a, b) => a.amount - b.amount);
      }
      this.initPieChart();
    });
  }

  calculateChartData(expensesFiltered: Expense[]): void {
    const currentDateFrame = this.dateFilterService.getCurrentDateFrame();
    if (!currentDateFrame.mode || currentDateFrame.mode === Mode.DAY) {
      this.chartOptions.labels = new Array(24).fill(0).map((_, i) => {
        return i + ':00';
      });
      this.chartOptions.datasets[0].data = new Array(24).fill(0);

      //data on hours after current make null
      for (let i = new Date().getHours(); i < 24; i++) {
        this.chartOptions.datasets[0].data[i] = null;
      }
    }

    if (currentDateFrame.mode === Mode.WEEK) {
      this.chartOptions.labels = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
      this.chartOptions.datasets[0].data = new Array(7).fill(0);

      //data on days after current make null
      for (let i = new Date().getDay(); i < 7; i++) {
        this.chartOptions.datasets[0].data[i] = null;
      }
    }

    if (currentDateFrame.mode === Mode.MONTH) {
      this.chartOptions.labels = new Array(31).fill(0).map((_, i) => {
        return i + 1;
      });
      this.chartOptions.datasets[0].data = new Array(31).fill(0);

      //data on days after current make null
      for (let i = new Date().getDate(); i < 31; i++) {
        this.chartOptions.datasets[0].data[i] = null;
      }
    }

    expensesFiltered.forEach((expense) => {
      //sum data for chart
      if (!currentDateFrame.mode || currentDateFrame.mode === Mode.DAY) {
        const hour = new Date(expense.date).getHours();
        this.chartOptions.datasets[0].data[hour] =
          Math.round(
            (this.chartOptions.datasets[0].data[hour] + expense.amount) *
            100
          ) / 100;
      }

      if (currentDateFrame.mode === Mode.WEEK) {
        const day = new Date(expense.date).getDay();
        this.chartOptions.datasets[0].data[day] =
          Math.round(
            (this.chartOptions.datasets[0].data[day] + expense.amount) * 100
          ) / 100;
      }

      if (currentDateFrame.mode === Mode.MONTH) {
        const day = new Date(expense.date).getDate();
        this.chartOptions.datasets[0].data[day - 1] =
          Math.round(
            (this.chartOptions.datasets[0].data[day - 1] + expense.amount) *
            100
          ) / 100;
      }
    });

    if (currentDateFrame.mode === Mode.WEEK) {
      this.chartOptions.labels.push(this.chartOptions.labels.shift());
      this.chartOptions.datasets[0].data.push(
        this.chartOptions.datasets[0].data.shift()
      );

      //make null for sunday if its not sunday
      if (new Date().getDay() !== 0) {
        this.chartOptions.datasets[0].data[6] = null;
      }
    }
    
    this.chartOptions = { ...this.chartOptions, datasets: [...this.chartOptions.datasets] };
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
    this.totalAmount = 0;
    this.excludedCategories = [];
    this.calculateCategoryTotals();
  }

  onBarClose(category: string): void {
    this.excludedCategories = [...this.excludedCategories, category];
    this.totalAmount = this.categoryTotals
      .filter((c) => !this.excludedCategories.includes(c.category))
      .reduce((total, c) => Math.round((total + c.amount) * 100) / 100, 0);
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
