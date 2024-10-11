import { Component, EventEmitter, Input, Output } from '@angular/core';

import { getCategoryNameById } from '../../common/categories';

@Component({
  selector: 'app-statistics-bar',
  templateUrl: './statistics-bar.component.html',
  styleUrls: ['./statistics-bar.component.scss'],
})
export class StatisticsBarComponent {
  @Input() category: string;
  @Input() amount: number;
  @Input() percentage: number;
  @Input() color: string = '#28C600';

  @Output() close: EventEmitter<string> = new EventEmitter<string>();
  @Output() categoryLabelClick: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() detailsIconClick: EventEmitter<string> = new EventEmitter<string>();

  readonly getCategoryNameByIdFunc = getCategoryNameById;

  isVisible: boolean = true;

  onCategoryLabelClick(categoryId: string): void {
    this.categoryLabelClick.emit(categoryId);
  }

  onDetailsIconClick(categoryId: string): void {
    this.detailsIconClick.emit(categoryId);
  }

  onHide(): void {
    this.isVisible = false;
    this.close.emit(this.category);
  }
}
