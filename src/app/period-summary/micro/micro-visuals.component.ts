import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Expense } from '../../common/model/expense.model';
import { DateFrame } from '../../common/component/filter/date/dateFrame.model';
import { getCategoryNameById } from '../../common/model/categories';

interface CategoryStat {
  id: string;
  name: string;
  total: number;
  percent: number; // retained temporarily but no longer displayed
  series: number[]; // daily totals over ordered dateKeys
  max: number; // max value in series
  trendDelta: number; // now represents count of expenses for the category (sorting metric for trend column)
  activeCount: number; // number of days with spending > 0
  entryCount: number; // number of expense entries contributing (non-zero amounts)
}

@Component({
  selector: 'app-micro-visuals',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="micro-wrapper" *ngIf="stats.length; else noDataTpl">
      <table class="micro-table">
        <thead>
          <tr>
            <th>Категория</th>
            <th class="share-col sortable" (click)="toggleSort('activeCount')">
              Колл.
              <span class="sort-indicator" *ngIf="sortKey === 'activeCount'">{{
                sortDir === 1 ? '▲' : '▼'
              }}</span>
            </th>
            <th class="trend-col sortable" (click)="toggleSort('trendDelta')">
              Тренд
              <span class="sort-indicator" *ngIf="sortKey === 'trendDelta'">{{
                sortDir === 1 ? '▲' : '▼'
              }}</span>
            </th>
            <th class="sum-col sortable" (click)="toggleSort('total')">
              Сумма
              <span class="sort-indicator" *ngIf="sortKey === 'total'">{{
                sortDir === 1 ? '▲' : '▼'
              }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            *ngFor="let s of stats"
            class="cat-row"
            [class.active]="
              selectedCategories?.length === 1 && selectedCategories[0] === s.id
            "
          >
            <td class="cat-cell">
              <span class="row-x" (click)="onRemoveCategory(s.id, $event)"
                >X</span
              >
              <span class="cat-name" (click)="selectCategory(s.id)">{{
                s.name
              }}</span>
            </td>
            <td class="share-col">
              <div style="font-size:11px; text-align:center; line-height:1.2;">
                <span>{{ s.activeCount }}/{{ dateKeys.length }}</span>
                <span style="color:#888;"> • {{ s.entryCount }}</span>
              </div>
            </td>
            <td class="trend-col">
              <svg
                *ngIf="s.series.length > 1"
                class="spark"
                preserveAspectRatio="none"
                [attr.viewBox]="'0 0 ' + getSparkWidth(s.series.length) + ' 20'"
              >
                <polyline
                  [attr.points]="buildSparkPoints(s)"
                  fill="none"
                  stroke="#3366cc"
                  stroke-width="0.5"
                />
              </svg>
              <div *ngIf="s.series.length <= 1" class="spark-placeholder">
                •
              </div>
            </td>
            <td class="sum-col sum-col-value" style="text-align:right">
              {{ s.total | number: '1.2-2' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ng-template #noDataTpl>
      <div class="micro-empty">Нет данных</div>
    </ng-template>
  `,
  styles: [
    `
      .micro-wrapper {
        margin-top: 20px;
      }
      .micro-header {
        margin: 0 2px 8px 2px;
      }
      .micro-title {
        font-weight: 600;
        font-size: 15px;
      }
      .micro-subtitle {
        font-size: 12px;
        color: #666;
      }
      .micro-empty {
        font-size: 14px;
        color: #777;
        margin: 8px;
      }
      .micro-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
        table-layout: fixed;
      }
      .micro-table th {
        text-align: left;
        font-weight: 600;
        font-size: 12px;
        padding: 8px 2px;
        border-bottom: 1px solid #eee;
      }
      .micro-table td {
        padding: 7px 2px;
        vertical-align: middle;
        border-bottom: 1px solid #f5f5f5;
      }
      .micro-table tbody tr.cat-row:last-child td {
        border-bottom: none;
      }
      .micro-table tbody tr.cat-row {
        cursor: pointer;
      }
      /* hover background removed */
      .micro-table tbody tr.cat-row.active {
        background: #e6f3ff;
      }
      .cat-cell {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .row-x {
        font-size: 10px;
        color: #666;
        cursor: pointer;
        padding: 2px 8px;
        border-radius: 3px;
      }
      /* hover state removed */
      .cat-name {
        color: #1a73e8;
        cursor: pointer;
        text-decoration: underline;
        text-underline-offset: 2px;
        font-size: 12px;
      }
      /* hover state removed */
      .micro-table tbody tr.cat-row.active .cat-name {
        font-weight: 600;
        color: #0b5ec9;
      }
      .cat-cell {
        white-space: nowrap;
        min-width: 200px;
      }
      .share-col {
        width: 50px;
      }
      .trend-col {
        width: 120px;
      }
      .sum-col {
        width: 60px;
        text-align: right;
      }
      .sum-col-value {
        letter-spacing: 0.7px;
        font-weight: 600;
      }
      .sortable {
        cursor: pointer;
        user-select: none;
      }
      /* hover state removed */
      .sort-indicator {
        font-size: 10px;
        margin-left: 2px;
      }
      .spark {
        width: 100%;
        height: 20px;
      }
      .spark-placeholder {
        text-align: center;
        color: #aaa;
      }
    `,
  ],
})
export class MicroVisualsComponent implements OnChanges {
  @Input() expenses: Expense[] = [];
  @Input() topN: number = 5;
  @Input() selectedCategories: string[] = [];
  // Full selected date frame (optional) to render continuous trend over entire range, even if category sparse
  @Input() dateFrame?: DateFrame;
  @Output() categorySelected = new EventEmitter<string>();
  @Output() categoryRemoved = new EventEmitter<string>();
  // Maximum horizontal units (virtual width) used for sparkline; longer series are compressed proportionally
  private readonly maxSparkSpan = 40; // adjust if you prefer denser or more compressed lines

  stats: CategoryStat[] = [];
  // Exposed to template for active coverage calculations
  dateKeys: string[] = [];
  private lastExpensesRef: Expense[] | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expenses']) {
      // Skip recompute if same reference and length unchanged (basic shallow guard)
      if (this.lastExpensesRef === this.expenses && this.stats.length) {
        return;
      }
      this.lastExpensesRef = this.expenses;
      this.recompute();
    }
  }

  private recompute(): void {
    if (!this.expenses || this.expenses.length === 0) {
      this.stats = [];
      return;
    }
    // Build ordered date keys. Prefer provided dateFrame to ensure consistent horizontal scale.
    if (this.dateFrame) {
      const start = this.dateFrame.start.startOf('day');
      const finish = this.dateFrame.finish.startOf('day');
      const keys: string[] = [];
      for (let d = start; d <= finish; d = d.plus({ days: 1 })) {
        keys.push(
          `${d.year}-${d.month.toString().padStart(2, '0')}-${d.day.toString().padStart(2, '0')}`
        );
      }
      this.dateKeys = keys;
    } else {
      // Fallback: contiguous span from min to max expense date
      let minDate = new Date(this.expenses[0].date);
      let maxDate = new Date(this.expenses[0].date);
      for (const e of this.expenses) {
        const d = new Date(e.date);
        if (d < minDate) minDate = d;
        if (d > maxDate) maxDate = d;
      }
      minDate = new Date(
        minDate.getFullYear(),
        minDate.getMonth(),
        minDate.getDate()
      );
      maxDate = new Date(
        maxDate.getFullYear(),
        maxDate.getMonth(),
        maxDate.getDate()
      );
      const dateKeys: string[] = [];
      for (
        let dt = new Date(minDate);
        dt <= maxDate;
        dt.setDate(dt.getDate() + 1)
      ) {
        const key = `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt.getDate().toString().padStart(2, '0')}`;
        dateKeys.push(key);
      }
      this.dateKeys = dateKeys;
    }
    const catMap = new Map<string, number[]>(); // category -> series aligned with dateKeys
    const totals = new Map<string, number>();
    const entryCounts = new Map<string, number>();
    const indexMap: Record<string, number> = {};
    this.dateKeys.forEach((k, i) => (indexMap[k] = i));
    this.expenses.forEach(e => {
      if (e.amount === 0) return; // mirror logic from multi-chart for non-zero only
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
      const idx = indexMap[key];
      if (idx === undefined) return;
      if (!catMap.has(e.category)) {
        catMap.set(e.category, new Array(this.dateKeys.length).fill(0));
        entryCounts.set(e.category, 0);
      }
      const series = catMap.get(e.category)!;
      series[idx] = +(series[idx] + e.amount).toFixed(2);
      totals.set(e.category, (totals.get(e.category) || 0) + e.amount);
      entryCounts.set(e.category, (entryCounts.get(e.category) || 0) + 1);
    });
    const grandTotal =
      Array.from(totals.values()).reduce((s, v) => s + v, 0) || 1;
    const stats: CategoryStat[] = Array.from(catMap.entries()).map(
      ([id, series]) => {
        const name = getCategoryNameById(id);
        const total = +series.reduce((s, v) => s + v, 0).toFixed(2);
        const percent = +((total / grandTotal) * 100).toFixed(2); // retained if needed later
        const max = Math.max(...series, 0);
        const activeCount = series.reduce((c, v) => c + (v > 0 ? 1 : 0), 0);
        const entryCount = entryCounts.get(id) || 0;
        const trendDelta = activeCount; // keep current meaning similar to before conceptually
        return { id, name, total, percent, series, max, trendDelta, activeCount, entryCount };
      }
    );
    this.stats = stats;
    this.applySort();
  }

  getSparkWidth(len: number): number {
    if (len <= 1) return 0;
    return Math.min(len - 1, this.maxSparkSpan);
  }

  buildSparkPoints(s: CategoryStat): string {
    const len = s.series.length;
    if (len <= 1) return '';
    const max = s.max || 1;
    const width = this.getSparkWidth(len);
    const denom = len - 1 || 1;
    const points: string[] = new Array(len);
    for (let i = 0; i < len; i++) {
      const v = s.series[i];
      const x = (i / denom) * width;
      const y = 18 - (v / max) * 16; // padding top 2px bottom 2px (height 20)
      points[i] = `${x.toFixed(2)},${y.toFixed(2)}`;
    }
    return points.join(' ');
  }

  trackByStat(index: number, item: CategoryStat) {
    return item.id;
  }

  selectCategory(id: string) {
    this.categorySelected.emit(id);
  }

  onRemoveCategory(id: string, event: MouseEvent) {
    event.stopPropagation();
    this.categoryRemoved.emit(id);
  }

  // Sorting logic
  sortKey: 'percent' | 'trendDelta' | 'total' | 'activeCount' = 'total';
  sortDir: 1 | -1 = -1; // default desc for total

  toggleSort(key: 'percent' | 'trendDelta' | 'total' | 'activeCount') {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 1 ? -1 : 1;
    } else {
      this.sortKey = key;
      this.sortDir = -1;
    }
    this.applySort();
  }

  private applySort() {
    if (!this.stats || this.stats.length === 0) return;
    const key = this.sortKey;
    const dir = this.sortDir;
    this.stats.sort((a: any, b: any) => {
      const av = a[key];
      const bv = b[key];
      if (av === bv) return 0;
      return av > bv ? dir : -dir;
    });
  }
}
