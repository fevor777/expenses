import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  getCategoryById,
  getCategoryNameById,
} from '../../common/model/categories';
import { HistoryExpense } from '../history-expense';

@Component({
  selector: 'app-history-item',
  templateUrl: './history-item.component.html',
  styleUrls: ['./history-item.component.scss'],
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
})
export class HistoryItemComponent {
  @Input() item: HistoryExpense;
  @Input() totalAmountPerDays: number;

  @Output() editIconClick: EventEmitter<HistoryExpense> =
    new EventEmitter();
  @Output() filterByCategory: EventEmitter<string> = new EventEmitter();
  @Output() deleteLabelClick: EventEmitter<HistoryExpense> = new EventEmitter();
  @Output() excludeFromBudgetClick: EventEmitter<HistoryExpense> =
    new EventEmitter();

  readonly getCategoryNameByIdFunc = getCategoryNameById;
  readonly getCategoryByIdFunc = getCategoryById;

  onEditIconClick(expense: HistoryExpense): void {
    this.editIconClick.emit(expense);
  }

  onFilterByCategory(categoryId: string): void {
    this.filterByCategory.emit(categoryId);
  }

  onDeleteLabelClick(expense: HistoryExpense): void {
    this.deleteLabelClick.emit(expense);
  }

  onExcludeFromBudget(expense: HistoryExpense): void {
    this.excludeFromBudgetClick.emit(expense);
  }
}
