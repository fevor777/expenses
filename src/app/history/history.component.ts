import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
})
export class HistoryComponent implements OnInit {
  expenses: { category: string; currency: string; amount: number }[] = [];
  totalAmount: number = 0;

  ngOnInit(): void {
    this.expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    this.totalAmount = this.expenses.reduce(
      (total: number, expense: { amount: number }) => total + expense.amount,
      0
    );
  }

  onDelete(index: number) {
    if (confirm('Press a button!\nEither OK or Cancel.') == true) {
      this.expenses.splice(index, 1);
      localStorage.setItem('expenses', JSON.stringify(this.expenses));
      this.totalAmount = this.expenses.reduce(
        (total: number, expense: { amount: number }) => total + expense.amount,
        0
      );
    }
  }
}
