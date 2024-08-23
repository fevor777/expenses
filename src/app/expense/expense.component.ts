import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

import { Expense } from '../common/expense.model';
import { Categories, Category } from '../common/categories';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
})
export class ExpenseComponent implements OnInit, AfterViewChecked {
  enteredAmount = '';
  enteredAmountAsNumber: number = 0;
  currentAmount: number = 0;
  monthAmount: number = 0;
  balance: number = 0;
  balanceDate: string = '';
  showKeyBoard: boolean = true;
  currentDate: string = new Date().toLocaleDateString('ru-RU', {
    weekday: 'short', // 'Thu'
    month: 'short', // 'Aug'
    day: 'numeric', // '12'
  });
  categories: Category[] = Categories;

  constructor(private router: Router) {}
  ngAfterViewChecked(): void {
    this.categoriesVisible = true;
  }

  ngOnInit(): void {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    console.log('expenses', expenses);
    this.sumValues(expenses);
    console.log('currentAmount', this.currentAmount);
    this.balance = Number(localStorage.getItem('balance')) || 0;
    this.balanceDate = localStorage.getItem('balanceDate');
  }

  categoriesVisible = false;

  onNumberClick(numberValue: string) {
    if (numberValue === '.') {
      if (this.enteredAmount.length === 0) {
        this.enteredAmount = '0.';
      } else if (!this.enteredAmount.includes('.')) {
        this.enteredAmount += numberValue;
      }
    } else {
      this.enteredAmount += numberValue;
    }
    this.enteredAmountAsNumber = Number(this.enteredAmount);

    console.log(this.enteredAmount);
    console.log(Number(this.enteredAmount));
  }

  onDeleteClick() {
    if (this.enteredAmount.length > 0) {
      this.enteredAmount = this.enteredAmount.slice(0, -1);
    }
    this.enteredAmountAsNumber = Number(this.enteredAmount);
    console.log(this.enteredAmount);
  }

  onCategoryClick(categoryName: string) {
    if (this.enteredAmountAsNumber > 0) {
      const jsonInLocalStorage = localStorage.getItem('expenses');
      let expenseList = jsonInLocalStorage
        ? JSON.parse(jsonInLocalStorage)
        : [];
      expenseList.unshift({
        id: uuidv4(),
        category: categoryName,
        amount: this.enteredAmountAsNumber,
        currency: 'EUR',
        date: Date.now(),
      });
      const balance = Number(localStorage.getItem('balance') || 0);
      const newBalance =
        Math.round((balance - this.enteredAmountAsNumber) * 100) / 100;
      localStorage.setItem('balance', newBalance.toString());
      this.balance = newBalance;
      localStorage.setItem('expenses', JSON.stringify(expenseList));
      this.sumValues(expenseList);
      this.enteredAmount = '';
      this.enteredAmountAsNumber = 0;
      this.showKeyBoard = true;
    }
  }

  ngAfterViewInit(): void {
  }

  onBalanceChange(): void {
    const newBalance = prompt('Enter new balance', this.balance.toString());
    if (newBalance) {
      localStorage.setItem('balance', newBalance);
      this.balance = Number(newBalance);
    }
  }

  onBalanceDateChange(): void {
    const newBalanceDate = prompt(
      'Enter new balance date',
      this.balanceDate || ''
    );
    if (newBalanceDate) {
      localStorage.setItem('balanceDate', newBalanceDate);
      this.balanceDate = newBalanceDate;
    }
  }

  onDisableRefresh(event: Event): void {
    event.stopPropagation();
  }

  onSwipeLeft(): void {
    this.router.navigate(['/history']);
  }

  onSwipeRight(): void {
    this.router.navigate(['/statistics']);
  }

  onShowKeyboard(): void {
    this.showKeyBoard = true;
  }
  onHideKeyboard(): void {
    this.showKeyBoard = false;
  }

  private sumValues(expenses: Expense[]): void {
    this.currentAmount = 0;
    this.monthAmount = 0;
    expenses.forEach((expense: Expense) => {
      if (new Date(expense.date).toDateString() === new Date().toDateString()) {
        const currentSum = this.currentAmount + expense.amount;
        this.currentAmount = Math.round(currentSum * 100) / 100;
      }
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const expenseMonth = new Date(expense.date).getMonth();
      const expenseYear = new Date(expense.date).getFullYear();
      if (currentMonth === expenseMonth && currentYear === expenseYear) {
        const monthSum = this.monthAmount + expense.amount;
        this.monthAmount = Math.round(monthSum * 100) / 100;
      }
    });
  }
}
