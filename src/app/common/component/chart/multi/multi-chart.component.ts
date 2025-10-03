import { Component, Input, OnChanges, SimpleChanges, ElementRef, NgZone, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Expense } from '../../../model/expense.model';
import { DateFrame, Mode } from '../../filter/date/dateFrame.model';
import { DateFilterService } from '../../filter/date/date-filter.service';
import {
  SegmentedSwitchComponent,
  SegmentedOption,
} from '../../segmented/segmented-switch.component';

@Component({
  selector: 'app-multi-chart',
  templateUrl: './multi-chart.component.html',
  styleUrls: ['./multi-chart.component.scss'],
  standalone: true,
  imports: [BaseChartDirective, SegmentedSwitchComponent],
})
export class MultiChartComponent implements OnChanges, OnDestroy {
  @Input() expenses: Expense[] = [];
  @Input() filter?: DateFrame;
  @Output() barClick = new EventEmitter<DateFrame>();

  chartType: 'bar' | 'line' = 'bar';
  chartTypeOptions: SegmentedOption[] = [
    {
      value: 'bar',
      label: 'Столбцы',
      iconClass: 'fa-solid fa-chart-column',
      ariaLabel: 'Столбиковая диаграмма',
    },
    {
      value: 'line',
      label: 'Линия',
      iconClass: 'fa-solid fa-chart-line',
      ariaLabel: 'Линейная диаграмма',
    },
  ];
  totalCount: any;
  // Total buckets in the current period frame (e.g. 24 hours, 7 days, N days in month, 12 months)
  periodBucketCount = 0;

  // Template bridge for stricter typing
  onChartTypeSelect(v: string) {
    if (v === 'bar' || v === 'line') this.switchChart(v);
  }
  nonZeroCount = 0;

  chartOptions: any = {
    datasets: [
      {
        data: [],
        label: 'Expenses',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 0.8)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        tension: 0.25,
        fill: false,
      },
    ],
    labels: [],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {},
      elements: {
        line: {
          borderCapStyle: 'round',
          borderJoinStyle: 'round',
        },
      },
      plugins: {
        tooltip: {
          enabled: false, // we will render custom external tooltip
          external: (ctx: any) => this.externalTooltipHandler(ctx),
          mode: 'index',
          intersect: false,
        },
      },
    },
    legend: false,
  };

  private tooltipEl?: HTMLDivElement;
  private tooltipClickListener?: any;

  constructor(private host: ElementRef<HTMLElement>, private zone: NgZone) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expenses'] || changes['filter']) {
      this.calculateChartData(this.expenses, this.filter);
    }
  }

  ngOnDestroy(): void {
    if (this.tooltipEl && this.tooltipEl.parentNode) {
      this.tooltipEl.parentNode.removeChild(this.tooltipEl);
    }
    if (this.tooltipClickListener) {
      this.tooltipClickListener = null;
    }
  }

  switchChart(type: 'bar' | 'line') {
    if (this.chartType !== type) {
      this.chartType = type;
      // Rebuild dataset presentation (convert trailing zeros to null for line gaps)
      this.postProcessForLineGaps();
      this.applyStylePerType();
      this.chartOptions = {
        ...this.chartOptions,
        datasets: [...this.chartOptions.datasets],
      };
      this.calculateNonZeroCount();
    }
  }

  private allocateStructure(count: number, labels: (string | number)[]) {
    this.chartOptions.labels = labels;
    this.chartOptions.datasets[0].data = new Array(count).fill(0);
    this.periodBucketCount = count;
  }

  calculateChartData(expenses: Expense[], filter?: DateFrame): void {
    if (!filter || !Array.isArray(expenses)) return;

    const mode = filter.mode || Mode.DAY;
    const now = new Date();

    if (mode === Mode.DAY) {
      this.allocateStructure(
        24,
        Array.from({ length: 24 }, (_, i) => i + ':00')
      );
    } else if (mode === Mode.WEEK) {
      // Show full week Monday..Sunday
      this.allocateStructure(7, ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']);
    } else if (mode === Mode.MONTH) {
      // Derive month length from filter.start if provided, else detect from now
      let baseDate: Date;
      if (filter.start) {
        // support Luxon DateTime or native Date
        const anyStart: any = filter.start as any;
        baseDate =
          typeof anyStart.toJSDate === 'function'
            ? anyStart.toJSDate()
            : new Date(anyStart);
      } else {
        baseDate = now;
      }
      const year = baseDate.getFullYear();
      const month = baseDate.getMonth();
      const monthLength = new Date(year, month + 1, 0).getDate();
      this.allocateStructure(
        monthLength,
        Array.from({ length: monthLength }, (_, i) => i + 1)
      );
    } else if (mode === Mode.YEAR) {
      this.allocateStructure(12, [
        'янв.',
        'фев.',
        'март',
        'апр.',
        'май',
        'июнь',
        'июль',
        'авг.',
        'сен.',
        'окт.',
        'нояб.',
        'дек.',
      ]);
    }

    // Aggregate
    expenses.forEach(expense => {
      const d = new Date(expense.date);
      if (mode === Mode.DAY) {
        const h = d.getHours();
        if (this.chartOptions.datasets[0].data[h] != null) {
          this.chartOptions.datasets[0].data[h] = this.roundAdd(
            this.chartOptions.datasets[0].data[h],
            expense.amount
          );
        }
      } else if (mode === Mode.WEEK) {
        // map JS day to Monday-based index
        const dow = d.getDay();
        const idx = dow === 0 ? 6 : dow - 1;
        if (this.chartOptions.datasets[0].data[idx] != null) {
          this.chartOptions.datasets[0].data[idx] = this.roundAdd(
            this.chartOptions.datasets[0].data[idx],
            expense.amount
          );
        }
      } else if (mode === Mode.MONTH) {
        const day = d.getDate() - 1;
        if (this.chartOptions.datasets[0].data[day] != null) {
          this.chartOptions.datasets[0].data[day] = this.roundAdd(
            this.chartOptions.datasets[0].data[day],
            expense.amount
          );
        }
      } else if (mode === Mode.YEAR) {
        const m = d.getMonth();
        if (this.chartOptions.datasets[0].data[m] != null) {
          this.chartOptions.datasets[0].data[m] = this.roundAdd(
            this.chartOptions.datasets[0].data[m],
            expense.amount
          );
        }
      }
    });
    // Zero out the current in-progress bucket (showing 0 instead of partial accumulation)
    const frameIncludesNow = (() => {
      if (!filter.start || !filter.finish) return true; // assume in range if not fully specified
      const start =
        (filter.start as any)?.toJSDate?.() || new Date(filter.start as any);
      const finish =
        (filter.finish as any)?.toJSDate?.() || new Date(filter.finish as any);
      const t = Date.now();
      return start.getTime() <= t && finish.getTime() >= t;
    })();
    if (frameIncludesNow) {
      if (mode === Mode.DAY) {
        const idx = now.getHours();
        this.chartOptions.datasets[0].data[idx] = 0;
      } else if (mode === Mode.WEEK) {
        const dow = now.getDay();
        const idx = dow === 0 ? 6 : dow - 1;
        this.chartOptions.datasets[0].data[idx] = 0;
      } else if (mode === Mode.MONTH) {
        const idx = now.getDate() - 1;
        if (idx >= 0 && idx < this.chartOptions.datasets[0].data.length) {
          this.chartOptions.datasets[0].data[idx] = 0;
        }
      } else if (mode === Mode.YEAR) {
        const idx = now.getMonth();
        this.chartOptions.datasets[0].data[idx] = 0;
      }
    }

    // Keep full period visible; future buckets remain zero (so bars show full frame).

    this.postProcessForLineGaps();
    this.applyStylePerType();

    this.chartOptions = {
      ...this.chartOptions,
      datasets: [...this.chartOptions.datasets],
    };

    this.calculateNonZeroCount();
  }

  private postProcessForLineGaps() {
    if (this.chartType !== 'line') return;
    const data: (number | null)[] = this.chartOptions.datasets[0].data;
    if (!Array.isArray(data) || data.length === 0) return;
    // Identify last non-zero value index
    let lastValueIdx = -1;
    for (let i = 0; i < data.length; i++) {
      const v = data[i];
      if (v && v !== 0) lastValueIdx = i;
    }
    // Convert trailing zeros AFTER lastValueIdx to null to create visual gap
    for (let i = lastValueIdx + 1; i < data.length; i++) {
      if (data[i] === 0) data[i] = null;
    }
    // Ensure line dataset has spanGaps = false so gaps show
    this.chartOptions.datasets[0].spanGaps = false;
  }

  private applyStylePerType() {
    const ds = this.chartOptions.datasets[0];
    if (this.chartType === 'line') {
      ds.pointRadius = 0;
      ds.pointHoverRadius = 6;
      ds.tension = 0.55; // more smoothing
      ds.cubicInterpolationMode = 'monotone';
      ds.borderWidth = 2;
      ds.fill = false;
    } else {
      // bar defaults
      delete ds.pointRadius;
      delete ds.pointHoverRadius;
      ds.tension = 0.25;
      ds.borderWidth = 1;
      ds.fill = true;
    }
  }

  private roundAdd(existing: number, add: number): number {
    return Math.round((existing + add) * 100) / 100;
  }

  private calculateNonZeroCount(): void {
    const data = this.chartOptions.datasets[0].data;
    this.nonZeroCount = data.filter(
      (value: number | null) => value != null && value !== 0
    ).length;
    this.totalCount = this.expenses?.filter(
      (value: Expense) => value?.amount != null && value?.amount !== 0
    )?.length;
  }

  // ---- External tooltip logic ----
  private externalTooltipHandler(context: any) {
    const { chart, tooltip } = context;
    // Create element on first render
    if (!this.tooltipEl) {
      const el = document.createElement('div');
      el.className = 'multi-chart-tooltip';
      el.style.position = 'absolute';
      el.style.pointerEvents = 'auto';
      el.style.opacity = '0';
      el.innerHTML = '<div class="tooltip-body"></div>';
      const parent = chart.canvas.parentNode as HTMLElement;
      parent.style.position = parent.style.position || 'relative';
      parent.appendChild(el);
      // Attempt to copy Angular emulated encapsulation attribute so component-scoped styles apply
      const hostEl = this.host.nativeElement;
      const attr = Array.from(hostEl.attributes).find(a => a.name.startsWith('_ngcontent'));
      if (attr) {
        el.setAttribute(attr.name, '');
      }
      this.tooltipEl = el;
      // Delegate click once (outside Angular to reduce change detection noise)
      this.zone.runOutsideAngular(() => {
        this.tooltipClickListener = (ev: Event) => {
          const target = ev.target as HTMLElement;
            const btn = target.closest('[data-history-index]') as HTMLElement | null;
            if (btn) {
              const idx = Number(btn.dataset['historyIndex']);
              this.zone.run(() => this.emitBucketSelection(idx));
            }
        };
        el.addEventListener('click', this.tooltipClickListener);
      });
    }
    const el = this.tooltipEl!;
    if (tooltip.opacity === 0) {
      el.style.opacity = '0';
      return;
    }
    const point = tooltip.dataPoints?.[0];
    if (!point) {
      el.style.opacity = '0';
      return;
    }
    const idx: number = point.dataIndex;
    const label = point.label;
    const value = point.formattedValue;
    const range = this.describeBucketRange(idx);
    const body = el.querySelector('.tooltip-body') as HTMLElement;
    body.innerHTML = `
      <div class="tooltip-row">
        <div class="tooltip-primary"><strong>${label}</strong>: ${value}</div>
        <button type="button" class="tooltip-icon" aria-label="Перейти к истории" data-history-index="${idx}">
          <i class="fa-solid fa-clock-rotate-left"></i>
        </button>
      </div>
      <div class="tooltip-range">${range}</div>
    `;
    const { offsetLeft, offsetTop } = chart.canvas;
    // Position near caret X/Y
    // raw position (will be adjusted by CSS transform translate(-50%, -100%))
    el.style.left = offsetLeft + tooltip.caretX + 'px';
    // add small vertical gap (6px) before arrow
    el.style.top = offsetTop + tooltip.caretY - 8 + 'px';
    el.style.opacity = '1';
  }

  private describeBucketRange(index: number): string {
    if (!this.filter) return '';
    const { mode, start } = this.filter;
    if (!mode || !start) return '';
    const s = start; // Luxon DateTime
    try {
      switch (mode) {
        case Mode.DAY: {
          const bucketStart = s.plus({ hours: index });
          const bucketEnd = bucketStart.plus({ hours: 1 });
          return `${bucketStart.toFormat('HH:00')} – ${bucketEnd.toFormat('HH:00')}`;
        }
        case Mode.WEEK: {
          const bucketStart = s.plus({ days: index });
          const bucketEnd = bucketStart.plus({ days: 1 });
          return `${bucketStart.toFormat('ccc dd')} – ${bucketEnd.toFormat('ccc dd')}`;
        }
        case Mode.MONTH: {
          const bucketStart = s.plus({ days: index });
            return bucketStart.toFormat('dd LLL');
        }
        case Mode.YEAR: {
          const bucketStart = s.plus({ months: index });
          return bucketStart.toFormat('LLL yyyy');
        }
      }
    } catch { /* noop */ }
    return '';
  }

  private emitBucketSelection(index: number) {
    if (!this.filter) return;
  const { mode, start, finish } = this.filter;
    if (!mode || !start) return;
    const s = start;
    let bucketStart = s;
    let bucketEnd = s;
    switch (mode) {
      case Mode.DAY:
        bucketStart = s.plus({ hours: index });
        bucketEnd = bucketStart.plus({ hours: 1 });
        break;
      case Mode.WEEK:
        bucketStart = s.plus({ days: index });
        bucketEnd = bucketStart.plus({ days: 1 });
        break;
      case Mode.MONTH:
        bucketStart = s.plus({ days: index });
        bucketEnd = bucketStart.plus({ days: 1 });
        break;
      case Mode.YEAR:
        bucketStart = s.plus({ months: index });
        bucketEnd = bucketStart.plus({ months: 1 });
        break;
    }
    // const category = this.deriveSingleCategoryForBucket(index, mode!);
    let emitMode = mode;
    if (mode === Mode.MONTH || mode === Mode.WEEK) {
      emitMode = Mode.DAY;
    }
    if (mode === Mode.YEAR) {
      emitMode = Mode.MONTH;
    }
    const display = this.buildDisplayLabel(bucketStart, bucketEnd, emitMode, mode);
    this.barClick.emit({ start: bucketStart, finish: bucketEnd, mode: emitMode, display });
  }

  private buildDisplayLabel(start: any, finish: any, emitMode: Mode, sourceMode: Mode): string | undefined {
    // start/finish are Luxon DateTime objects (inferred from DateFrame). We guard formatting accordingly.
    try {
      if (emitMode === Mode.DAY) {
        const now = (start as any).isValid ? (start as any) : null;
        if (now && now.hasSame(DateFilterService.prototype.getInitialDayValue().start, 'day')) {
          return DateFilterService.initialDayFrameLabel;
        }
        return (start as any).toFormat?.('dd LLL') ?? undefined;
      }
      if (emitMode === Mode.WEEK) {
        return (start as any).toFormat?.('dd LLL') + ' – ' + (finish as any).minus?.({ days: 1 }).toFormat?.('dd LLL');
      }
      if (emitMode === Mode.MONTH) {
        return (start as any).toFormat?.('LLLL yyyy') ?? undefined;
      }
      if (emitMode === Mode.YEAR) {
        return (start as any).toFormat?.('yyyy') ?? undefined;
      }
    } catch { /* noop */ }
    return undefined;
  }
}
