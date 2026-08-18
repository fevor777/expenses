import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { DateTime } from 'luxon';
import { BaseChartDirective } from 'ng2-charts';
import { Expense } from '../../../model/expense.model';
import { DateFrame, Mode } from '../../filter/date/dateFrame.model';
import {
  SegmentedSwitchComponent,
  SegmentedOption,
} from '../../segmented/segmented-switch.component';

@Component({
  selector: 'app-multi-chart',
  templateUrl: './multi-chart.component.html',
  styleUrls: ['./multi-chart.component.scss'],
  standalone: true,
  imports: [BaseChartDirective, SegmentedSwitchComponent, NgIf],
})
export class MultiChartComponent implements OnChanges {
  @Input() expenses: Expense[] = [];
  @Input() filter?: DateFrame;
  @Output() historyIconClick = new EventEmitter<DateFrame>();
  @Output() filterIconClick = new EventEmitter<DateFrame>();

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
  // Selected bar info (date range + value)
  selectedBarLabel?: string;
  selectedBarValue?: number | null;
  showBarIcons = false;
  private selectedBarIndex: number | null = null;
  private customBuckets: DateFrame[] = [];

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
          enabled: true,
          mode: 'index',
          intersect: false,
        },
      },
      onClick: (event: any, activeEls: any[], chart: any) =>
        this.handleChartClick(event, activeEls, chart),
    },
    legend: false,
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expenses'] || changes['filter']) {
      this.selectedBarLabel = '';
      this.showBarIcons = this.filter?.mode !== Mode.DAY;
      this.calculateChartData(this.expenses, this.filter);
    }
  }

  // Custom tooltip removed; default Chart.js tooltip is now enabled.

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

    if (mode === Mode.CUSTOM) {
      this.calculateCustomChartData(expenses, filter);
      return;
    }

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

  private calculateCustomChartData(
    expenses: Expense[],
    filter: DateFrame
  ): void {
    this.customBuckets = this.buildCustomBuckets(filter);
    this.allocateStructure(
      this.customBuckets.length,
      this.customBuckets.map(bucket => bucket.display || '')
    );

    expenses.forEach(expense => {
      const index = this.customBuckets.findIndex(
        bucket =>
          expense.date >= bucket.start.toMillis() &&
          expense.date <= bucket.finish.toMillis()
      );
      if (index >= 0) {
        this.chartOptions.datasets[0].data[index] = this.roundAdd(
          this.chartOptions.datasets[0].data[index],
          expense.amount
        );
      }
    });

    const now = DateTime.now();
    const currentBucket = this.customBuckets.findIndex(
      bucket => now >= bucket.start && now <= bucket.finish
    );
    if (currentBucket >= 0)
      this.chartOptions.datasets[0].data[currentBucket] = 0;

    this.postProcessForLineGaps();
    this.applyStylePerType();
    this.chartOptions = {
      ...this.chartOptions,
      datasets: [...this.chartOptions.datasets],
    };
    this.calculateNonZeroCount();
  }

  private buildCustomBuckets(filter: DateFrame): DateFrame[] {
    const start = filter.start.startOf('day');
    const finish = filter.finish.endOf('day');
    const days = Math.floor(finish.startOf('day').diff(start, 'days').days) + 1;
    const granularity = days <= 31 ? 'day' : days <= 365 ? 'week' : 'month';
    const buckets: DateFrame[] = [];
    let cursor = start;

    while (cursor <= finish) {
      let bucketFinish =
        granularity === 'day'
          ? cursor.endOf('day')
          : granularity === 'week'
            ? cursor.endOf('week')
            : cursor.endOf('month');
      if (bucketFinish > finish) bucketFinish = finish;
      const display = cursor.hasSame(bucketFinish, 'day')
        ? cursor.setLocale('ru').toFormat('d LLL')
        : `${cursor.setLocale('ru').toFormat('d LLL')} - ${bucketFinish.setLocale('ru').toFormat('d LLL')}`;
      buckets.push({
        start: cursor,
        finish: bucketFinish,
        mode: Mode.CUSTOM,
        display,
      });
      cursor = bucketFinish.plus({ milliseconds: 1 }).startOf('day');
    }
    return buckets;
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

  private handleChartClick(domEvent: any, activeEls: any[], chart?: any) {
    // Some Chart.js versions may not populate activeEls on first click (only hover), so compute manually if empty
    if ((!activeEls || !activeEls.length) && chart?.getElementsAtEventForMode) {
      try {
        const computed = chart.getElementsAtEventForMode(
          domEvent,
          'index',
          { intersect: false },
          true
        );
        activeEls = computed || [];
      } catch {
        /* noop */
      }
    }
    if (!activeEls || !activeEls.length) return;
    const first = activeEls[0];
    const index: number = first.index ?? first._index; // fallback for older adapters
    if (index == null) return;
    const value = this.chartOptions.datasets[0].data[index];
    this.selectedBarValue = value;
    this.selectedBarLabel = this.describeBucketRangeSimple(index);
    this.selectedBarIndex = index;
  }

  private describeBucketRangeSimple(index: number): string {
    if (!this.filter) return '';
    const { mode, start } = this.filter;
    if (!mode || !start) return '';
    if (mode === Mode.CUSTOM) return this.customBuckets[index]?.display || '';
    const s: any = start; // assume Luxon DateTime
    try {
      switch (mode) {
        case Mode.DAY: {
          const bucketStart = s.plus({ hours: index });
          const bucketEnd = bucketStart.plus({ hours: 1 });
          return `${bucketStart.toFormat('HH:00')} – ${bucketEnd.toFormat('HH:00')}`;
        }
        case Mode.WEEK: {
          const bucketStart = s.plus({ days: index });
          return bucketStart.toFormat('ccc dd');
        }
        case Mode.MONTH: {
          const bucketStart = s.plus({ days: index });
          return bucketStart.toFormat('dd LLL');
        }
        case Mode.YEAR: {
          const bucketStart = s.plus({ months: index });
          return bucketStart.toFormat('LLLL yyyy');
        }
      }
    } catch {
      /* noop */
    }
    return '';
  }

  // Removed custom external tooltip handlers and related bucket selection logic.
  private buildDateFrameForIndex(index: number): DateFrame | null {
    if (!this.filter?.start || !this.filter.mode) return null;
    const { mode, start } = this.filter;
    if (mode === Mode.CUSTOM) {
      const bucket = this.customBuckets[index];
      return bucket ? { ...bucket } : null;
    }
    let bucketStart: any = start;
    let bucketEnd: any = start;
    switch (mode) {
      case Mode.DAY:
        bucketStart = start.plus({ hours: index });
        bucketEnd = bucketStart.plus({ hours: 1 });
        break;
      case Mode.WEEK:
        bucketStart = start.plus({ days: index });
        bucketEnd = bucketStart.plus({ days: 1 });
        break;
      case Mode.MONTH:
        bucketStart = start.plus({ days: index });
        bucketEnd = bucketStart.plus({ days: 1 });
        break;
      case Mode.YEAR:
        bucketStart = start.plus({ months: index });
        bucketEnd = bucketStart.plus({ months: 1 });
        break;
    }
    let emitMode = mode;
    if (mode === Mode.WEEK || mode === Mode.MONTH) emitMode = Mode.DAY;
    if (mode === Mode.YEAR) emitMode = Mode.MONTH;
    // Derive display label similar to date filter component conventions:
    // Day frame: 'd MMMM' (e.g., '4 октября')
    // Month frame: 'LLLL' (e.g., 'октябрь')
    // Year frame: 'yyyy'
    // Hour slice inside a day: 'HH:00 – HH:00'
    let display: string;
    try {
      // bucketStart is a Luxon DateTime (assumed); set Russian locale for consistency
      if (mode === Mode.DAY) {
        // Keep the hour range to distinguish selected hour
        display = `${bucketStart.setLocale('ru').toFormat('HH:00')} – ${bucketEnd.setLocale('ru').toFormat('HH:00')}`;
      } else if (mode === Mode.WEEK || mode === Mode.MONTH) {
        // Emitting a single day frame -> format as full day label
        display = bucketStart.setLocale('ru').toFormat('d MMMM');
      } else if (mode === Mode.YEAR) {
        // Emitting a month frame
        display = bucketStart.setLocale('ru').toFormat('LLLL');
      } else {
        display = bucketStart.toISO?.() || '';
      }
    } catch {
      display = '';
    }
    return { start: bucketStart, finish: bucketEnd, mode: emitMode, display };
  }

  onHistoryIconClick() {
    if (this.selectedBarIndex == null) return;
    const frame = this.buildDateFrameForIndex(this.selectedBarIndex);
    if (frame) this.historyIconClick.emit(frame);
  }

  onFilterIconClick() {
    if (this.selectedBarIndex == null) return;
    const frame = this.buildDateFrameForIndex(this.selectedBarIndex);
    if (frame) this.filterIconClick.emit(frame);
  }
}
