import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

// Local duplicate of interfaces (minimal change). If reused elsewhere later we can extract.
export interface DayCategoryStat {
  id: string;
  name: string;
  short: string;
  count: number;
  amount: number;
}
export interface DayTooltipData {
  date: Date;
  total: number; // total expense entries
  categories: DayCategoryStat[];
  totalAmount: number; // summed includeInBalance amount
}
type TooltipPlacement = 'top' | 'left' | 'right';

@Component({
  selector: 'app-day-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './day-tooltip.component.html',
  styleUrls: ['./day-tooltip.component.scss']
})
export class DayTooltipComponent implements AfterViewInit, OnChanges {
  @Input() data: DayTooltipData | null = null;
  @Output() navigateHistory = new EventEmitter<Date>();
  @Output() navigateStatistics = new EventEmitter<Date>();

  placement: TooltipPlacement = 'top';
  private repositionScheduled = false;

  constructor(private host: ElementRef<HTMLElement>) {}

  formatAmount(amount: number | undefined | null): string {
    if (amount === undefined || amount === null || isNaN(amount)) return '0 €';
    const rounded = Math.abs(amount - Math.round(amount)) < 0.05 ? amount.toFixed(0) : amount.toFixed(1);
    return rounded.replace(/\.0$/, '') + '€';
  }

  onHistory() {
    if (this.data?.date) this.navigateHistory.emit(this.data.date);
  }
  onStatistics() {
    if (this.data?.date) this.navigateStatistics.emit(this.data.date);
  }

  ngAfterViewInit(): void {
    this.scheduleReposition();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.scheduleReposition();
    }
  }

  private scheduleReposition(): void {
    if (this.repositionScheduled) return;
    this.repositionScheduled = true;
    // Allow next tick so DOM renders *ngIf block
    queueMicrotask(() => {
      this.repositionScheduled = false;
      this.repositionIfNeeded();
    });
  }

  private repositionIfNeeded(): void {
    if (!this.data) return; // not visible
    const root = this.host?.nativeElement;
    if (!root) return;
    const tooltipEl = root.querySelector('.day-tooltip') as HTMLElement | null;
    if (!tooltipEl) return;

    // Reset to default top placement before measuring
    this.applyTopStyles(tooltipEl);

    const rect = tooltipEl.getBoundingClientRect();
    const parent = tooltipEl.parentElement; // day cell
    const parentRect = parent?.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let placement: TooltipPlacement = 'top';

    // Vertical overflow above viewport: try horizontal placements
    if (rect.top < 0 || rect.bottom > vh) {
      const spaceLeft = parentRect ? parentRect.left : rect.left;
      const spaceRight = parentRect ? vw - parentRect.right : vw - rect.right;
      // Prefer side with more space
      if (spaceLeft > spaceRight && spaceLeft > rect.width + 8) {
        placement = 'left';
      } else if (spaceRight >= spaceLeft && spaceRight > rect.width + 8) {
        placement = 'right';
      } else {
        // If neither side has enough, keep top (will overflow slightly) but clamp within viewport horizontally
        placement = 'top';
      }
    } else if (rect.left < 0) {
      placement = 'right';
    } else if (rect.right > vw) {
      placement = 'left';
    }

    if (placement === 'left') {
      this.applyLeftStyles(tooltipEl);
    } else if (placement === 'right') {
      this.applyRightStyles(tooltipEl);
    } else {
      this.applyTopStyles(tooltipEl);
    }
    this.placement = placement;
  }

  private applyTopStyles(el: HTMLElement): void {
    el.style.bottom = '100%';
    el.style.top = 'auto';
    el.style.left = '50%';
    el.style.transform = 'translate(-50%, -10px)';
  }

  private applyLeftStyles(el: HTMLElement): void {
    el.style.bottom = 'auto';
    el.style.top = '50%';
    el.style.left = '0';
    el.style.transform = 'translate(-105%, -50%)';
  }

  private applyRightStyles(el: HTMLElement): void {
    el.style.bottom = 'auto';
    el.style.top = '50%';
    el.style.left = '100%';
    el.style.transform = 'translate(8px, -50%)';
  }
}
