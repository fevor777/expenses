import { CommonModule, getCurrencySymbol } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DescriptionEditModalComponent } from './description-edit-modal.component';
import { Currency } from '../../common/model/currency';
import { Expense } from '../../common/model/expense.model';
import { ExpenseEditModalComponent } from '../../history/edit/expense-edit-modal.component';
import { ExpenseNumberBoardHeaderComponent } from './header/expense-number-board-header.component';

@Component({
  selector: 'app-expense-number-board',
  templateUrl: './expense-number-board.component.html',
  styleUrls: ['./expense-number-board.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DescriptionEditModalComponent,
    ExpenseEditModalComponent,
    ExpenseNumberBoardHeaderComponent,
  ],
})
export class ExpenseNumberBoardComponent {
  @Input() currency: Currency;
  @Input() amount: string;
  @Input() description: string;
  // Provide latest expense from parent (optional). If not supplied we may fetch first from store later.
  @Input() latestExpense: Expense | null = null;

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
  // Long press removed
  @Output() openCalculator: EventEmitter<void> = new EventEmitter<void>();
  @Output() latestExpenseUpdated: EventEmitter<Expense> =
    new EventEmitter<Expense>();
  @Output() latestExpenseDeleted: EventEmitter<Expense> =
    new EventEmitter<Expense>();

  // Long press logic removed

  openCalculatorEmit(): void {
    this.openCalculator.emit();
  }

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
    this.showDescriptionModal = true;
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

  // Touch listeners for long press removed
  showDescriptionModal = false;
  showEditLatestModal = false;
  editingLatestExpense: Expense | null = null;

  clearAmount(event?: Event) {
    // Prevent triggering parent click (like open calculator or swipe)
    event?.stopPropagation();
    if (this.amount) {
      this.amountChange.emit('');
      this.descriptionChange.emit('');
    }
  }

  onDescriptionApply(description: string) {
    this.showDescriptionModal = false;
    this.descriptionChange.emit(description);
  }

  onDescriptionCancel() {
    this.showDescriptionModal = false;
  }

  constructor() {}

  openEditLatest(event?: Event): void {
    event?.stopPropagation();
    if (!this.latestExpense) {
      return;
    }
    this.editingLatestExpense = { ...this.latestExpense };
    this.showEditLatestModal = true;
  }

  onApplyEditLatest(expense: Expense): void {
    // Delegate persistence to parent to maintain single source of update (balance recalculation, caches etc.)
    this.latestExpenseUpdated.emit(expense);
    this.closeEditLatest();
  }

  onCancelEditLatest(): void {
    this.closeEditLatest();
  }

  onDeleteLatest(expense: Expense): void {
    // propagate deletion upward; parent responsible for persistence
    this.latestExpenseDeleted.emit(expense);
    this.closeEditLatest();
  }

  private closeEditLatest() {
    this.showEditLatestModal = false;
    this.editingLatestExpense = null;
  }
}
