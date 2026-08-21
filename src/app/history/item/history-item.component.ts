import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ResolvedCategory } from '../../common/model/category.model';
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
  @Input() tagNamesById: Record<string, string> = {};
  @Input() categoriesById: Record<string, ResolvedCategory> = {};

  @Output() editIconClick: EventEmitter<HistoryExpense> = new EventEmitter();
  @Output() filterByCategory: EventEmitter<string> = new EventEmitter();
  @Output() deleteLabelClick: EventEmitter<HistoryExpense> = new EventEmitter();
  @Output() excludeFromBudgetClick: EventEmitter<HistoryExpense> =
    new EventEmitter();

  getCategoryName(id: string): string {
    return this.categoriesById[id]?.name || `Unknown category (${id})`;
  }

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

  getTagNames(tagIds?: string[]): string[] {
    if (!Array.isArray(tagIds) || tagIds.length === 0) {
      return [];
    }

    return tagIds
      .map(tagId => this.tagNamesById[tagId] || tagId)
      .filter(Boolean);
  }
}
