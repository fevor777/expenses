import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faUtensils,
  faTshirt,
  faTools,
  faMusic,
  faDumbbell,
  faCar,
  faLightbulb,
  faBaby,
  faHome,
  faQuestion,
  faPlane,
  faCreditCard,
  faClock,
  faPlus,
  faBackspace,
} from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';

import { Expense } from '../common/expense.model';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
})
export class ExpenseComponent implements OnInit {
  faClock = faClock;
  faPlus = faPlus;
  faBackspace = faBackspace;

  categories = [
    { name: 'Еда и напитки', icon: faUtensils },
    { name: 'Одежда', icon: faTshirt },
    { name: 'Ремонт', icon: faTools },
    { name: 'Развлечения', icon: faMusic },
    { name: 'Спорт', icon: faDumbbell },
    { name: 'Авто', icon: faCar },
    { name: 'Коммуналка', icon: faLightbulb },
    { name: 'Дети', icon: faBaby },
    { name: 'Дом', icon: faHome },
    { name: 'Разное', icon: faQuestion },
    { name: 'Путешествия', icon: faPlane },
    { name: 'Кредит', icon: faCreditCard },
  ];

  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  enteredAmount = '';
  enteredAmountAsNumber: number = 0;
  currentAmount: number = 0;
  monthAmount: number = 0;
  showKeyBoard: boolean = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    console.log('expenses', expenses);
    this.sumValues(expenses);
  }

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
      expenseList = expenseList.map((expense: Expense) => ({
        id: expense?.id ? expense.id : uuidv4(),
        amount: expense.amount,
        category: expense.category,
        currency: expense.currency,
        date: expense.date ? expense.date : Date.now(),
      }));
      expenseList.push({
        id: uuidv4(),
        category: categoryName,
        amount: this.enteredAmountAsNumber,
        currency: 'EUR',
        date: Date.now(),
      });
      localStorage.setItem('expenses', JSON.stringify(expenseList));
      this.sumValues(expenseList);
      this.enteredAmount = '';
      this.enteredAmountAsNumber = 0;
      this.showKeyBoard = true;
    }
  }

  onSwipeLeft(): void {
    this.router.navigate(['/history']);
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
