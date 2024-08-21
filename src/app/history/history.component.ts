import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Expense } from '../common/expense.model';

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
    if (confirm('Press a button!\nEither OK or Cancel.') == true) {
      this.expenses.splice(index, 1);
      localStorage.setItem('expenses', JSON.stringify(this.expenses));
      this.sumValues();
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
