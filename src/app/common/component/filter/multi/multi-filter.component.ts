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
  NgZone,
  ElementRef,
  ViewChild,
  AfterViewInit
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
import { PeriodSummaryIconComponent } from "../../period-summary-icon/period-summary-icon.component";

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
    PeriodSummaryIconComponent
],
})
export class MultiFilterComponent implements OnChanges, OnInit, OnDestroy, AfterViewInit {
  @Input() value: MultiFilter;
  @Input() totalAmount: number;
  @Input() defaultDateValue: DateFrame;
  @Input() showHistoryIcon: boolean = false; // show chart icon on history page
  @Input() showDetailsIcon: boolean = false; // show list/chart icon on details/statistics page
  @Input() activeBucketCount?: number; // e.g. active time buckets with spending
  @Input() totalBucketCount?: number; // total buckets in current frame
  @Input() expenseEntryCount?: number; // total non-zero expense entries

  @Output() selectedFilters: EventEmitter<MultiFilter> = new EventEmitter();
  @Output() navigateToStatisticsIconClick: EventEmitter<void> =
    new EventEmitter();
  @Output() expandStateChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  // Enable compact summary activation on scroll (history page)
  @Input() enableCompactOnScroll: boolean = false;

  @ViewChild('rootEl') private rootElRef?: ElementRef<HTMLElement>;

  dateFilter?: DateFrame;
  selectedCategories: string[] = [];
  predefineCategories: string[] = [];
  expandFilters: boolean = false;
  descriptionFilter: string = '';
  showCompact: boolean = false; // toggled by scroll
  compactSummary: string = '';
  private scrollThreshold = 10; // px before compact view shows
  private onScrollHandler = () => this.evaluateScrollPosition();

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private dateFilterService: DateFilterService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.enableCompactOnScroll) {
      // Run outside Angular; enter only when toggling state
      this.ngZone.runOutsideAngular(() => {
        window.addEventListener('scroll', this.onScrollHandler, { passive: true });
      });
      // Initial build
      this.buildCompactSummary();
      this.evaluateScrollPosition();
    }
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

  private buildCompactSummary(): void {
    const datePart = this.dateFilter?.display || 'Весь период';
    const categories = this.selectedCategories;
    const catPart = categories?.length
      ? categories
          .slice(0, 2)
          .map(getCategoryNameById)
          .join(', ') + (categories.length > 2 ? '…' : '')
      : 'Все категории';
    const descPart = this.descriptionFilter?.trim()
      ? `; "${this.descriptionFilter.trim()}"`
      : '';
    this.compactSummary = `${datePart} • ${catPart}${descPart}`.trim();
  }

  private evaluateScrollPosition(): void {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    const shouldShow = this.enableCompactOnScroll && y > this.scrollThreshold && !this.expandFilters;
    if (shouldShow !== this.showCompact) {
      this.ngZone.run(() => (this.showCompact = shouldShow));
    }
  }

  clearFilters(event: MouseEvent): void {
    event.stopPropagation();
    this.dateFilter = this.defaultDateValue;
    this.predefineCategories = [];
    this.selectedCategories = [];
    this.descriptionFilter = '';
    this.selectedFilters.emit({
      categories: [],
      date: this.defaultDateValue,
      description: '',
    });
    this.buildCompactSummary();
    this.evaluateScrollPosition();
  }

  emitDateFilter(dateFilter: DateFrame): void {
    this.dateFilter = dateFilter;
    this.selectedFilters.emit({
      categories: this.selectedCategories,
      date: dateFilter,
      description: this.descriptionFilter?.trim(),
    });
    this.buildCompactSummary();
    this.evaluateScrollPosition();
  }

  emitCategoryFilters(selectedCategories: string[]): void {
    this.selectedCategories = selectedCategories;
    this.selectedFilters.emit({
      categories: selectedCategories,
      date: this.dateFilter,
      description: this.descriptionFilter?.trim(),
    });
    this.buildCompactSummary();
    this.evaluateScrollPosition();
  }

  emitDescriptionFilter(): void {
    this.selectedFilters.emit({
      categories: this.selectedCategories,
      date: this.dateFilter,
      description: this.descriptionFilter?.trim(),
    });
    this.buildCompactSummary();
    this.evaluateScrollPosition();
  }

  toggleExpandFilters(event: MouseEvent): void {
    event.stopPropagation();
    this.expandFilters = !this.expandFilters;
    this.predefineCategories = [...this.selectedCategories];
    this.expandStateChange.emit(this.expandFilters);
    // Hide compact when expanded
    if (this.expandFilters && this.showCompact) {
      this.showCompact = false;
    } else {
      this.evaluateScrollPosition();
    }
  }

  get isToday(): boolean {
    if (!this.dateFilter?.start || !this.dateFilter?.finish) return false;
    const today = DateTime.local();
    return (
      (this.dateFilter.mode === Mode.DAY || !this.dateFilter.mode) &&
      this.dateFilter.start.hasSame(today, 'day') &&
      this.dateFilter.finish.hasSame(today, 'day')
    );
  }

  navigateToPeriodSummary(event: MouseEvent): void {
    event.stopPropagation();
    this.router.navigate(['/period-summary']);
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

  navigateToStatistics(event: MouseEvent): void {
    event.stopPropagation();
    this.navigateToStatisticsIconClick.emit();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    window.removeEventListener('scroll', this.onScrollHandler);
  }
}
