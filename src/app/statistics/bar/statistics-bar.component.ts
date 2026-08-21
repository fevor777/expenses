import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { CategoryService } from '../../common/service/category.service';

@Component({
  selector: 'app-statistics-bar',
  templateUrl: './statistics-bar.component.html',
  styleUrls: ['./statistics-bar.component.scss'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsBarComponent implements OnInit, OnChanges, OnDestroy {
  @Input() category: string;
  @Input() amount: number;
  @Input() percentage: number;
  @Input() color: string = '#66b166';

  @Output() close: EventEmitter<string> = new EventEmitter<string>();
  @Output() categoryLabelClick: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() detailsIconClick: EventEmitter<string> = new EventEmitter<string>();
  @Output() chartIconClick: EventEmitter<string> = new EventEmitter<string>();

  // Cache category name to avoid repeated function calls
  categoryName: string = '';
  formattedPercentage: string = '';

  isVisible: boolean = true;
  private categoryNames = new Map<string, string>();
  private readonly destroy$ = new Subject<void>();

  constructor(
    private categoryService: CategoryService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.categoryService.allCategories$
      .pipe(takeUntil(this.destroy$))
      .subscribe(categories => {
        this.categoryNames = new Map(
          categories.map(category => [category.id, category.name])
        );
        this.updateCachedValues();
        this.changeDetector.markForCheck();
      });
    this.updateCachedValues();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Only update cached values if relevant inputs changed
    if (changes['category'] || changes['percentage']) {
      this.updateCachedValues();
    }
  }

  private updateCachedValues(): void {
    // Cache computed values that don't change during component lifecycle
    this.categoryName =
      this.categoryNames.get(this.category) ||
      `Unknown category (${this.category})`;
    this.formattedPercentage = this.percentage.toFixed(2) + '%';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCategoryLabelClick(categoryId: string): void {
    this.categoryLabelClick.emit(categoryId);
  }

  onDetailsIconClick(categoryId: string): void {
    this.detailsIconClick.emit(categoryId);
  }

  onChartIconClick(categoryId: string): void {
    this.chartIconClick.emit(categoryId);
  }

  onHide(): void {
    this.isVisible = false;
    this.close.emit(this.category);
  }
}
