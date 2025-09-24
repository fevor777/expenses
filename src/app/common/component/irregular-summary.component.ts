import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { Expense } from '../../common/model/expense.model';
import { ExpenseService } from '../../common/service/expense.service';
import { DateFilterService } from './filter/date/date-filter.service';
import { IrregularBudgetService } from '../../common/service/irregular-budget.service';
import { IrregularBudgetGaugeComponent } from '../../details/irregular/irregular-budget-gauge.component';
import { IrregularCumulativeComponent } from '../../details/irregular/irregular-cumulative.component';
import { DateFrame } from './filter/date/dateFrame.model';

// This component combines gauge and cumulative irregular charts.
// It is responsible for loading current month expenses and irregular budget itself – no inputs required.
@Component({
  selector: 'app-irregular-summary',
  standalone: true,
  imports: [CommonModule, IrregularBudgetGaugeComponent, IrregularCumulativeComponent],
  template: `
    <div class="irregular-summary" *ngIf="loaded; else loadingTpl">
      <div class="irregular-block">
        <div class="ib-chart">
          <app-irregular-budget-gauge
            [expenses]="expenses"
            [budget]="budget"
          ></app-irregular-budget-gauge>
        </div>
        <div class="ib-chart wide">
          <app-irregular-cumulative
            [expenses]="expenses"
            [budget]="budget"
            [date]="monthFrame"
          ></app-irregular-cumulative>
        </div>
      </div>
    </div>
    <ng-template #loadingTpl>
      <div class="placeholder-msg small">Loading irregular data...</div>
    </ng-template>
  `,
  styles: [
    `
      .irregular-summary {
        width: 100%;
      }
      .irregular-block {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: flex-start;
        justify-content: center; /* center children horizontally */
        text-align: center;
      }
      .ib-chart { flex: 0 0 auto; margin: 0 auto; }
      .ib-chart.wide { flex: 1 1 260px; }
      .placeholder-msg.small { font-size: 12px; color: #777; }
    `,
  ],
})
export class IrregularSummaryComponent implements OnInit, OnDestroy {
  expenses: Expense[] = [];
  budget = 0;
  monthFrame: DateFrame;
  loaded = false;
  private destroy$ = new Subject<void>();

  constructor(
    private expenseService: ExpenseService,
    private dateFilterService: DateFilterService,
    private irregularBudgetService: IrregularBudgetService
  ) {}

  ngOnInit(): void {
    this.monthFrame = this.dateFilterService.getInitialMonthValue();
    // Load month expenses (no category/description filters) and budget.
    const expenses$ = this.expenseService.getExpenses(this.monthFrame, [], '');
    const budget$ = this.irregularBudgetService.getValue();
    combineLatest([expenses$, budget$])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([expenses, budget]) => {
          this.expenses = expenses || [];
          this.budget = budget || 0;
          this.loaded = true;
        },
        error: () => (this.loaded = true),
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
