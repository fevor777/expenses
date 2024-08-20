import { Component } from '@angular/core';
import { faUtensils, faTshirt, faTools, faMusic, faDumbbell, faCar, faLightbulb, faBaby, faHome, faQuestion, faPlane, faCreditCard, faClock, faPlus, faBackspace } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent {
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
    { name: 'Кредит', icon: faCreditCard }
  ];

  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  enteredAmount = '';

  addDigit(digit: number) {
    this.enteredAmount += digit;
  }

  deleteDigit() {
    this.enteredAmount = this.enteredAmount.slice(0, -1);
  }
}
