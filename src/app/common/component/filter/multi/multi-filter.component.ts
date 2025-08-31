import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { getCategoryNameById } from '../../../model/categories';
import { DateFrame, Mode } from '../date/dateFrame.model';
import { DateTime } from 'luxon';
import { DateFilterComponent } from '../date/date-filter.component';
import { CategoryFilterComponent } from '../category/category-filter.component';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { DateFilterService } from '../date/date-filter.service';

export type MultiFilter = {
  categories: string[];
  date: DateFrame;
  description?: string; // substring filter for expense description
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
export class MultiFilterComponent implements OnChanges, OnInit, OnDestroy {
  @Input() value: MultiFilter;
  @Input() totalAmount: number;
  @Input() defaultDateValue: DateFrame;
  @Input() showHistoryIcon: boolean = false; // show chart icon on history page
  @Input() showDetailsIcon: boolean = false; // show list/chart icon on details/statistics page

  @Output() selectedFilters: EventEmitter<MultiFilter> = new EventEmitter();

  dateFilter?: DateFrame;
  selectedCategories: string[] = [];
  predefineCategories: string[] = [];
  expandFilters: boolean = false;
  descriptionFilter: string = '';

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private dateFilterService: DateFilterService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && this.value) {
      this.dateFilter = this.value.date;
      this.selectedCategories = this.value.categories;
      this.predefineCategories = this.value.categories;
      this.descriptionFilter = this.value.description || '';
    }
  }

  getCategoryFilters(): string {
    return this.selectedCategories.map(getCategoryNameById).join(', ');
  }

  clearFilters(): void {
    this.dateFilter = this.defaultDateValue;
    this.predefineCategories = [];
    this.selectedCategories = [];
    this.descriptionFilter = '';
    this.selectedFilters.emit({ categories: [], date: this.defaultDateValue, description: '' });
  }

  emitDateFilter(dateFilter: DateFrame): void {
    this.dateFilter = dateFilter;
    this.selectedFilters.emit({
      categories: this.selectedCategories,
      date: dateFilter,
      description: this.descriptionFilter?.trim(),
    });
  }

  emitCategoryFilters(selectedCategories: string[]): void {
    this.selectedCategories = selectedCategories;
    this.selectedFilters.emit({
      categories: selectedCategories,
      date: this.dateFilter,
      description: this.descriptionFilter?.trim(),
    });
  }

  emitDescriptionFilter(): void {
    this.selectedFilters.emit({
      categories: this.selectedCategories,
      date: this.dateFilter,
      description: this.descriptionFilter?.trim(),
    });
  }

  toggleExpandFilters(): void {
    this.expandFilters = !this.expandFilters;
    this.predefineCategories = [...this.selectedCategories];
  }

  get isToday(): boolean {
    if (!this.dateFilter?.start || !this.dateFilter?.finish) return false;
    const today = DateTime.local();
    return (this.dateFilter.mode === Mode.DAY || !this.dateFilter.mode) &&
      this.dateFilter.start.hasSame(today, 'day') &&
      this.dateFilter.finish.hasSame(today, 'day');
  }


  navigateToDetails(): void {
    // Match history navigation pattern: store filter state in DateFilterService
    if (this.dateFilter) {
      this.dateFilterService.dateFilter = this.dateFilter;
    }
    if (this.selectedCategories?.length) {
      this.dateFilterService.categories = [...this.selectedCategories];
    }
    if (this.descriptionFilter?.trim()) {
      this.dateFilterService.description = this.descriptionFilter.trim();
    }
    this.router.navigate(['/details'], { queryParams: { 'back-url': '/history' } });
  }

  navigateToHistory(): void {
    // Store filters so history page picks them up
    if (this.dateFilter) {
      this.dateFilterService.dateFilter = this.dateFilter;
    }
    if (this.selectedCategories?.length) {
      this.dateFilterService.categories = [...this.selectedCategories];
    }
    if (this.descriptionFilter?.trim()) {
      this.dateFilterService.description = this.descriptionFilter.trim();
    }
    this.router.navigate(['/history']);
  }

  navigateToStatistics(): void {
    this.router.navigate(['/statistics']);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
