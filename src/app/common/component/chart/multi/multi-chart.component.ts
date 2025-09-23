import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
  imports: [BaseChartDirective, SegmentedSwitchComponent],
})
export class MultiChartComponent implements OnChanges {
  @Input() expenses: Expense[] = [];
  @Input() filter?: DateFrame;

  chartType: 'bar' | 'line' = 'bar';
  chartTypeOptions: SegmentedOption[] = [
    { value: 'bar', label: 'Bar' },
    { value: 'line', label: 'Line' },
  ];

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
    },
    legend: false,
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expenses'] || changes['filter']) {
      this.calculateChartData(this.expenses, this.filter);
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
  }
}
