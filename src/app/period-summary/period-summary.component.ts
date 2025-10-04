import { Component, HostListener, OnInit } from '@angular/core';
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
export class PeriodSummaryComponent implements OnInit {
  summaries$: Observable<PeriodSummary[]>;
  // collapse state keyed by summary key (today, yesterday, week, month)
  collapsed: Record<string, boolean> = {};

  constructor(
    private periodSummaryService: PeriodSummaryService,
    private router: Router,
    private dateFilterService: DateFilterService
  ) {}

  ngOnInit(): void {
    // Retrieve snapshot of period narratives. Architecture mirrors pattern of summary services.
    this.summaries$ = this.periodSummaryService.getCurrentSummaries();
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
}
