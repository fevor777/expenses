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
  @Output() categorySwipeRight: EventEmitter<void> = new EventEmitter<void>();
  @Output() categorySwipeLeft: EventEmitter<void> = new EventEmitter<void>();
  @Output() categorySwipeUp: EventEmitter<void> = new EventEmitter<void>();
  @Output() categorySwipeDown: EventEmitter<void> = new EventEmitter<void>();
  @Output() clickMore: EventEmitter<void> = new EventEmitter<void>();

  categories: Category[] = [...Categories, ...Categories];

  showMore: boolean = false;

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

  private categoryWidth = 120; // 70px width + 15px margin
  private categoryHeight = 94;
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

      this.categories = [...Categories, ...Categories].slice(0, maxVisibleCategories);
      this.showMore = Categories.length > maxVisibleCategories;
    }
  }

  touchStartX: number = 0;
  touchStartY: number = 0;
  touchEndX: number = 0;
  touchEndY: number = 0;

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
    this.touchStartY = event.changedTouches[0].screenY;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.touchEndY = event.changedTouches[0].screenY;
    this.handleSwipeGesture();
  }

  handleSwipeGesture() {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;

    // Detect horizontal swipe only if it is more significant than vertical swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 50) {
        this.onSwipeRight();
      } else if (deltaX < -50) {
        this.onSwipeLeft();
      }
    } else if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY < -50) {
        // Swiping up decreases Y coordinate
        this.onSwipeUp();
      } else if (deltaY > 50) {
        // Swiping down increases Y coordinate
        this.onSwipeDown();
      }
    }
  }

  onSwipeRight(): void {
    this.categorySwipeRight.emit();
  }
  onSwipeLeft(): void {
    this.categorySwipeLeft.emit();
  }

  onSwipeUp(): void {
    if (this.isScrolledUp()) {
      this.categorySwipeUp.emit();
    }
  }

  onSwipeDown(): void {

  }

  isScrolledUp(): boolean {
    // Check if the user is not scrolled to the bottom
    const scrollableHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const scrollPosition = window.scrollY;
    return scrollPosition === scrollableHeight - clientHeight;
  }

  onClickMore() {
    this.clickMore.emit();
  }

  // ----------------
  menuVisible = false;
  menuPosition = { top: '0px', left: '0px' };
  selectedIconIndex: number | null = null;

  onPress(event: any, index: number) {
    const domEvent = event.srcEvent as MouseEvent;
    domEvent.preventDefault(); // Prevent the default context menu
    domEvent.stopPropagation();
    this.selectedIconIndex = index;
    this.menuVisible = true;

    // Get the bounding rect of the pressed icon
    const iconElement = (event.target as HTMLElement).getBoundingClientRect();

    // Adjust the menu position based on the icon's position
    this.menuPosition = {
      top: `${iconElement.bottom + window.scrollY}px`,
      left: `${iconElement.left + window.scrollX}px`,
    };
  }

  updateIcon() {
    // console.log('Update icon:', this.icons[this.selectedIconIndex!]);
    this.menuVisible = false;
  }

  deleteIcon() {
    // console.log('Delete icon:', this.icons[this.selectedIconIndex!]);
    // this.icons.splice(this.selectedIconIndex!, 1);
    this.menuVisible = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Hide the menu if a click is detected outside of the menu
    // if (this.menuVisible) {
    //   this.menuVisible = false;
    // }
  }
}
