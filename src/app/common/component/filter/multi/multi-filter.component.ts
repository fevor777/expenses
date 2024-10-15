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

import { getCategoryNameById } from '../../../categories';
import { DateFrame } from '../date/dateFrame.model';
import { DateFilterComponent } from '../date/date-filter.component';
import { CategoryFilterComponent } from '../category/category-filter.component';
import { SavingService } from '../../../saving.service';
import { Subject, takeUntil } from 'rxjs';

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
export class MultiFilterComponent implements OnChanges, OnInit, OnDestroy {
  @Input() value: MultiFilter;
  @Input() totalAmount: number;
  @Input() defaultDateValue: DateFrame;

  @Output() selectedFilters: EventEmitter<MultiFilter> = new EventEmitter();

  dateFilter?: DateFrame;
  selectedCategories: string[] = [];
  predefineCategories: string[] = [];
  expandFilters: boolean = false;
  showSavings: boolean;
  savings: string = '0';

  private unsubscribe: Subject<void> = new Subject();

  constructor(private savingService: SavingService) {}

  ngOnInit(): void {
    this.savingService
      .getSavings()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((savings) => {
        this.savings = savings?.toString() || '0';
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && this.value) {
      this.dateFilter = this.value.date;
      this.selectedCategories = this.value.categories;
      this.predefineCategories = this.value.categories;
    }
  }

  getCategoryFilters(): string {
    return this.selectedCategories.map(getCategoryNameById).join(', ');
  }

  onShowSavings(): void {
    this.showSavings = !this.showSavings;
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

  changeSavings(): void {
    const newSavings = prompt('Enter new savings', this.savings);
    if (newSavings) {
      this.savingService
        .addSaving(Number(newSavings))
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(() => {
          this.savings = newSavings;
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
