import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { getCategoryNameById } from '../../../categories';
import { DateFrame } from '../date/dateFrame.model';
import { DateFilterComponent } from '../date/date-filter.component';
import { CategoryFilterComponent } from '../category/category-filter.component';

export type MultiFilter = {
  categories: string[];
  date: DateFrame;
};

@Component({
  selector: 'app-multi-filter',
  templateUrl: './multi-filter.component.html',
  styleUrls: ['./multi-filter.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DateFilterComponent,
    CategoryFilterComponent,
  ],
})
export class MultiFilterComponent implements OnChanges {

  @Input() value: MultiFilter;
  @Input() totalAmount: number;

  @Output() selectedFilters: EventEmitter<MultiFilter> = new EventEmitter();

  dateFilter?: DateFrame;
  selectedCategories: string[] = [];
  predefineCategories: string[] = [];
  expandFilters: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && this.value) {
      this.dateFilter = this.value.date;
      this.selectedCategories = this.value.categories;
      this.predefineCategories = this.value.categories
    }
  }

  getCategoryFilters(): string {
    return this.selectedCategories.map(getCategoryNameById).join(', ');
  }

  clearFilters(): void {
    this.dateFilter = undefined;
    this.predefineCategories = [];
    this.selectedCategories = [];
    this.selectedFilters.emit({ categories: [], date: undefined });
  }

  emitDateFilter(dateFilter: DateFrame): void {
    this.dateFilter = dateFilter;
    this.selectedFilters.emit({
      categories: this.selectedCategories,
      date: dateFilter,
    });
  }

  emitCategoryFilters(selectedCategories: string[]): void {
    this.selectedCategories = selectedCategories;
    this.selectedFilters.emit({
      categories: selectedCategories,
      date: this.dateFilter,
    });
  }

  toggleExpandFilters(): void {
    this.expandFilters = !this.expandFilters;
    this.predefineCategories = [...this.selectedCategories];
  }
}
