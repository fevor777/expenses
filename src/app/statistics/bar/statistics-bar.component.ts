import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
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
  @Input() color: string;

  @Output() close: EventEmitter<string> = new EventEmitter<string>();

  readonly getCategoryNameByIdFunc = getCategoryNameById;

  isVisible: boolean = true;

  constructor(private router: Router) {}

  showCategoryDetails(categoryId: string): void {
    this.router.navigate(['/details'], {
      queryParams: {
        'category-id': categoryId,
        'back-url': '/statistics',
      },
    });
  }

  onHide(): void {
    this.isVisible = false;
    this.close.emit(this.category);
  }
}
