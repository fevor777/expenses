import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Currency } from '../../../common/model/currency';
import { Expense } from '../../../common/model/expense.model';

@Component({
  selector: 'app-expense-number-board-header',
  standalone: true,
  templateUrl: './expense-number-board-header.component.html',
  styleUrls: ['./expense-number-board-header.component.scss'],
  imports: [CommonModule],
})
export class ExpenseNumberBoardHeaderComponent {
  @Input() amount: string;
  @Input() currencyCode: string;
  @Output() addDescription = new EventEmitter<void>();
  @Output() clearAmount = new EventEmitter<Event>();
  @Output() openCalculator = new EventEmitter<void>();
  @Output() openEditLatest = new EventEmitter<Event>();
  @Output() currencyClick = new EventEmitter<void>();
  @Output() deleteClick = new EventEmitter<void>();

  onAddDescription(): void {
    this.addDescription.emit();
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
}
