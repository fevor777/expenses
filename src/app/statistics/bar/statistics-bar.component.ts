import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { getCategoryNameById } from '../../common/model/categories';

@Component({
  selector: 'app-statistics-bar',
  templateUrl: './statistics-bar.component.html',
  styleUrls: ['./statistics-bar.component.scss'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsBarComponent implements OnInit, OnChanges {
  @Input() category: string;
  @Input() amount: number;
  @Input() percentage: number;
  @Input() color: string = '#28C600';

  @Output() close: EventEmitter<string> = new EventEmitter<string>();
  @Output() categoryLabelClick: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() detailsIconClick: EventEmitter<string> = new EventEmitter<string>();
  @Output() chartIconClick: EventEmitter<string> = new EventEmitter<string>();

  // Cache category name to avoid repeated function calls
  categoryName: string = '';
  formattedPercentage: string = '';

  isVisible: boolean = true;

  ngOnInit(): void {
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
    this.categoryName = getCategoryNameById(this.category);
    this.formattedPercentage = this.percentage.toFixed(2) + '%';
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
