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
    { value: 'donut', label: 'Кольцевая', iconClass: 'fa-solid fa-circle-notch', ariaLabel: 'Кольцевая диаграмма' },
    { value: 'composition', label: 'Состав', iconClass: 'fa-solid fa-layer-group', ariaLabel: 'Состав категорий' },
  ];

  private donutChart: echarts.ECharts | null = null;
  private resizeObserver?: ResizeObserver;
  private isInitialized = false;

  constructor(private analytics: CategoryAnalyticsService) {}

  onSegmentSelect(v: string) {
    if (v === 'donut' || v === 'composition') {
      this.activeView = v;
      if (v === 'donut') {
        // Try to initialize if not done yet, or refresh if already initialized
        if (!this.isInitialized) {
          this.ensureChartAndRender();
        } else if (this.donutChart) {
          requestAnimationFrame(() => {
            this.donutChart?.resize();
            requestAnimationFrame(() => this.renderDonut());
          });
        }
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
    this.setupResizeObserver();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expenses'] && !changes['expenses'].firstChange) {
      if (this.activeView === 'donut' && this.isInitialized && this.donutChart) {
        this.renderDonut();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.donutChart) {
      this.donutChart.dispose();
      this.donutChart = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  @HostListener('window:resize') onResize() {
    this.donutChart?.resize();
  }

  private ensureChartAndRender(): void {
    if (!this.donutContainer?.nativeElement) return;
    
    const container = this.donutContainer.nativeElement;
    const rect = container.getBoundingClientRect();
    
    // Only initialize if container has actual dimensions
    if (rect.width > 0 && rect.height > 0) {
      if (!this.donutChart) {
        this.donutChart = echarts.init(container);
        this.isInitialized = true;
      }
      this.renderDonut();
    }
  }

  private setupResizeObserver(): void {
    if (!this.donutContainer?.nativeElement) return;
    
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0 && this.activeView === 'donut') {
          if (!this.isInitialized) {
            this.ensureChartAndRender();
          } else if (this.donutChart) {
            this.donutChart.resize();
          }
        }
      }
    });
    
    this.resizeObserver.observe(this.donutContainer.nativeElement);
  }

  /** Public API for external refresh when panel becomes visible */
  public forceRefresh(): void {
    if (this.activeView === 'donut') {
      if (!this.isInitialized) {
        this.ensureChartAndRender();
      } else if (this.donutChart) {
        requestAnimationFrame(() => {
          this.donutChart?.resize();
          requestAnimationFrame(() => this.renderDonut());
        });
      }
    }
  }

  private renderDonut(): void {
    if (!this.donutChart) return;
    let aggs = this.analytics.buildAggregates(this.expenses || []);
    // Sort by total descending (same ordering as original statistics page donut)
    aggs = aggs.sort((a, b) => b.total - a.total);
    const total = aggs.reduce((s, a) => s + a.total, 0);
    // Soft pastel palette (light mode). These intentionally keep saturation low.
    const softPaletteLight = [
      '#b3cde0','#ccebc5','#decbe4','#fed9a6','#ffe9af',
      '#fbb4ae','#e1d5e7','#cbd5e1','#d7e3fc','#f2c6de'
    ];
    // Dark mode variants (slightly deeper tones for contrast)
    const softPaletteDark = [
      '#5b7080','#4f6b5a','#5d4f67','#7a6040','#7a6a3f',
      '#784f4b','#5a5364','#4a5864','#4b5b7a','#6a4c5a'
    ];
    const isDark = document.documentElement.classList.contains('dark') || document.documentElement.getAttribute('data-theme') === 'dark';
    const palette = isDark ? softPaletteDark : softPaletteLight;
    // Map each aggregate to a color (fallback to category-defined color if available and looks soft enough)
    const colorizedData = aggs.map((a, idx) => {
      let color = palette[idx % palette.length];
      if (a.color) {
        // If provided color is already light/pastel (high L in HSL), allow it
        try {
          const test = a.color.trim();
          if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(test)) {
            // simple luminance check
            const hex = test.length === 4 ? '#' + test[1]+test[1]+test[2]+test[2]+test[3]+test[3] : test;
            const r = parseInt(hex.substring(1,3),16);
            const g = parseInt(hex.substring(3,5),16);
            const b = parseInt(hex.substring(5,7),16);
            const lum = (0.299*r + 0.587*g + 0.114*b)/255;
            if (lum > 0.6) color = test; // keep light category color
          } else if (test.startsWith('rgb')) {
            // crude parse
            const nums = test.match(/\d+/g)?.map(n=>+n) || [];
            if (nums.length >=3) {
              const lum = (0.299*nums[0] + 0.587*nums[1] + 0.114*nums[2]) / 255;
              if (lum > 0.6) color = test;
            }
          }
        } catch {}
      }
      return { value: a.total, name: a.name, itemStyle: { color } };
    });
    this.donutChart.setOption({
      // Enable faster, snappier animations (defaults are ~1000ms; we reduce to 300ms)
      animation: false,
      animationDuration: 1500,
      animationDurationUpdate: 1000,
      animationEasing: 'cubicOut',
      animationEasingUpdate: 'cubicOut',
      tooltip: { trigger: 'item', formatter: '{b}: {c}€ ({d}%)' },
      series: [
        {
          type: 'pie',
          name: 'Категория',
          radius: ['50%', '70%'],
          avoidLabelOverlap: true,
          // Series-specific animation overrides (keep consistent fast durations)
          animation: false,
          animationDuration: 1500,
          animationDurationUpdate: 1000,
          hoverAnimation: false, // keep subtle hover feedback
          label: { show: true, position: 'outside', formatter: '{b}' },
          labelLine: { show: true },
          data: colorizedData,
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
