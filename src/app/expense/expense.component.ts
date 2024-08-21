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
  totalAmount: number = 0;
  showKeyBoard: boolean = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
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
      const expenseList = jsonInLocalStorage
        ? JSON.parse(jsonInLocalStorage)
        : [];
      expenseList.push({
        category: categoryName,
        amount: this.enteredAmountAsNumber,
        currency: 'EUR',
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

  private sumValues(expenses: { amount: number }[]): void {
    this.totalAmount = expenses.reduce(
      (total: number, expense: { amount: number }) => { 
        const result = total + expense.amount;
        return Math.round(result * 100) / 100; 
      },
      0
    );
  }
}
