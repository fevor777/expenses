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
import { Budget } from '../model/budget.model';

/**
 * Minimal service requested: only provide (expenses for a period, budget value, date frame).
 * All higher‑level / derived metrics are intentionally excluded to keep this focused.
 */
export interface BudgetPeriodData {
  dateFrame: DateFrame; // always the current month frame resolved internally
  expenses: Expense[]; // raw expenses within the month
  budget: Budget; // current irregular budget value
}

@Injectable({ providedIn: 'root' })
export class BudgetDataService {
  constructor(
    private expenseService: ExpenseService,
    private dateFilterService: DateFilterService,
    private irregularBudgetService: IrregularBudgetService
  ) {}

  /**
   * Returns expenses + budget for the current month (date frame resolved internally).
   * The method intentionally has no parameters to keep usage simple and consistent.
   * Cached with shareReplay to avoid duplicate upstream subscriptions in views.
   */
  getExpensesWithBudget(): Observable<BudgetPeriodData> {
    // Resolve rolling frame based on stored balance date day (1-31). If not set or invalid, fallback to calendar month.
    return this.irregularBudgetService.getValue().pipe(
      first(),
      switchMap(budget => {
        const frame = this.buildRollingFrame(budget);
        return combineLatest([
          this.expenseService.getExpenses(frame),
          of(budget),
          of(frame),
        ]);
      }),
      first(),
      map(
        ([expenses, budget, frame]): BudgetPeriodData => ({
          dateFrame: frame,
          expenses,
          budget: budget || { uid: '', value: 600, period: 30, periodStart: 3 },
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
  private buildRollingFrame(budget: Budget): DateFrame {
    const dayNum = budget.periodStart; // nominal anchor day inside each period
    const periodDays = budget.period && budget.period > 0 ? Math.floor(budget.period) : 30;
    const now = DateTime.now();

    // 1. Establish a candidate start anchored to the most recent occurrence of 'dayNum'.
    // If periodStart invalid, fall back to today - (periodDays-1) days.
    let start: DateTime;
    if (!dayNum || isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
      start = now.minus({ days: periodDays - 1 });
    } else {
      // Try to anchor within current month first.
      let candidate = DateTime.local(
        now.year,
        now.month,
        Math.min(dayNum, now.daysInMonth)
      );
      if (candidate > now) {
        // Use previous month anchor
        const prev = now.minus({ months: 1 });
        candidate = DateTime.local(
          prev.year,
          prev.month,
          Math.min(dayNum, prev.daysInMonth)
        );
      }
      // If the span from candidate to now exceeds period length, slide forward in period-size steps.
      let diffDays = Math.floor(now.diff(candidate, 'days').days);
      if (diffDays >= periodDays) {
        const periodsToAdvance = Math.floor(diffDays / periodDays);
        candidate = candidate.plus({ days: periodsToAdvance * periodDays });
        diffDays = Math.floor(now.diff(candidate, 'days').days);
      }
      start = candidate;
    }

    // 2. Finish is start + periodDays - 1 millisecond (end-of-day of the last day).
    const finishDay = start.plus({ days: periodDays - 1 });
    const finish = DateTime.local(
      finishDay.year,
      finishDay.month,
      finishDay.day,
      23,
      59,
      59,
      999
    );

    // 3. Ensure now is inside [start, finish]. If start drifted too far (rare edge), rebase start.
    if (now < start || now > finish) {
      start = now.minus({ days: periodDays - 1 }).startOf('day');
    }

    const finalFinish = start
      .plus({ days: periodDays - 1 })
      .set({ hour: 23, minute: 59, second: 59, millisecond: 999 });

    return {
      start,
      finish: finalFinish,
      mode: undefined,
      display: `${start.toFormat('d LLL')} – ${finalFinish.toFormat('d LLL')} (${periodDays}д)`,
    };
  }
}
