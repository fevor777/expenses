import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import * as echarts from 'echarts';
import { Expense } from '../../common/model/expense.model';
import { CategoryAnalyticsService } from '../functions/category-analytics.service';

@Component({
  selector: 'app-composition-charts',
  template: `
    <div class="composition-grid">
      <div class="chart-wrapper">
        <div class="chart-title">Дерево категорий</div>
        <div
          class="chart"
          #treemapContainer
          aria-label="Treemap категорий"
        ></div>
      </div>
    </div>
  `,
  styles: [
    `
      .composition-grid {
        display: block;
      }
      .chart-wrapper {
        background: #fff;
        border: 1px solid #eee;
        border-radius: 6px;
        padding: 4px 6px 8px 6px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      }
      .chart-title {
        font-size: 12px;
        font-weight: 600;
        margin: 2px 0 4px 2px;
        color: #555;
      }
      .chart {
        width: 100%;
        height: 230px;
      }
    `,
  ],
  standalone: true,
})
export class CompositionChartsComponent implements OnChanges, AfterViewInit {
  @Input() expenses: Expense[] = [];

  private treemapChart: echarts.ECharts | null = null;

  constructor(
    private el: ElementRef,
    private analytics: CategoryAnalyticsService
  ) {}

  ngAfterViewInit(): void {
    this.initCharts();
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expenses'] && !changes['expenses'].firstChange) {
      this.render();
    }
  }

  private initCharts(): void {
    const divs = this.el.nativeElement.querySelectorAll('.chart');
    this.treemapChart = echarts.init(divs[0]);
  }

  private render(): void {
    if (!this.treemapChart) return;
    const aggs = this.analytics.buildAggregates(this.expenses);

    // Treemap
    this.treemapChart.setOption({
      tooltip: { formatter: p => `${p.name}: ${p.value}€` },
      series: [
        {
          type: 'treemap',
          roam: false,
          nodeClick: false,
          breadcrumb: { show: false },
          label: { show: true, formatter: (p: any) => p.name },
          data: aggs.map(a => ({ name: a.name, value: a.total })),
        },
      ],
    });
  }
}
