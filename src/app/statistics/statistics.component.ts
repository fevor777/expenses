import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getCategoryNameById } from '../common/categories';
import { BehaviorSubject } from 'rxjs';

enum Mode {
  TODAY = 'today',
  WEEK = 'week',
  MONTH = 'month',
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  categoryTotals: {
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }[] = [];
  totalAmount: number = 0;
  readonly getCategoryNameByIdFunc = getCategoryNameById;
  excludedCategories: string[] = [];

  // chartData = new BehaviorSubject<any[]>([]);
  // chartLabels = new BehaviorSubject<string[]>([]);

  // chartData$ = this.chartData.asObservable();
  // chartLabels$ = this.chartLabels.asObservable();

  chartOptions: any = {
    datasets: [
      {
        data: [1],
        label: 'Expenses',
      }
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

  mode = 'today';
  title = 'за сегодня';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.calculateCategoryTotals();
  }

  showCategoryDetails(categoryId: string): void {
    this.router.navigate(['/details'], {
      queryParams: {
        'category-id': categoryId,
        'back-url': '/statistics',
      },
    });
  }

  calculateCategoryTotals(mode?: Mode): void {
    let sinceWhen = new Date();
    if (mode === Mode.WEEK) {
      const dayOfWeek = sinceWhen.getDay();
      const daysUntilMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      sinceWhen.setDate(sinceWhen.getDate() - daysUntilMonday);
    }
    if (mode === Mode.MONTH) {
      sinceWhen = new Date(sinceWhen.setDate(1));
    }
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');

    const categoryMap: { [key: string]: number } = {};

    if (!mode || mode === Mode.TODAY) {
      this.chartOptions.labels = new Array(24).fill(0).map((_, i) => {
        return i + ':00';
      });
      this.chartOptions.datasets[0].data = new Array(24).fill(0);

      //data on hours after current make null
      for (let i = new Date().getHours(); i < 24; i++) {
        this.chartOptions.datasets[0].data[i] = null;
      }
    }

    if (mode === Mode.WEEK) {
      this.chartOptions.labels = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
      this.chartOptions.datasets[0].data = new Array(7).fill(0);

      //data on days after current make null
      for (let i = new Date().getDay(); i < 7; i++) {
        this.chartOptions.datasets[0].data[i] = null;
      }
    }

    if (mode === Mode.MONTH) {
      this.chartOptions.labels = new Array(31).fill(0).map((_, i) => {
        return i + 1;
      });
      this.chartOptions.datasets[0].data = new Array(31).fill(0);

      //data on days after current make null
      for (let i = new Date().getDate(); i < 31; i++) {
        this.chartOptions.datasets[0].data[i] = null;
      }
    }

    // Calculate total amount per category
    expenses
      .filter((expense: { date: number }) => {
        const date = new Date(expense.date);
        return (
          date.getDate() >= sinceWhen.getDate() &&
          date.getMonth() === sinceWhen.getMonth() &&
          date.getFullYear() === sinceWhen.getFullYear()
        );
      })
      .forEach((expense) => {
        //sum data for chart
        if (!mode || mode === Mode.TODAY) {
          const hour = new Date(expense.date).getHours();
          this.chartOptions.datasets[0].data[hour] =
            Math.round((this.chartOptions.datasets[0].data[hour] + expense.amount) * 100) / 100;
        }

        if (mode === Mode.WEEK) {
          const day = new Date(expense.date).getDay();
          this.chartOptions.datasets[0].data[day] =
            Math.round((this.chartOptions.datasets[0].data[day] + expense.amount) * 100) / 100;
        }

        if (mode === Mode.MONTH) {
          const day = new Date(expense.date).getDate();
          this.chartOptions.datasets[0].data[day - 1] =
            Math.round((this.chartOptions.datasets[0].data[day - 1] + expense.amount) * 100) / 100;
        }


        if (!categoryMap[expense.category]) {
          categoryMap[expense.category] = 0;
        }
        categoryMap[expense.category] =
          Math.round((categoryMap[expense.category] + expense.amount) * 100) /
          100;
        this.totalAmount =
          Math.round((this.totalAmount + expense.amount) * 100) / 100;
      });

    // Calculate percentage for each category
    for (const category in categoryMap) {
      const amount = categoryMap[category];
      const percentage = (amount / this.totalAmount) * 100;
      const color = this.getColor(percentage);
      this.categoryTotals.push({ category, amount, percentage, color });
      this.categoryTotals.sort((a, b) => a.amount - b.amount);
    }

    if (mode === Mode.WEEK) {
      this.chartOptions.labels.push(this.chartOptions.labels.shift());
      this.chartOptions.datasets[0].data.push(this.chartOptions.datasets[0].data.shift());

      //make null for sunday if its not sunday
      if (new Date().getDay() !== 0) {
        this.chartOptions.datasets[0].data[6] = null;
      }
    }

    console.log(this.chartOptions);
  }

  calculateChartValues(): void {}

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

  changeMode(mode: Mode): void {
    this.mode = mode;
    this.categoryTotals = [];
    this.totalAmount = 0;
    this.calculateCategoryTotals(mode);
    this.title =
      mode === Mode.TODAY
        ? 'за сегодня'
        : mode === Mode.WEEK
        ? 'на этой неделе'
        : 'в этом месяце';
  }

  protected readonly Mode = Mode;
}
