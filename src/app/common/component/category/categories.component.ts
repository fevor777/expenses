import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Categories, Category } from '../../categories';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements AfterViewInit, OnChanges {
  @Input() isContentDown: boolean;

  @Output() categoryClick: EventEmitter<string> = new EventEmitter<string>();

  categories: Category[] = [...Categories, ...Categories];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isContentDown']) {
      if (this.isContentDown) {
        this.categories = [...Categories, ...Categories];
      } else {
        this.updateVisibleCategories();
      }
    }
  }
  onCategoryClick(category: string) {
    this.categoryClick.emit(category);
  }

  private categoryWidth = 100; // 70px width + 15px margin
  private categoryHeight = 94; // 64px height + 15px margin
  private containerWidth = 0;
  private containerHeight = 0;

  ngOnInit(): void {
    // this.updateVisibleCategories();
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

      this.categories = [...Categories, ...Categories].slice(
        0,
        maxVisibleCategories
      );
    }
  }

}
