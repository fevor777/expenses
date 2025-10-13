import { Component, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable accessible spinner component.
 * Inputs:
 *  - size: CSS size (width/height). Can be number (px) or any valid string. Defaults to 42.
 *  - color: CSS color for top segment. Falls back to accent var or currentColor.
 * Usage: <app-spinner [size]="48" color="#ff9800"></app-spinner>
 */
@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible" class="spinner" role="status" aria-live="polite" aria-label="Loading">
      <div class="spinner-circle" [style.borderTopColor]="resolvedColor" [style.width]="resolvedSize" [style.height]="resolvedSize"></div>
    </div>
  `,
  styles: [`
    :host { display: inline-flex; }
    .spinner { position: relative; width: var(--spinner-size); height: var(--spinner-size); }
    .spinner-circle {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      border: 4px solid rgba(var(--color-text-rgb,255,255,255),0.15);
      border-top-color: var(--color-accent,#4caf50);
      border-radius: 50%;
      animation: spin 1.2s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (prefers-reduced-motion: reduce) { .spinner-circle { animation: none; } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent implements OnChanges, OnDestroy {
  /** Size can be number (treated as px) or full CSS string */
  @Input() size: number | string | undefined;
  /** Color overrides the top segment */
  @Input() color: string | undefined;
  /** Controls visibility of spinner; when false spinner is hidden */
  @Input() started: boolean = true;
  /** Show delay (ms) before spinner becomes visible after started turns true */
  @Input() delay: number = 300;
  /** Minimum hide delay (ms) spinner remains visible after started turns false */
  @Input() minHideDelay: number = 1000;

  /** Internal visibility flag used by template */
  visible: boolean = false;
  private showTimer: any;
  private hideTimer: any;
  private visibleSince: number = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  get resolvedSize(): string {
    // Increased default size for a "longer" circle appearance
    if (this.size === undefined || this.size === null) return '52px';
    return typeof this.size === 'number' ? `${this.size}px` : this.size;
  }

  get resolvedColor(): string | null {
    return this.color || 'var(--color-accent, currentColor)';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['started'] || changes['delay'] || changes['minHideDelay']) {
      this.processState();
    }
  }

  private processState(): void {
    if (this.started) {
      // Cancel any hide timers
      if (this.hideTimer) {
        clearTimeout(this.hideTimer);
        this.hideTimer = null;
      }
      // If already visible do nothing
      if (this.visible) {
        return;
      }
      // Schedule show after delay
      if (this.showTimer) {
        clearTimeout(this.showTimer);
      }
      const d = Math.max(0, this.delay || 0);
      if (d === 0) {
        this.setVisible(true);
      } else {
        this.showTimer = setTimeout(() => {
          this.setVisible(true);
          this.showTimer = null;
        }, d);
      }
    } else {
      // started is false: cancel show timer if pending (never show)
      if (this.showTimer) {
        clearTimeout(this.showTimer);
        this.showTimer = null;
      }
      if (!this.visible) {
        // Already hidden, nothing to do
        return;
      }
      // Determine elapsed visible time
      const elapsed = Date.now() - this.visibleSince;
      const minDuration = Math.max(0, this.minHideDelay || 0);
      if (elapsed >= minDuration) {
        this.setVisible(false);
      } else {
        // Schedule hide for remaining time
        const remaining = minDuration - elapsed;
        if (this.hideTimer) {
          clearTimeout(this.hideTimer);
        }
        this.hideTimer = setTimeout(() => {
          this.setVisible(false);
          this.hideTimer = null;
        }, remaining);
      }
    }
  }

  private setVisible(v: boolean): void {
    this.visible = v;
    if (v) {
      this.visibleSince = Date.now();
    }
    // Trigger change detection for OnPush
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    if (this.showTimer) clearTimeout(this.showTimer);
    if (this.hideTimer) clearTimeout(this.hideTimer);
  }
}
