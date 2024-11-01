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

  @Output() editAmountIconClick: EventEmitter<HistoryExpense> =
    new EventEmitter();
  @Output() filterByCategory: EventEmitter<string> = new EventEmitter();
  @Output() chartIconClick: EventEmitter<string> = new EventEmitter();
  @Output() editDescriptionIconClick: EventEmitter<HistoryExpense> =
    new EventEmitter();
  @Output() deleteLabelClick: EventEmitter<HistoryExpense> = new EventEmitter();
  @Output() deleteFromBalanceLabelClick: EventEmitter<HistoryExpense> =
    new EventEmitter();

  readonly getCategoryNameByIdFunc = getCategoryNameById;
  readonly getCategoryByIdFunc = getCategoryById;

  onEditAmountIconClick(expense: HistoryExpense): void {
    this.editAmountIconClick.emit(expense);
  }

  onFilterByCategory(categoryId: string): void {
    this.filterByCategory.emit(categoryId);
  }

  onChartIconClick(categoryId: string): void {
    this.chartIconClick.emit(categoryId);
  }

  onEditDescriptionIconClick(expense: HistoryExpense): void {
    this.editDescriptionIconClick.emit(expense);
  }

  onDeleteLabelClick(expense: HistoryExpense): void {
    this.deleteLabelClick.emit(expense);
  }

  onDeleteFromBalanceLabelClick(expense: HistoryExpense): void {
    this.deleteFromBalanceLabelClick.emit(expense);
  }
}
