import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  AfterViewInit,
  ChangeDetectorRef,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SegmentedOption {
  value: string; // kept generic; parent may cast
  label: string;
}

@Component({
  selector: 'app-segmented-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './segmented-switch.component.html',
  styleUrls: ['./segmented-switch.component.scss'],
})
export class SegmentedSwitchComponent implements OnChanges, AfterViewInit {
  /** Options to render */
  @Input({ required: true }) options: SegmentedOption[] = [];
  /** Currently active value */
  private _active?: string;
  @Input() set active(v: string | undefined) {
    if (v !== this._active) {
      this._active = v;
      if (this.viewInited) {
        queueMicrotask(() => this.safeUpdateBg());
      }
    }
  }
  get active(): string | undefined {
    return this._active;
  }
  /** ARIA label for the button group */
  @Input() ariaLabel = 'Segmented control';
  /** Emit when user selects a new option */
  @Output() select = new EventEmitter<string>();

  @ViewChildren('segBtn') buttons?: QueryList<ElementRef<HTMLButtonElement>>;

  bgStyle: { width?: string; transform?: string } = {
    width: '0px',
    transform: 'translateX(0)'
  };

  private viewInited = false;

  constructor(private host: ElementRef<HTMLElement>, private cdr: ChangeDetectorRef) {}

  onClick(value: string) {
    if (value !== this.active) {
      this.select.emit(value);
    }
  }

  get activeIndex(): number {
    const i = this.options.findIndex(o => o.value === this.active);
    return i >= 0 ? i : 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'] && !changes['options'].firstChange) {
      queueMicrotask(() => this.updateBg());
    }
  }

  ngAfterViewInit(): void {
    this.viewInited = true;
    // Defer to next microtask to ensure initial layout is stable
    Promise.resolve().then(() => {
      this.safeUpdateBg();
    });
  }

  @HostListener('window:resize') onResize() {
    this.updateBg();
  }

  private safeUpdateBg(): void {
    this.updateBg();
    // Explicitly mark after async style change to prevent ExpressionChanged errors
    this.cdr.detectChanges();
  }

  private updateBg(): void {
    if (!this.buttons || !this.host?.nativeElement) return;
    const btns = this.buttons.toArray();
    if (!btns.length) return;
    const idx = this.activeIndex;
    const activeEl = btns[idx]?.nativeElement;
    if (!activeEl) return;
    const container = this.host.nativeElement.querySelector('.segmented') as HTMLElement;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();
    const padLeft = parseFloat(getComputedStyle(container).paddingLeft) || 0;
    let left = activeRect.left - containerRect.left - padLeft;
    if (left < 0) left = 0; // safety
    const width = activeRect.width;
    this.bgStyle = {
      width: width + 'px',
      transform: `translateX(${left}px)`,
    };
  }
}
