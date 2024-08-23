import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { Categories, Category } from '../../categories';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements AfterViewInit {
  @Input() isContentDown: boolean;

  @Output() categoryClick: EventEmitter<string> = new EventEmitter<string>();
  @Output() categorySwipeDown: EventEmitter<void> = new EventEmitter<void>();
  @Output() categorySwipeUp: EventEmitter<void> = new EventEmitter<void>();
  @Output() categorySwipeLeft: EventEmitter<void> = new EventEmitter<void>();
  @Output() categorySwipeRight: EventEmitter<void> = new EventEmitter<void>();

  categories: Category[] = [...Categories];

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

  private categoryWidth = 90; // 200px width + 20px margin
  private categoryHeight = 84; // 100px height + 20px margin
  private containerWidth = 0;
  private containerHeight = 0;

  ngOnInit(): void {
    this.updateVisibleCategories();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateVisibleCategories();
  }

  ngAfterViewInit(): void {
    this.updateVisibleCategories();
  }

  updateVisibleCategories(): void {
    this.categories = [];
    const containerElement = document.querySelector('.categories');
    if (containerElement) {
      this.containerWidth = containerElement.clientWidth;
      this.containerHeight = containerElement.clientHeight;

      const maxColumns = Math.floor(this.containerWidth / this.categoryWidth);
      const maxRows = Math.floor(this.containerHeight / this.categoryHeight);
      const maxVisibleCategories = maxColumns * maxRows;

      this.categories = Categories.slice(0, maxVisibleCategories);
    }
  }
}
