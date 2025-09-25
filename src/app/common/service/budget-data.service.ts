import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { first, map, shareReplay } from 'rxjs/operators';

import { ExpenseService } from './expense.service';
import { DateFilterService } from '../component/filter/date/date-filter.service';
import { IrregularBudgetService } from './irregular-budget.service';
import { Expense } from '../model/expense.model';
import { DateFrame } from '../component/filter/date/dateFrame.model';

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
    private irregularBudgetService: IrregularBudgetService
  ) {}

  /**
   * Returns expenses + budget for the current month (date frame resolved internally).
   * The method intentionally has no parameters to keep usage simple and consistent.
   * Cached with shareReplay to avoid duplicate upstream subscriptions in views.
   */
  getExpensesWithBudget(): Observable<BudgetPeriodData> {
    const frame = this.dateFilterService.getInitialMonthValue();
    return combineLatest([
      this.expenseService.getExpenses(frame),
      this.irregularBudgetService.getValue(),
    ]).pipe(
      first(), // complete after first value to avoid keeping subscription alive
      map(
        ([expenses, budget]): BudgetPeriodData => ({
          dateFrame: frame,
          expenses,
          budget: budget || 0,
        })
      ),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }
}
