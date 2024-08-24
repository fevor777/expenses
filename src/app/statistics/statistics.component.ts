import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getCategoryNameById } from '../common/categories';

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
      sinceWhen = new Date(sinceWhen.setDate(sinceWhen.getDate() - sinceWhen.getDay()));
    }
    if (mode === Mode.MONTH) {
      sinceWhen = new Date(sinceWhen.setDate(1));
    }
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');

    const categoryMap: { [key: string]: number } = {};

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
        if (!categoryMap[expense.category]) {
          categoryMap[expense.category] = 0;
        }
        categoryMap[expense.category] = Math.round((categoryMap[expense.category] + expense.amount) * 100) / 100;
        this.totalAmount = Math.round((this.totalAmount + expense.amount) * 100) / 100;
      });

    // Calculate percentage for each category
    for (const category in categoryMap) {
      const amount = categoryMap[category];
      const percentage = (amount / this.totalAmount) * 100;
      const color = this.getColor(percentage);
      this.categoryTotals.push({ category, amount, percentage, color });
      this.categoryTotals.sort((a, b) => a.amount - b.amount);
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
    this.router.navigate(['/']);
    // Handle the left swipe action here
  }
  onSwipeRight() {
    this.router.navigate(['/history']);
    // Handle the left swipe action here
  }

  getColor(percentage: number): string {
    const green = Math.min(255, Math.round((100 - percentage) * 2.55));
    const red = Math.min(255, Math.round(percentage * 2.55));
    return `rgb(${red}, ${green}, 0)`; // RGB color with variable red and green
  }

  changeMode(mode: Mode): void {
    this.mode = mode;
    this.categoryTotals = [];
    this.totalAmount = 0;
    this.calculateCategoryTotals(mode);
    this.title = mode === Mode.TODAY ? 'за сегодня' : mode === Mode.WEEK ? 'на этой неделе' : 'в этом месяце';
  }

  protected readonly Mode = Mode;
}
