import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Expense } from '../../common/model/expense.model';
import { getCategoryNameById } from '../../common/model/categories';

interface CategoryStat {
    id: string;
    name: string;
    total: number;
    percent: number;
    series: number[]; // daily totals over ordered dateKeys
    max: number; // max value in series
}

@Component({
    selector: 'app-micro-visuals',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="micro-wrapper" *ngIf="stats.length; else noDataTpl">
      <div class="micro-header">
        <div class="micro-title">Микро визуализация</div>
        <div class="micro-subtitle">Спарклайны и доля категорий (Top {{topN}} vs Other)</div>
      </div>
      <div class="topn-bar" *ngIf="topOtherTotal > 0">
        <div class="topn-labels">
          <span>Top {{topN}}: {{ topTotal | number:'1.2-2' }}€</span>
          <span>Other: {{ otherTotal | number:'1.2-2' }}€</span>
        </div>
        <div class="topn-bar-track">
          <div class="topn-seg top" [style.width.%]="(topTotal / topOtherTotal) * 100"></div>
          <div class="topn-seg other" [style.width.%]="(otherTotal / topOtherTotal) * 100"></div>
        </div>
      </div>
      <table class="micro-table">
        <thead>
          <tr>
            <th>Категория</th>
            <th class="share-col">Доля</th>
            <th class="trend-col">Тренд</th>
            <th class="sum-col">Сумма</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let s of stats">
            <td class="cat-cell">{{ s.name }}</td>
            <td class="share-col">
              <div class="lollipop-track">
                <div class="lollipop-fill" [style.width.%]="s.percent"></div>
                <div class="lollipop-dot" [style.left.%]="s.percent"></div>
              </div>
            </td>
            <td class="trend-col">
              <svg *ngIf="s.series.length > 1" class="spark" preserveAspectRatio="none" [attr.viewBox]="'0 0 ' + getSparkWidth(s.series.length) + ' 20'">
                <polyline [attr.points]="buildSparkPoints(s)" fill="none" stroke="#3366cc" stroke-width="0.5" />
              </svg>
              <div *ngIf="s.series.length <= 1" class="spark-placeholder">•</div>
            </td>
            <td class="sum-col" style="text-align:right">{{ s.total | number:'1.2-2' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <ng-template #noDataTpl>
      <div class="micro-empty">Нет данных</div>
    </ng-template>
  `,
    styles: [`
    .micro-wrapper { margin-top:20px; }
    .micro-header { margin:0 2px 8px 2px; }
    .micro-title { font-weight:600; font-size:14px; }
    .micro-subtitle { font-size:11px; color:#666; }
    .micro-empty { font-size:13px; color:#777; margin:8px; }
    .micro-table { width:100%; border-collapse:collapse; font-size:11px; table-layout:fixed; }
    .micro-table th { text-align:left; font-weight:600; font-size:11px; padding:4px 2px; border-bottom:1px solid #eee; }
    .micro-table td { padding:3px 2px; vertical-align:middle; border-bottom:1px solid #f5f5f5; }
    .cat-cell { white-space:nowrap; }
  .share-col { width:70px; }
  .trend-col { width:120px; }
    .sum-col { width:60px; text-align:right; }
  .lollipop-track { position:relative; width:100%; height:8px; background:#f0f0f0; border-radius:4px; }
  .lollipop-fill { position:absolute; left:0; top:0; bottom:0; background:#8ab4f8; border-radius:4px 0 0 4px; }
  .lollipop-dot { position:absolute; top:50%; width:8px; height:8px; margin-top:-4px; margin-left:-4px; background:#1a73e8; border:1px solid #fff; border-radius:50%; box-shadow:0 0 2px rgba(0,0,0,0.4); }
    .spark { width:100%; height:20px; }
    .spark-placeholder { text-align:center; color:#aaa; }
    .topn-bar { margin:4px 0 12px 0; }
    .topn-labels { display:flex; justify-content:space-between; font-size:10px; margin-bottom:2px; }
    .topn-bar-track { position:relative; width:100%; height:12px; background:#f0f0f0; border-radius:6px; overflow:hidden; }
    .topn-seg { height:100%; float:left; }
    .topn-seg.top { background:#4caf50; }
    .topn-seg.other { background:#ff9800; }
  `]
})
export class MicroVisualsComponent implements OnChanges {
    @Input() expenses: Expense[] = [];
    @Input() topN: number = 5;
    // Maximum horizontal units (virtual width) used for sparkline; longer series are compressed proportionally
    private readonly maxSparkSpan = 40; // adjust if you prefer denser or more compressed lines

    stats: CategoryStat[] = [];
    topTotal = 0;
    otherTotal = 0;
    topOtherTotal = 0;
    private dateKeys: string[] = [];
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['expenses']) {
            this.recompute();
        }
    }

    private recompute(): void {
        if (!this.expenses || this.expenses.length === 0) {
            this.stats = [];
            this.topTotal = this.otherTotal = this.topOtherTotal = 0;
            return;
        }
        // Build ordered date keys (YYYY-MM-DD) for the provided expenses
        const dateSet = new Set<string>();
        this.expenses.forEach(e => {
            const d = new Date(e.date);
            dateSet.add(`${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`);
        });
        this.dateKeys = Array.from(dateSet).sort();
        const catMap = new Map<string, number[]>(); // category -> series aligned with dateKeys
        const totals = new Map<string, number>();
        this.dateKeys.forEach(_ => { /* placeholder to guarantee index */ });
        this.expenses.forEach(e => {
            const d = new Date(e.date);
            const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
            const idx = this.dateKeys.indexOf(key); // small sets; acceptable; else build index map
            if (idx === -1) return;
            if (!catMap.has(e.category)) catMap.set(e.category, new Array(this.dateKeys.length).fill(0));
            const series = catMap.get(e.category)!;
            series[idx] = +(series[idx] + e.amount).toFixed(2);
            totals.set(e.category, (totals.get(e.category) || 0) + e.amount);
        });
        const grandTotal = Array.from(totals.values()).reduce((s, v) => s + v, 0) || 1;
        const stats: CategoryStat[] = Array.from(catMap.entries()).map(([id, series]) => {
            const name = getCategoryNameById(id);
            const total = +(series.reduce((s, v) => s + v, 0).toFixed(2));
            const percent = +((total / grandTotal) * 100).toFixed(2);
            const max = Math.max(...series, 0);
            return { id, name, total, percent, series, max };
        });
        stats.sort((a, b) => b.total - a.total);
        this.stats = stats;
        // Top N vs other
        const top = stats.slice(0, this.topN);
        this.topTotal = top.reduce((s, v) => s + v.total, 0);
        this.otherTotal = stats.slice(this.topN).reduce((s, v) => s + v.total, 0);
        this.topOtherTotal = this.topTotal + this.otherTotal;
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
        const denom = (len - 1) || 1;
        return s.series.map((v, i) => {
            const x = (i / denom) * width;
            const y = 18 - (v / max) * 16; // padding top 2px bottom 2px (height 20)
            return `${x.toFixed(2)},${y.toFixed(2)}`;
        }).join(' ');
    }
}
