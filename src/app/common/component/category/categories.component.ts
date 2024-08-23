import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Categories, Category } from '../../categories';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent {
  @Input() isContentDown: boolean;

  @Output() categoryClick: EventEmitter<string> = new EventEmitter<string>();
  @Output() categorySwipeDown: EventEmitter<void> = new EventEmitter<void>();
  @Output() categorySwipeUp: EventEmitter<void> = new EventEmitter<void>();
  @Output() categorySwipeLeft: EventEmitter<void> = new EventEmitter<void>();
  @Output() categorySwipeRight: EventEmitter<void> = new EventEmitter<void>();

  categories: Category[] = Categories;

  onCategoryClick(category: string) {
    this.categoryClick.emit(category);
  }

  onSwipeDown(): void {
    this.categorySwipeDown.emit();
  }
  onSwipeUp(): void {
    this.categorySwipeUp.emit();
  }
  onSwipeLeft(): void {
    this.categorySwipeLeft.emit();
  }
  onSwipeRight(): void {
    this.categorySwipeRight.emit();
  }
}
