import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Expense } from '../common/expense.model';
import { getCategoryNameById } from '../common/categories';

type HistoryExpense = Expense & { showDateTitle: boolean };

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  expenses: HistoryExpense[] = [];
  totalAmount: number = 0;
  temporaryDate: number = 0;

  readonly getCategoryNameByIdFunc = getCategoryNameById;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.expenses = (
      JSON.parse(localStorage.getItem('expenses') || '[]') as HistoryExpense[]
    ).map((expense) => ({
      ...expense,
      showDateTitle: this.isDatePanelVisible(expense.date),
    }));
    this.sumValues();
  }

  onDelete(index: number) {
    if (confirm('Delete?')) {
      this.updateBalance(index);
      this.expenses.splice(index, 1);
      localStorage.setItem('expenses', JSON.stringify(this.expenses));
      this.sumValues();
    }
  }

  updateBalance(index: number): void {
    const balance = Number(localStorage.getItem('balance')) || 0;
    if (balance) {
      const newBalance = Math.round((balance + this.expenses[index].amount) * 100) / 100;
      localStorage.setItem('balance', newBalance.toString());
    }
  }

  onDeleteFromBalance(index: number): void {
    if (confirm('Return to balance?')) {
      this.updateBalance(index);
    }
  }

  onSwipeRight(): void {
    this.router.navigate(['/']);
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
