import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

import { Expense } from '../common/expense.model';
import {
  Categories,
  Category,
  getCategoryById,
  getCategoryNameById,
} from '../common/categories';
import { getCurrencySymbol } from '@angular/common';
import { Currency } from '../common/currency';
import { ExpressionEvaluator } from '../common/expression-evaluator';
import { NotificationService } from '../common/component/notification/notification.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
})
export class ExpenseComponent implements OnInit, AfterViewChecked {
  enteredAmount = '';
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

  currency: Currency;

  getCurrencySymbol(): string {
    return getCurrencySymbol(this.currency.code, 'narrow');
  }

  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngAfterViewChecked(): void {
    this.categoriesVisible = true;
  }

  ngOnInit(): void {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    this.sumValues(expenses);
    this.balance = Number(localStorage.getItem('balance')) || 0;
    this.balanceDate = localStorage.getItem('balanceDate');
    const currencyInLocalStorage = localStorage.getItem('currency');
    if (currencyInLocalStorage) {
      this.currency = JSON.parse(currencyInLocalStorage);
    } else {
      this.currency = {
        code: 'EUR',
      };
      localStorage.setItem('currency', JSON.stringify(this.currency));
    }
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
  }

  onDeleteClick() {
    if (this.enteredAmount.length > 0) {
      this.enteredAmount = this.enteredAmount.slice(0, -1);
    }
  }

  onCategoryClick(categoryName: string) {
    const exchangeRate = this.currency?.exchangeRate || 1;
    const calculatedAmount = ExpressionEvaluator.evaluate(this.enteredAmount);
    const amount = Math.round((calculatedAmount / exchangeRate) * 100) / 100;
    if (amount > 0) {
      const jsonInLocalStorage = localStorage.getItem('expenses');
      let expenseList = jsonInLocalStorage
        ? JSON.parse(jsonInLocalStorage)
        : [];
      expenseList.unshift({
        id: uuidv4(),
        category: categoryName,
        amount: amount,
        currency: this.currency?.code,
        date: Date.now(),
      });
      if (getCategoryById(categoryName)?.includeInBalance) {
        const balance = Number(localStorage.getItem('balance') || 0);
        const newBalance = Math.round((balance - amount) * 100) / 100;
        localStorage.setItem('balance', newBalance.toString());
        this.balance = newBalance;
      }
      localStorage.setItem('expenses', JSON.stringify(expenseList));
      this.sumValues(expenseList);
      this.enteredAmount = '';
      this.showKeyBoard = true;
    }
    this.notificationService.showMessage(
      `Добавлено: ${getCategoryNameById(
        categoryName
      )}, ${amount} ${this.getCurrencySymbol()}(${this.currentAmount})`
    );
  }

  ngAfterViewInit(): void {}

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

  onShowKeyBoard(): void {
    this.showKeyBoard = true;
  }
  onSwipeDown(): void {
    this.showKeyBoard = false;
  }

  onCurrencyClick(): void {
    const newCurrency = prompt('Enter new currency', this.currency.code);
    if (newCurrency) {
      let newExchangeRate = '1';
      if (newCurrency !== 'EUR') {
        newExchangeRate = prompt(
          'Enter exchange rate',
          this.currency?.exchangeRate?.toString() || '1'
        );
      }
      this.currency = {
        code: newCurrency,
        exchangeRate: Number(newExchangeRate),
      };
      localStorage.setItem('currency', JSON.stringify(this.currency));
    }
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
