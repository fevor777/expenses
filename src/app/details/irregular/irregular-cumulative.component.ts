import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Expense } from '../../common/model/expense.model';
import {
  DateFrame,
  Mode,
} from '../../common/component/filter/date/dateFrame.model';
import { filterIrregular } from './irregular-charts.utils';

@Component({
  selector: 'app-irregular-cumulative',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cum" *ngIf="points.length > 1">
      <svg [attr.viewBox]="'0 0 ' + width + ' ' + height" class="chart">
        <polyline [attr.points]="poly" class="line" />
        <line
          *ngIf="budget > 0"
          class="budget"
          x1="0"
          [attr.y1]="height - budgetY"
          [attr.x2]="width"
          [attr.y2]="height - budgetY"
        />
      </svg>
      <div class="meta">
        Spent {{ total | number: '1.0-0' }} / {{ budget || '-' }} | Pace:
        {{ pace | number: '1.0-0' }} / day
      </div>
    </div>
  `,
  styles: [
    `
      .cum {
        width: 100%;
        max-width: 420px;
      }
      .chart {
        width: 100%;
        height: 120px;
      }
      .line {
        fill: none;
        stroke: #346078;
        stroke-width: 2;
      }
      .budget {
        stroke: #870024;
        stroke-dasharray: 4 4;
        stroke-width: 2;
      }
      .meta {
        font-size: 11px;
        color: #555;
        margin-top: 4px;
      }
    `,
  ],
})
export class IrregularCumulativeComponent implements OnChanges {
  @Input() expenses: Expense[] = [];
  @Input() budget = 0;
  @Input() date?: DateFrame;
  width = 380;
  height = 100;
  points: { x: number; y: number }[] = [];
  poly = '';
  total = 0;
  budgetY = 0;
  pace = 0;
  ngOnChanges() {
    this.build();
  }
  private build() {
    const irr = filterIrregular(this.expenses).sort((a, b) => a.date - b.date);
    const mode = this.date?.mode;
    const buckets = this.makeBuckets(mode);
    irr.forEach(e => {
      const d = new Date(e.date);
      const idx = this.indexFor(d, mode);
      if (idx >= 0 && idx < buckets.length) buckets[idx] += e.amount || 0;
    });
    let run = 0;
    const cum: number[] = [];
    buckets.forEach(v => {
      run += v;
      cum.push(run);
    });
    this.total = run;
    const max = Math.max(this.budget || 0, ...cum, 1);
    this.points = cum.map((v, i) => ({
      x: (i / (cum.length - 1 || 1)) * this.width,
      y: this.height - (v / max) * this.height,
    }));
    this.poly = this.points.map(p => `${p.x},${p.y}`).join(' ');
    this.budgetY = (this.budget / max) * this.height;
    const days = buckets.length || 1;
    this.pace = this.total / days;
  }
  private makeBuckets(mode: Mode) {
    if (mode === Mode.YEAR) return new Array(12).fill(0);
    if (mode === Mode.WEEK) return new Array(7).fill(0);
    if (mode === Mode.DAY) return new Array(24).fill(0);
    return new Array(31).fill(0); // month/default
  }
  private indexFor(d: Date, mode: Mode) {
    if (mode === Mode.YEAR) return d.getMonth();
    if (mode === Mode.WEEK) return d.getDay();
    if (mode === Mode.DAY) return d.getHours();
    return d.getDate() - 1;
  }
}
