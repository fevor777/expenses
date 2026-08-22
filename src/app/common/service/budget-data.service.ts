import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { first, map, shareReplay, switchMap, tap } from 'rxjs/operators';

import { ExpenseService } from './expense.service';
import { IrregularBudgetService } from './irregular-budget.service';
import { Expense } from '../model/expense.model';
import { DateFrame, Mode } from '../component/filter/date/dateFrame.model';
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
          this.expenseService.getExpenses(frame, undefined, undefined, false),
          of(budget),
          of(frame),
        ]);
      }),
      first(),
      map(
        ([expenses, budget, frame]): BudgetPeriodData => ({
          dateFrame: frame,
          expenses,
          budget: budget || { uid: '', value: 600, period: 30 },
        })
      ),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  getCurrentBudgetFilterFrame(): Observable<DateFrame> {
    return this.irregularBudgetService.getValue().pipe(
      first(),
      map(budget => this.toBudgetFilterFrame(this.buildRollingFrame(budget)))
    );
  }

  /**
   * Build a rolling DateFrame where the start day within a month is user-defined (balance date value),
   * and the end is the day before the next period start. Example: value '8' => 8 Sep .. 7 Oct (inclusive).
   * Fallback: If value empty/invalid => default calendar month frame from DateFilterService.
   */
  private buildRollingFrame(budget: Budget): DateFrame {
    const periodDays =
      budget.period && budget.period > 0 ? Math.floor(budget.period) : 30;
    const now = DateTime.now();
    // If we have a timestamp anchor, use it EXACTLY as frame start (no shifting to contain 'now').
    if (budget.periodStartTs && !isNaN(budget.periodStartTs)) {
      const zone = budget.timezone?.trim() || undefined;
      const start = zone
        ? DateTime.fromMillis(budget.periodStartTs, { zone }).startOf('day')
        : DateTime.fromMillis(budget.periodStartTs).startOf('day');
      const finish = start
        .plus({ days: periodDays - 1 })
        .set({ hour: 23, minute: 59, second: 59, millisecond: 999 });
      return {
        start,
        finish,
        mode: undefined,
        display: `${start.toFormat('d LLL')} – ${finish.toFormat('d LLL')} (${periodDays}д)`,
      };
    }

    // Fallback: derive a frame ending today (inclusive) if no anchor defined.
    const start = now.minus({ days: periodDays - 1 }).startOf('day');
    const finish = start
      .plus({ days: periodDays - 1 })
      .set({ hour: 23, minute: 59, second: 59, millisecond: 999 });
    return {
      start,
      finish,
      mode: undefined,
      display: `${start.toFormat('d LLL')} – ${finish.toFormat('d LLL')} (${periodDays}д)`,
    };
  }

  private toBudgetFilterFrame(frame: DateFrame): DateFrame {
    const start = frame.start.startOf('day');
    const finish = frame.finish.endOf('day');
    return {
      start,
      finish,
      mode: Mode.CUSTOM,
      display: `${start.setLocale('ru').toFormat('d MMMM yyyy')} - ${finish
        .setLocale('ru')
        .toFormat('d MMMM yyyy')}`,
    };
  }
}
