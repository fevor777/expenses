import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Expense } from '../model/expense.model';
import { canonicalizeTagIds, normalizeTagIds } from '../model/tag.model';
import { DateFrame } from '../component/filter/date/dateFrame.model';
import { getExpensesFromTo } from '../../statistics/functions/expense-helpers';
import { MultiFilter } from '../component/filter/multi/multi-filter.component';
import {
  BalanceFilter,
  DEFAULT_BALANCE_FILTER,
  matchesBalanceFilter,
} from '../model/balance-filter.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseStoreService {
  private readonly expenseSubject: BehaviorSubject<Expense[]> =
    new BehaviorSubject<Expense[]>([]);
  readonly expenses$: Observable<Expense[]> =
    this.expenseSubject.asObservable();

  private filter: MultiFilter;

  getExpenses(): Expense[] {
    return this.expenseSubject.value;
  }

  getExpensesObs(
    dateFilter?: DateFrame,
    category?: string[],
    descriptionFilter?: string,
    tagIds?: string[],
    balanceFilter: BalanceFilter = DEFAULT_BALANCE_FILTER
  ): Observable<Expense[]> {
    let expensesFromLocStorage = JSON.parse(
      localStorage.getItem('expenses') || '[]'
    ).map((expense: Expense) => canonicalizeTagIds(expense));
    expensesFromLocStorage = this.filterExpenses(
      expensesFromLocStorage,
      dateFilter,
      category,
      descriptionFilter,
      tagIds,
      balanceFilter
    );
    this.filter = {
      date: dateFilter,
      categories: category,
      description: descriptionFilter,
      tagIds: normalizeTagIds(tagIds) || [],
      balanceFilter,
    } as MultiFilter;
    this.updateExpenses(expensesFromLocStorage);
    return this.expenses$;
  }

  updateExpenses(expenses: Expense[]): void {
    this.expenseSubject.next(expenses);
  }

  /**
   * Returns the newest expense (by date descending) from the currently cached list.
   * Assumes expenses already stored are in any order; we sort defensively.
   */
  getLatestExpense(): Expense | undefined {
    const list = this.expenseSubject.value;
    if (!Array.isArray(list) || list.length === 0) return undefined;
    // Items are usually unshifted (newest first) but ensure correctness.
    return [...list].sort((a, b) => b.date - a.date)[0];
  }

  addExpense(expense: Expense): Observable<Expense> {
    const jsonInLocalStorage = localStorage.getItem('expenses');
    const normalizedExpense = canonicalizeTagIds(expense);
    let expenseList = jsonInLocalStorage ? JSON.parse(jsonInLocalStorage) : [];
    expenseList.unshift(normalizedExpense);
    localStorage.setItem('expenses', JSON.stringify(expenseList));
    expenseList = this.filterExpenses(
      expenseList.map((item: Expense) => canonicalizeTagIds(item)),
      this.filter?.date,
      this.filter?.categories,
      this.filter?.description,
      this.filter?.tagIds,
      this.filter?.balanceFilter
    );
    this.updateExpenses(expenseList);
    return of(normalizedExpense);
  }

  updateExpense(expense: Expense): Observable<Expense> {
    const normalizedExpense = canonicalizeTagIds(expense);
    const expensesFromLocStorage = JSON.parse(
      localStorage.getItem('expenses') || '[]'
    );
    let updatedExpenses = expensesFromLocStorage.map((exp: Expense) => {
      if (exp.id === normalizedExpense.id) {
        return normalizedExpense;
      }
      return canonicalizeTagIds(exp);
    });
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    updatedExpenses = this.filterExpenses(
      updatedExpenses,
      this.filter?.date,
      this.filter?.categories,
      this.filter?.description,
      this.filter?.tagIds,
      this.filter?.balanceFilter
    );
    this.updateExpenses(updatedExpenses);
    return of(normalizedExpense);
  }

  deleteExpense(id: string): Observable<string> {
    const expensesFromLocStorage = JSON.parse(
      localStorage.getItem('expenses') || '[]'
    );
    let updatedExpenses = expensesFromLocStorage.filter(
      (expense: Expense) => expense.id !== id
    );
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    updatedExpenses = this.filterExpenses(
      updatedExpenses.map((expense: Expense) => canonicalizeTagIds(expense)),
      this.filter?.date,
      this.filter?.categories,
      this.filter?.description,
      this.filter?.tagIds,
      this.filter?.balanceFilter
    );
    this.updateExpenses(updatedExpenses);
    return of(id);
  }

  private filterExpenses(
    expenses: Expense[],
    dateFilter?: DateFrame,
    category?: string[],
    descriptionFilter?: string,
    tagIds?: string[],
    balanceFilter: BalanceFilter = DEFAULT_BALANCE_FILTER
  ): Expense[] {
    let filteredExpenses: Expense[] = [];
    if (Array.isArray(expenses) && expenses.length > 0) {
      if (dateFilter) {
        filteredExpenses = getExpensesFromTo(
          expenses,
          dateFilter.start,
          dateFilter.finish
        );
      } else {
        filteredExpenses = expenses;
      }

      if (Array.isArray(category) && category.length > 0) {
        filteredExpenses = filteredExpenses.filter(expense => {
          return category.includes(expense.category);
        });
      }

      if (descriptionFilter && descriptionFilter.trim()) {
        const desc = descriptionFilter.trim().toLowerCase();
        filteredExpenses = filteredExpenses.filter(expense =>
          (expense.description || '').toLowerCase().includes(desc)
        );
      }

      const normalizedTagIds = normalizeTagIds(tagIds);
      if (normalizedTagIds?.length) {
        filteredExpenses = filteredExpenses.filter(expense =>
          (expense.tagIds || []).some(tagId => normalizedTagIds.includes(tagId))
        );
      }

      if (balanceFilter !== DEFAULT_BALANCE_FILTER) {
        filteredExpenses = filteredExpenses.filter(expense =>
          matchesBalanceFilter(expense.includeInBalance, balanceFilter)
        );
      }
    }
    return filteredExpenses;
  }
}
