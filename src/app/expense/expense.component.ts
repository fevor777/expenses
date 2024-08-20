import { Component } from '@angular/core';
import { faUtensils, faTshirt, faTools, faMusic, faDumbbell, faCar, faLightbulb, faBaby, faHome, faQuestion, faPlane, faCreditCard, faClock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent {
  faUtensils = faUtensils;
  faTshirt = faTshirt;
  faTools = faTools;
  faMusic = faMusic;
  faDumbbell = faDumbbell;
  faCar = faCar;
  faLightbulb = faLightbulb;
  faBaby = faBaby;
  faHome = faHome;
  faQuestion = faQuestion;
  faPlane = faPlane;
  faCreditCard = faCreditCard;
  faClock = faClock;

  categories = [
    { name: 'Еда и напитки', icon: this.faUtensils },
    { name: 'Одежда', icon: this.faTshirt },
    { name: 'Ремонт', icon: this.faTools },
    { name: 'Развлечения', icon: this.faMusic },
    { name: 'Спорт', icon: this.faDumbbell },
    { name: 'Авто', icon: this.faCar },
    { name: 'Коммуналка', icon: this.faLightbulb },
    { name: 'Дети', icon: this.faBaby },
    { name: 'Дом', icon: this.faHome },
    { name: 'Разное', icon: this.faQuestion },
    { name: 'Путешествия', icon: this.faPlane },
    { name: 'Кредит', icon: this.faCreditCard }
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
