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
import { NotificationService } from '../../common/component/notification/notification.service';

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
  // Long press on '0' key
  @Output() zeroLongPress: EventEmitter<void> = new EventEmitter<void>();
  // Long press on '.' key
  @Output() decimalLongPress: EventEmitter<void> = new EventEmitter<void>();
  @Output() budgetInfoIconClick = new EventEmitter<void>();
  @Output() periodSummaryIconClick = new EventEmitter<void>();
  @Output() brNotificationIconClick = new EventEmitter<void>();
  @Output() calendarIconClick = new EventEmitter<void>();
  
  constructor(private notificationService: NotificationService) {}

  openCalculatorEmit(): void {
    this.notificationService.hide();
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
    this.notificationService.hide();
    this.showDescriptionModal = true;
  }

  onCurrencyClick(): void {
    this.notificationService.hide();
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

  // Long press state
  private longPressThreshold = 500; // ms
  private zeroPressed = false;
  private decimalPressed = false;
  private zeroTimer: any;
  private decimalTimer: any;

  onZeroPointerDown(event: PointerEvent): void {
    // prevent text selection / duplication of events
    event.stopPropagation();
    this.zeroPressed = true;
    clearTimeout(this.zeroTimer);
    this.zeroTimer = setTimeout(() => {
      if (this.zeroPressed) {
        this.zeroLongPress.emit();
      }
    }, this.longPressThreshold);
  }

  onZeroPointerUp(event: PointerEvent): void {
    event.stopPropagation();
    this.zeroPressed = false;
    clearTimeout(this.zeroTimer);
  }

  onZeroPointerLeave(): void {
    this.zeroPressed = false;
    clearTimeout(this.zeroTimer);
  }

  onDecimalPointerDown(event: PointerEvent): void {
    event.stopPropagation();
    this.decimalPressed = true;
    clearTimeout(this.decimalTimer);
    this.decimalTimer = setTimeout(() => {
      if (this.decimalPressed) {
        this.decimalLongPress.emit();
      }
    }, this.longPressThreshold);
  }

  onDecimalPointerUp(event: PointerEvent): void {
    event.stopPropagation();
    this.decimalPressed = false;
    clearTimeout(this.decimalTimer);
  }

  onDecimalPointerLeave(): void {
    this.decimalPressed = false;
    clearTimeout(this.decimalTimer);
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

  openEditLatest(event?: Event): void {
    event?.stopPropagation();
    this.notificationService.hide();
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

  onBudgetInfoIconClick(): void {
    this.budgetInfoIconClick.emit();
  }

  onPeriodSummaryIconClick(): void {
    this.periodSummaryIconClick.emit();
  }

  onBrNotificationIconClick(): void {
    this.brNotificationIconClick.emit();
  }

  onCalendarIconClick(): void {
    this.calendarIconClick.emit();
  }

  private closeEditLatest() {
    this.showEditLatestModal = false;
  }
}
