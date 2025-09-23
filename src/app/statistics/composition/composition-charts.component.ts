import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  ElementRef,
  HostListener,
} from '@angular/core';
import * as echarts from 'echarts';
import { Expense } from '../../common/model/expense.model';
import { CategoryAnalyticsService } from '../functions/category-analytics.service';

@Component({
  selector: 'app-composition-charts',
  template: `
    <div class="composition-grid">
      <div class="chart-wrapper">
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

  /** External trigger to fix layout when parent visibility toggles */
  refreshLayout(): void {
    if (this.treemapChart) {
      this.treemapChart.resize();
    }
  }

  @HostListener('window:resize') onResize() {
    this.refreshLayout();
  }
}
