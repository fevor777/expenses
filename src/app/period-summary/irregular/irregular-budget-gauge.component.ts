import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Expense } from '../../common/model/expense.model';
import { getIncudedInBudgetExpenses } from './irregular-charts.utils';

@Component({
  selector: 'app-irregular-budget-gauge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ib-gauge" *ngIf="budget > 0; else noBudget">
      <svg viewBox="0 0 42 42" class="dial">
        <circle class="bg" cx="21" cy="21" r="15.915" />
        <circle
          class="fg"
          cx="21"
          cy="21"
          r="15.915"
          [attr.stroke-dasharray]="dashArray"
        />
        <text x="21" y="19" text-anchor="middle" class="pct">
          {{ percent | number: '1.0-0' }}%
        </text>
        <text x="21" y="26" text-anchor="middle" class="sub">
          {{ spent | number: '1.0-0' }} / {{ budget | number: '1.0-0' }}
        </text>
      </svg>
    </div>
    <ng-template #noBudget
      ><div class="no">Set irregular budget</div></ng-template
    >
  `,
  styles: [
    `
      .ib-gauge {
        width: 140px;
        height: 140px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .dial {
        width: 140px;
        height: 140px;
      }
      .bg {
        fill: none;
        stroke: #e4e4e4;
        stroke-width: 3;
      }
      .fg {
        fill: none;
        stroke: #870024;
        stroke-width: 3;
        stroke-linecap: round;
        transform: rotate(-90deg);
        transform-origin: 50% 50%;
        transition: stroke-dasharray 0.4s;
      }
      .pct {
        font-size: 8px;
        font-weight: 600;
        fill: #333;
      }
      .sub {
        font-size: 4px;
        fill: #555;
      }
      .no {
        font-size: 12px;
        color: #999;
      }
    `,
  ],
})
export class IrregularBudgetGaugeComponent implements OnChanges {
  @Input() expenses: Expense[] = [];
  @Input() budget = 0;
  spent = 0;
  percent = 0;
  dashArray = '0 100';
  ngOnChanges() {
    const irr = getIncudedInBudgetExpenses(this.expenses);
    this.spent = irr.reduce((s, e) => s + (e.amount || 0), 0);
    this.percent =
      this.budget > 0 ? Math.min(100, (this.spent / this.budget) * 100) : 0;
    this.dashArray = this.percent + ' ' + (100 - this.percent);
  }
}
