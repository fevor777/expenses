import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { first, map, shareReplay, switchMap } from 'rxjs/operators';

import { ExpenseService } from './expense.service';
import { DateFilterService } from '../component/filter/date/date-filter.service';
import { IrregularBudgetService } from './irregular-budget.service';
import { Expense } from '../model/expense.model';
import { DateFrame } from '../component/filter/date/dateFrame.model';
import { BalanceDateService } from './balance-date.service';
import { DateTime } from 'luxon';

/**
 * Minimal service requested: only provide (expenses for a period, budget value, date frame).
 * All higher‑level / derived metrics are intentionally excluded to keep this focused.
 */
export interface BudgetPeriodData {
  dateFrame: DateFrame; // always the current month frame resolved internally
  expenses: Expense[]; // raw expenses within the month
  budget: number; // current irregular budget value
}

@Injectable({ providedIn: 'root' })
export class BudgetDataService {
  constructor(
    private expenseService: ExpenseService,
    private dateFilterService: DateFilterService,
    private irregularBudgetService: IrregularBudgetService,
    private balanceDateService: BalanceDateService
  ) {}

  /**
   * Returns expenses + budget for the current month (date frame resolved internally).
   * The method intentionally has no parameters to keep usage simple and consistent.
   * Cached with shareReplay to avoid duplicate upstream subscriptions in views.
   */
  getExpensesWithBudget(): Observable<BudgetPeriodData> {
    // Resolve rolling frame based on stored balance date day (1-31). If not set or invalid, fallback to calendar month.
    return this.balanceDateService.getBalanceDate().pipe(
      first(),
      switchMap(value => {
        const frame = this.buildRollingFrame(value);
        return combineLatest([
          this.expenseService.getExpenses(frame),
          this.irregularBudgetService.getValue(),
          of(frame)
        ]);
      }),
      first(),
      map(
        ([expenses, budget, frame]): BudgetPeriodData => ({
          dateFrame: frame,
          expenses,
          budget: budget || 0,
        })
      ),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  /**
   * Build a rolling DateFrame where the start day within a month is user-defined (balance date value),
   * and the end is the day before the next period start. Example: value '8' => 8 Sep .. 7 Oct (inclusive).
   * Fallback: If value empty/invalid => default calendar month frame from DateFilterService.
   */
  private buildRollingFrame(
    balanceDayValue: string | undefined | null
  ): DateFrame {
    const dayNum = Number(balanceDayValue);
    if (!dayNum || isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
      return this.dateFilterService.getInitialMonthValue();
    }

    const now = DateTime.now();
    // Determine current rolling period start relative to today.
    // Strategy: Construct potential start this month at dayNum; if in future (today before dayNum),
    // start is previous month dayNum.
    let start = DateTime.local(
      now.year,
      now.month,
      Math.min(dayNum, now.daysInMonth)
    );
    if (now < start) {
      const prev = now.minus({ months: 1 });
      start = DateTime.local(
        prev.year,
        prev.month,
        Math.min(dayNum, prev.daysInMonth)
      );
    }
    // End is (next period start) - 1 millisecond (use end of previous day before next start) for inclusivity.
    const nextMonth = start.plus({ months: 1 });
    const nextStart = DateTime.local(
      nextMonth.year,
      nextMonth.month,
      Math.min(dayNum, nextMonth.daysInMonth)
    );
    const finish = nextStart.minus({ milliseconds: 1 });

    return {
      start,
      finish,
      mode: undefined, // keep undefined; consumers treat as custom month-like period
      display: `${start.toFormat('d LLL')} – ${finish.toFormat('d LLL')}`,
    };
  }
}
