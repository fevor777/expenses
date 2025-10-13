import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ElementRef,
  NgZone,
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

  // Base dimensions used for computing columns; width includes icon + padding space
  private readonly categoryWidth = 114;
  private containerWidth = 0;
  // Template ref for precise measurement
  @ViewChild('categoriesEl') categoriesEl?: ElementRef<HTMLDivElement>;

  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private touchEndX: number = 0;
  private touchEndY: number = 0;
  private isDown: boolean = false;

  private collapsedVisibleCount: number = 0; // remembers how many categories fit when collapsed
  private pendingRafMeasure = false; // guard to avoid duplicate RAF chains
  private resizeTimeout: any;
  private lastMeasuredWidth: number = 0;
  private lastBlockHeight: number = 0;
  private lastRowGap: number = 0;
  private readonly widthChangeThreshold = 12; // px threshold to remeasure
  constructor(private ngZone: NgZone) {}

  @HostListener('window:resize', ['$event'])
  onResize(_event: any): void {
    if (this.isContentDown) return; // only matters for collapsed state
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      // Recompute after small debounce to avoid thrash on continuous resize/orientation change
      this.scheduleCollapsedMeasurement(true);
    }, 120);
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
        // Expanded state: show full list
        this.categories = [...Categories];
        this.showMore = true;
        this.pendingRafMeasure = false; // reset
      } else {
        // Collapsing: schedule deterministic measurement after layout settles
        this.scheduleCollapsedMeasurement();
      }
    }
  }

  ngAfterViewInit(): void {
    if (!this.isContentDown) {
      this.scheduleCollapsedMeasurement();
    }
  }

  onCategoryClick(category: string): void {
    this.categoryClick.emit(category);
  }

  onClickMore(): void {
    this.clickMore.emit(!this.isContentDown);
  }

  private updateVisibleCategories(forceRecalculateCollapsed: boolean = false): void {
    if (this.isContentDown) return; // expanded uses full list
    const el = this.categoriesEl?.nativeElement;
    if (!el) return;
    this.containerWidth = el.clientWidth;
    const containerHeight = el.clientHeight;
    if (!forceRecalculateCollapsed && Math.abs(this.containerWidth - this.lastMeasuredWidth) < this.widthChangeThreshold) {
      return; // skip trivial width changes
    }
    this.lastMeasuredWidth = this.containerWidth;
    const maxColumns = Math.max(1, Math.floor(this.containerWidth / this.categoryWidth));
    // Derive actual category block height and vertical gap using first category element
    const firstCategory: HTMLElement | null = el.querySelector('.category');
    let blockHeight = this.lastBlockHeight || 96; // fallback approximation
    let rowGap = this.lastRowGap || 0; // fallback gap
    if (firstCategory) {
      const catStyles = getComputedStyle(firstCategory);
      const h = firstCategory.clientHeight; // includes padding
      if (h && h !== this.lastBlockHeight) {
        blockHeight = h;
        this.lastBlockHeight = h;
      }
      // Get row gap from parent flex container (.categories) if available
      const parentStyles = getComputedStyle(el);
      const gapVal = parentStyles.rowGap || parentStyles.gap;
      if (gapVal) {
        // parse px value
        const parsed = parseFloat(gapVal.toString());
        if (!isNaN(parsed) && parsed !== this.lastRowGap) {
          rowGap = parsed;
          this.lastRowGap = parsed;
        }
      }
    }
    const effectiveRowHeight = blockHeight + rowGap;
    let dynamicRows = Math.floor(containerHeight / Math.max(1, effectiveRowHeight));
    if (dynamicRows < 1) dynamicRows = 1; // ensure at least one row
    const collapsedCount = maxColumns * dynamicRows;
    if (forceRecalculateCollapsed || !this.collapsedVisibleCount) {
      this.collapsedVisibleCount = collapsedCount;
    }
    this.showMore = Categories.length > this.collapsedVisibleCount;
    const newSlice = [...Categories].slice(0, this.collapsedVisibleCount);
    // Avoid unnecessary array replacement if slice identical length and same last id
    if (this.categories.length !== newSlice.length || this.categories[this.categories.length - 1]?.id !== newSlice[newSlice.length - 1]?.id) {
      this.categories = newSlice;
    }
  }

  private scheduleCollapsedMeasurement(force: boolean = false): void {
    if (this.isContentDown || this.pendingRafMeasure) {
      if (force && !this.isContentDown) {
        // If already measuring, allow a fresh measurement after current chain
        this.pendingRafMeasure = false;
      } else {
        return;
      }
    }
    this.pendingRafMeasure = true;
    // Run outside Angular to avoid triggering CD for intermediate frames
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        // Single RAF should be sufficient post style/layout flush
        this.ngZone.run(() => {
          this.pendingRafMeasure = false;
          this.updateVisibleCategories(true);
        });
      });
    });
  }

  trackByCategory = (_: number, item: Category) => item.id;

  private calculateRows(
    containerWidth: number,
    containerHeight: number
  ): number {
    // Deprecated: height-based calculation removed. Preserve signature for backward compatibility if referenced elsewhere.
    const maxColumns = Math.floor(containerWidth / this.categoryWidth);
    const assumedRows = 3; // fallback
    return maxColumns * assumedRows;
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
