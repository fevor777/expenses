import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts';
import { Expense } from '../../common/model/expense.model';
import {
  SegmentedSwitchComponent,
  SegmentedOption,
} from '../../common/component/segmented/segmented-switch.component';
import { CompositionChartsComponent } from '../composition/composition-charts.component';
import { CategoryAnalyticsService } from '../functions/category-analytics.service';

/**
 * AnalyticsSwitchComponent
 * Combines a donut (pie) chart and the existing composition charts into a single
 * switchable UI controlled by <app-segmented-switch>. The donut chart replicates
 * the logic from StatisticsComponent (category totals) but receives already-filtered
 * expenses through @Input().
 */
@Component({
  selector: 'app-analytics-switch',
  standalone: true,
  imports: [CommonModule, SegmentedSwitchComponent, CompositionChartsComponent],
  template: `
    <div class="analytics-switch">
      <app-segmented-switch
        class="analytics-switch__segmented"
        [options]="segmentOptions"
        [active]="activeView"
        ariaLabel="Переключение аналитических графиков"
        (select)="onSegmentSelect($event)"
      ></app-segmented-switch>

      <div class="analytics-switch__panel" [hidden]="activeView !== 'donut'">
        <div
          class="analytics-switch__chart"
          #donutContainer
          aria-label="Кольцевая диаграмма категорий"
        ></div>
      </div>

      <div
        class="analytics-switch__panel"
        [hidden]="activeView !== 'composition'"
      >
        <app-composition-charts [expenses]="expenses"></app-composition-charts>
      </div>
    </div>
  `,
  styles: [
    `
      .analytics-switch {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .analytics-switch__segmented {
        align-self: center;
      }
      .analytics-switch__chart {
        width: 100%;
        height: 220px;
      }
      :where(.dark, [data-theme='dark']) .analytics-switch__panel {
        background: var(--color-bg-alt);
        border-color: var(--color-border);
      }
    `,
  ],
})
export class AnalyticsSwitchComponent
  implements OnChanges, AfterViewInit, OnDestroy
{
  /** Filtered expenses to visualize */
  @Input() expenses: Expense[] = [];
  @ViewChild('donutContainer') donutContainer?: ElementRef<HTMLDivElement>;
  @ViewChild(CompositionChartsComponent)
  compositionCmp?: CompositionChartsComponent;

  activeView: 'donut' | 'composition' = 'donut';
  segmentOptions: SegmentedOption[] = [
    { value: 'donut', label: 'Донат' },
    { value: 'composition', label: 'Состав' },
  ];

  private donutChart: echarts.ECharts | null = null;

  constructor(private analytics: CategoryAnalyticsService) {}

  onSegmentSelect(v: string) {
    if (v === 'donut' || v === 'composition') {
      this.activeView = v;
      if (v === 'donut') {
        // Container persisted; ensure chart exists & refresh AFTER it becomes visible
        requestAnimationFrame(() => {
          this.ensureChartAndRender();
          // Second frame to guarantee layout settled before final resize & rerender
          requestAnimationFrame(() => {
            this.donutChart?.resize();
            // Re-render after resize to recompute center text positioning
            this.renderDonut();
          });
        });
      } else if (v === 'composition') {
        // Ensure treemap resizes after becoming visible
        requestAnimationFrame(() => {
          this.compositionCmp?.refreshLayout();
          requestAnimationFrame(() => this.compositionCmp?.refreshLayout());
        });
      }
    }
  }
  ngAfterViewInit(): void {
    if (this.activeView === 'donut') {
      this.ensureChartAndRender();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expenses'] && !changes['expenses'].firstChange) {
      if (this.activeView === 'donut') this.renderDonut();
    }
  }

  ngOnDestroy(): void {
    if (this.donutChart) {
      this.donutChart.dispose();
      this.donutChart = null;
    }
  }

  @HostListener('window:resize') onResize() {
    this.donutChart?.resize();
  }

  private ensureChartAndRender(): void {
    if (!this.donutChart && this.donutContainer?.nativeElement) {
      this.donutChart = echarts.init(this.donutContainer.nativeElement);
    }
    this.renderDonut();
  }

  private renderDonut(): void {
    if (!this.donutChart) return;
    let aggs = this.analytics.buildAggregates(this.expenses || []);
    // Sort by total descending (same ordering as original statistics page donut)
    aggs = aggs.sort((a, b) => b.total - a.total);
    const total = aggs.reduce((s, a) => s + a.total, 0);
    this.donutChart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c}€ ({d}%)' },
      series: [
        {
          type: 'pie',
          name: 'Категория',
          radius: ['50%', '70%'],
          avoidLabelOverlap: true,
          label: { show: true, position: 'outside', formatter: '{b}' },
          labelLine: { show: true },
          data: aggs.map(a => ({ value: a.total, name: a.name })),
        },
      ],
      graphic: {
        type: 'text',
        left: 'center',
        top: 'center',
        style: {
          text: total ? total.toLocaleString() + '€' : '0€',
          textAlign: 'center',
          fill: '#000',
          fontSize: 18,
          fontWeight: 'bold',
        },
      },
    });
  }
}
