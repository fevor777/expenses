import { Component, HostListener, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { PeriodSummaryService } from './utils/period-summary.service';
import { PeriodSummary } from './utils/period-summary.model';
import { CollapsedPanelComponent } from '../common/component/collapsed-panel';
import { DateFrame } from '../common/component/filter/date/dateFrame.model';
import { DateFilterService } from '../common/component/filter/date/date-filter.service';
import { GLOBAL_SWIPE_LENGTH } from '../constants';

@Component({
  selector: 'app-period-summary',
  templateUrl: './period-summary.component.html',
  styleUrls: ['./period-summary.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, CollapsedPanelComponent],
})
export class PeriodSummaryComponent implements OnInit, OnDestroy {
  summaries$: Observable<PeriodSummary[]>;
  // collapse state keyed by summary key (today, yesterday, week, month)
  collapsed: Record<string, boolean> = {};

  constructor(
    private periodSummaryService: PeriodSummaryService,
    private router: Router,
    private dateFilterService: DateFilterService
  ) {}

  @ViewChild('psNav') private navRef?: ElementRef<HTMLElement>;
  @ViewChild('psContent') private contentRef?: ElementRef<HTMLElement>;
  private resizeObserver?: ResizeObserver;
  private lastHeight = -1;

  private applyOffset(): void {
    requestAnimationFrame(() => {
      const nav = this.navRef?.nativeElement;
      const content = this.contentRef?.nativeElement;
      if (!nav || !content) { return; }
      const h = nav.offsetHeight || 0;
      if (h === this.lastHeight) { return; }
      this.lastHeight = h;
      content.style.marginTop = h + 'px';
    });
  }

  ngOnInit(): void {
    // Retrieve snapshot of period narratives. Architecture mirrors pattern of summary services.
    this.summaries$ = this.periodSummaryService.getCurrentSummaries();
    queueMicrotask(() => {
      const nav = this.navRef?.nativeElement;
      if (nav) {
        this.resizeObserver = new ResizeObserver(() => this.applyOffset());
        this.resizeObserver.observe(nav);
        this.applyOffset();
      }
      window.addEventListener('resize', this.applyOffset, { passive: true });
    });
  }

  onToggle(key: string): void {
    this.collapsed[key] = !this.collapsed[key];
  }

  navigateToStatistics(frame: DateFrame): void {
    this.dateFilterService.dateFilter = frame;
    this.router.navigate(['/statistics']);
  }

  navigateToHistory(frame: DateFrame): void {
    this.dateFilterService.dateFilter = frame;
    this.router.navigate(['/history']);
  }

  // --- Swipe Navigation (parity with statistics component) ---
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

  private handleSwipeGesture() {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > GLOBAL_SWIPE_LENGTH) {
        this.onSwipeRight();
      } else if (deltaX < -GLOBAL_SWIPE_LENGTH) {
        this.onSwipeLeft();
      }
    }
  }

  private onSwipeLeft() {
    // Navigate home on left swipe
    this.router.navigate(['/']);
  }

  private onSwipeRight() {
    // Navigate home on right swipe (symmetric behavior requested)
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    if (this.resizeObserver && this.navRef?.nativeElement) {
      this.resizeObserver.unobserve(this.navRef.nativeElement);
      this.resizeObserver.disconnect();
    }
    window.removeEventListener('resize', this.applyOffset as any);
  }
}
