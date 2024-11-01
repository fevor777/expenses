import { CommonModule, getCurrencySymbol } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Currency } from '../../common/model/currency';

@Component({
  selector: 'app-expense-number-board',
  templateUrl: './expense-number-board.component.html',
  styleUrls: ['./expense-number-board.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ExpenseNumberBoardComponent {
  @Input() currency: Currency;

  @Output() amountChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() currencyChange: EventEmitter<Currency> =
    new EventEmitter<Currency>();
  @Output() descriptionChange: EventEmitter<string> =
    new EventEmitter<string>();

  @Output() numberBoardSwipeLeft: EventEmitter<void> = new EventEmitter<void>();
  @Output() numberBoardSwipeRight: EventEmitter<void> = new EventEmitter<void>();
  @Output() numberBoardSwipeDown: EventEmitter<void> = new EventEmitter<void>();
  @Output() numberBoardSwipeUp: EventEmitter<void> = new EventEmitter<void>();

  enteredAmount: string = '';
  description: string = '';

  onDeleteClick(): void {
    if (this.enteredAmount.length > 0) {
      this.enteredAmount = this.enteredAmount.slice(0, -1);
      this.amountChange.emit(this.enteredAmount);
    }
  }

  addDescription(): void {
    this.description = prompt('Enter description', this.description);
    this.descriptionChange.emit(this.description);
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
      this.currencyChange.emit(this.currency);
    }
  }

  getCurrencySymbol(): string {
    return getCurrencySymbol(this.currency.code, 'narrow');
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
    this.amountChange.emit(this.enteredAmount);
  }

  onSwipeLeft(): void {
    this.numberBoardSwipeLeft.emit();
  }

  onSwipeRight(): void {
    this.numberBoardSwipeRight.emit();
  }

  onSwipeDown(event: Event): void {
    event.stopPropagation();
    this.numberBoardSwipeDown.emit();
  }

  onSwipeUp(): void {
    this.numberBoardSwipeUp.emit();
  }
}
