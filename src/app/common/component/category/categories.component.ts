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
import { Categories, Category } from '../../model/categories';
import { CommonModule } from '@angular/common';
import { GLOBAL_SWIPE_LENGTH } from '../../../constants';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class CategoriesComponent implements AfterViewInit, OnChanges {
  @Input() isContentDown: boolean;
  @Input() enteredAmount: string;

  @Output() categoryClick: EventEmitter<string> = new EventEmitter<string>();
  @Output() categorySwipeRight: EventEmitter<void> = new EventEmitter<void>();
  @Output() categorySwipeLeft: EventEmitter<void> = new EventEmitter<void>();
  @Output() categorySwipeUp: EventEmitter<void> = new EventEmitter<void>();
  @Output() categorySwipeDown: EventEmitter<void> = new EventEmitter<void>();
  // Emits desired expanded state (true => expand to full list, false => collapse back)
  @Output() clickMore: EventEmitter<boolean> = new EventEmitter<boolean>();

  categories: Category[] = [...Categories];

  showMore: boolean = false;

  // Adjusted to match real rendered dimensions (90px width + padding) to keep slice stable
  private categoryWidth = 114;
  private categoryHeight = 88; // 64px height + 24px vertical padding
  private containerWidth = 0;
  private containerHeight = 0;

  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private touchEndX: number = 0;
  private touchEndY: number = 0;
  private isDown: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(_event: any): void {
    this.updateVisibleCategories();
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
    this.touchStartY = event.changedTouches[0].screenY;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    this.touchEndY = event.changedTouches[0].screenY;
    this.handleSwipeGesture();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isContentDown']) {
      if (this.isContentDown) {
        this.categories = [...Categories];
        // Ensure the toggle bar shows immediately when expanded
        this.showMore = true;
      } else {
        this.updateVisibleCategories();
      }
    }
  }

  ngAfterViewInit(): void {
    this.updateVisibleCategories();
  }

  onCategoryClick(category: string): void {
    this.categoryClick.emit(category);
  }

  onClickMore(): void {
    // When currently expanded (isContentDown true), clicking means collapse (false), else expand (true)
    this.clickMore.emit(!this.isContentDown);
  }

  private updateVisibleCategories(): void {
    this.categories = [];
    const containerElement = document.querySelector('.categories');
    if (containerElement) {
      this.containerWidth = containerElement.clientWidth;
      this.containerHeight = containerElement.clientHeight;

      let maxVisibleCategories = this.calculateRows(
        this.containerWidth,
        this.containerHeight
      );
      this.showMore = Categories.length > maxVisibleCategories;
      if (this.showMore) {
        maxVisibleCategories = this.calculateRows(
          this.containerWidth,
          this.containerHeight - 40
        );
      }
      this.categories = [...Categories].slice(0, maxVisibleCategories);
    }
  }

  private calculateRows(
    containerWidth: number,
    containerHeight: number
  ): number {
    const maxColumns = Math.floor(containerWidth / this.categoryWidth);
    const maxRows = Math.floor(containerHeight / this.categoryHeight);
    return maxColumns * maxRows;
  }

  private handleSwipeGesture(): void {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;

    // Detect horizontal swipe only if it is more significant than vertical swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > GLOBAL_SWIPE_LENGTH) {
        this.onSwipeRight();
      } else if (deltaX < -GLOBAL_SWIPE_LENGTH) {
        this.onSwipeLeft();
      }
    } else if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY < -GLOBAL_SWIPE_LENGTH) {
        // Swiping up decreases Y coordinate
        this.onSwipeUp();
      } else if (deltaY > GLOBAL_SWIPE_LENGTH) {
        // Swiping down increases Y coordinate
        this.onSwipeDown();
      }
    }
  }

  private onSwipeRight(): void {
    this.categorySwipeRight.emit();
  }
  private onSwipeLeft(): void {
    this.categorySwipeLeft.emit();
  }

  private onSwipeUp(): void {
    if (this.isScrolledUp()) {
      if (this.isDown) {
        this.categorySwipeUp.emit();
      } else {
        this.isDown = true;
      }
    } else {
      this.isDown = false;
    }
  }

  private onSwipeDown(): void {}

  private isScrolledUp(): boolean {
    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    const scrollHeight =
      document.documentElement.scrollHeight || document.body.scrollHeight || 0;
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      0;

    // If the difference between scrollHeight and scrollTop is greater than the clientHeight, then it's scrolled up
    return scrollTop === scrollHeight - clientHeight;
  }
}
