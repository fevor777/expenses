import { CommonModule, getCurrencySymbol } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
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
  @Input() amount: string;
  @Input() description: string;

  @Output() amountChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() currencyChange: EventEmitter<Currency> =
    new EventEmitter<Currency>();
  @Output() descriptionChange: EventEmitter<string> =
    new EventEmitter<string>();

  @Output() numberBoardSwipeLeft: EventEmitter<void> = new EventEmitter<void>();
  @Output() numberBoardSwipeRight: EventEmitter<void> =
    new EventEmitter<void>();
  @Output() numberBoardSwipeDown: EventEmitter<void> = new EventEmitter<void>();
  @Output() numberBoardSwipeUp: EventEmitter<void> = new EventEmitter<void>();
  @Output() numberBoardLongPress: EventEmitter<void> = new EventEmitter<void>();

  private longPressTimeout: any;
  private longPressTriggered = false;
  private readonly LONG_PRESS_DURATION = 500;
  private readonly LONG_PRESS_MOVE_TOLERANCE = 10;
  private lpStartX = 0;
  private lpStartY = 0;

  onDeleteClick(): void {
    if (this.amount.length > 0) {
      const newAmount = this.amount.slice(0, -1);
      this.amountChange.emit(newAmount);
    }
  }

  onAmountChange(value: string): void {
    this.amountChange.emit(value);
  }

  addDescription(): void {
    const description = prompt('Enter description', this.description);
    this.descriptionChange.emit(description);
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
      const currency = {
        code: newCurrency,
        exchangeRate: Number(newExchangeRate),
      };
      this.currencyChange.emit(currency);
    }
  }

  getCurrencySymbol(): string {
    return getCurrencySymbol(this.currency.code, 'narrow');
  }

  onNumberClick(numberValue: string) {
    let newAmount = this.amount;
    if (numberValue === '.') {
      if (this.amount.length === 0) {
        newAmount = '0.';
      } else if (!this.amount.includes('.')) {
        newAmount += numberValue;
      }
    } else {
      newAmount = this.amount + numberValue;
    }
    this.amountChange.emit(newAmount);
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

  @HostListener('touchstart', ['$event'])
  onNbTouchStart(e: TouchEvent) {
    if (!e.changedTouches.length) return;
    const t = e.changedTouches[0];
    this.lpStartX = t.screenX;
    this.lpStartY = t.screenY;
    this.longPressTriggered = false;
    clearTimeout(this.longPressTimeout);
    this.longPressTimeout = setTimeout(() => {
      this.longPressTriggered = true;
      this.numberBoardLongPress.emit();
    }, this.LONG_PRESS_DURATION);
  }

  @HostListener('touchmove', ['$event'])
  onNbTouchMove(e: TouchEvent) {
    if (this.longPressTriggered) return;
    if (!e.changedTouches.length) return;
    const t = e.changedTouches[0];
    if (
      Math.abs(t.screenX - this.lpStartX) > this.LONG_PRESS_MOVE_TOLERANCE ||
      Math.abs(t.screenY - this.lpStartY) > this.LONG_PRESS_MOVE_TOLERANCE
    ) {
      clearTimeout(this.longPressTimeout);
    }
  }

  @HostListener('touchend')
  onNbTouchEnd() {
    clearTimeout(this.longPressTimeout);
  }
}
