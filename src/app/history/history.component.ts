import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { getCategoryById } from '../common/categories';
import { Expense } from '../common/expense.model';
import { Categories, getCategoryNameById } from '../common/categories';

type HistoryExpense = Expense & {
  showDateTitle: boolean;
  amountPerDay: number;
};

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  expenses: HistoryExpense[] = [];
  totalAmount: number = 0;
  temporaryDate: number = 0;
  totalAmountPerDays: Map<number, number> = new Map();
  getCategoryByIdFunc = getCategoryById;

  filterDate: string = '';
  categories = {
    regular: Categories.filter((category) => !category.includeInBalance),
    irregular: Categories.filter((category) => category.includeInBalance),
  };
  filterCategories: any = Categories.reduce((acc, category) => {
    acc[category.id] = false;
    return acc;
  }, {});

  expandFilters: boolean = false;

  readonly getCategoryNameByIdFunc = getCategoryNameById;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initiateExpenses();
    this.sumValues();

    this.filterCategories.irregular = false;
    this.filterCategories.regular = false;
  }

  initiateExpenses(): void {
    this.expenses = (
      JSON.parse(localStorage.getItem('expenses') || '[]') as HistoryExpense[]
    ).map((expense) => {
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
      };
    });
  }

  applyFilters(): void {
    this.initiateExpenses();
    this.checkMainCategory();
    if (
      this.filterDate === '' &&
      Object.values(this.filterCategories).every((value) => !value)
    ) {
      this.sumValues();
      return;
    }

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
    if (this.filterDate === '') {
      this.sumValues();
      return;
    }

    let sinceWhen = new Date();
    if (this.filterDate === 'thisWeek') {
      const dayOfWeek = sinceWhen.getDay();
      const daysUntilMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      sinceWhen.setDate(sinceWhen.getDate() - daysUntilMonday);
    }
    if (this.filterDate === 'thisMonth') {
      sinceWhen = new Date(sinceWhen.setDate(1));
    }
    this.expenses = this.expenses.filter((expense: { date: number }) => {
      const date = new Date(expense.date);
      return (
        date.getDate() >= sinceWhen.getDate() &&
        date.getMonth() === sinceWhen.getMonth() &&
        date.getFullYear() === sinceWhen.getFullYear()
      );
    });
    this.sumValues();
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
    this.filterDate = '';
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
      this.expenses.splice(index, 1);
      localStorage.setItem('expenses', JSON.stringify(this.expenses));
      this.sumValues();
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
      if (isDeleteFromBalance) {
        this.expenses[index].isDeletedFromBalance = isDeleteFromBalance;
        localStorage.setItem('expenses', JSON.stringify(this.expenses));
      }
      localStorage.setItem('balance', newBalance.toString());
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
