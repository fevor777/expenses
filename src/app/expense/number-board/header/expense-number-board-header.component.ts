import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-expense-number-board-header',
  standalone: true,
  templateUrl: './expense-number-board-header.component.html',
  styleUrls: ['./expense-number-board-header.component.scss'],
  imports: [CommonModule],
})
export class ExpenseNumberBoardHeaderComponent implements OnChanges {
  @Input() amount: string;
  @Input() currencyCode: string;
  @Output() addDescription = new EventEmitter<void>();
  @Output() clearAmount = new EventEmitter<Event>();
  @Output() openCalculator = new EventEmitter<void>();
  @Output() openEditLatest = new EventEmitter<Event>();
  @Output() currencyClick = new EventEmitter<void>();
  @Output() deleteClick = new EventEmitter<void>();
  @Output() budgetInfoIconClick = new EventEmitter<void>();
  @Output() periodSummaryIconClick = new EventEmitter<void>();
  @Output() brNotificationIconClick = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['amount'] && this.amount) {
      this.isLeftIconListVisible = false;
    }
  }
  isLeftIconListVisible = false;

  onAddDescription(): void {
    this.addDescription.emit();
  }
  changeVisibilityOfLeftIconList(): void {
    if (this.isLeftIconListVisible) {
      this.isLeftIconListVisible = false; // immediate hide without animation
    } else {
      this.isLeftIconListVisible = true;
      this.animateIconsIn = true;
      setTimeout(() => (this.animateIconsIn = false), 400);
    }
  }
  onClearAmount(ev: Event): void {
    this.clearAmount.emit(ev);
  }
  onOpenCalculator(): void {
    this.openCalculator.emit();
  }
  onOpenEditLatest(ev: Event): void {
    this.openEditLatest.emit(ev);
  }
  onCurrencyClick(): void {
    this.currencyClick.emit();
  }
  onDeleteClick(): void {
    this.deleteClick.emit();
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

  // animation flags removed
  animateIconsIn = false;
}
