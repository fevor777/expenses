import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Expense } from '../model/expense.model';
import { DateFrame } from '../component/filter/date/dateFrame.model';
import { getExpensesFromTo } from '../../statistics/functions/expense-helpers';
import { MultiFilter } from '../component/filter/multi/multi-filter.component';

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
    descriptionFilter?: string
  ): Observable<Expense[]> {
    let expensesFromLocStorage = JSON.parse(
      localStorage.getItem('expenses') || '[]'
    );
    expensesFromLocStorage = this.filterExpenses(
      expensesFromLocStorage,
      dateFilter,
      category,
      descriptionFilter
    );
    this.filter = { date: dateFilter, categories: category, description: descriptionFilter } as MultiFilter;
    this.updateExpenses(expensesFromLocStorage);
    return this.expenses$;
  }

  updateExpenses(expenses: Expense[]): void {
    this.expenseSubject.next(expenses);
  }

  addExpense(expense: Expense): Observable<Expense> {
    const jsonInLocalStorage = localStorage.getItem('expenses');
    let expenseList = jsonInLocalStorage ? JSON.parse(jsonInLocalStorage) : [];
    expenseList.unshift(expense);
    localStorage.setItem('expenses', JSON.stringify(expenseList));
    expenseList = this.filterExpenses(
      expenseList,
      this.filter?.date,
      this.filter?.categories,
      this.filter?.description
    );
    this.updateExpenses(expenseList);
    return of(expense);
  }

  updateExpense(expense: Expense): Observable<Expense> {
    const expensesFromLocStorage = JSON.parse(
      localStorage.getItem('expenses') || '[]'
    );
    let updatedExpenses = expensesFromLocStorage.map((exp: Expense) => {
      if (exp.id === expense.id) {
        return expense;
      }
      return exp;
    });
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    updatedExpenses = this.filterExpenses(
      updatedExpenses,
      this.filter?.date,
      this.filter?.categories,
      this.filter?.description
    );
    this.updateExpenses(updatedExpenses);
    return of(expense);
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
      updatedExpenses,
      this.filter?.date,
      this.filter?.categories,
      this.filter?.description
    );
    this.updateExpenses(updatedExpenses);
    return of(id);
  }

  private filterExpenses(
    expenses: Expense[],
    dateFilter?: DateFrame,
    category?: string[],
    descriptionFilter?: string
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
        filteredExpenses = filteredExpenses.filter((expense) => {
          return category.includes(expense.category);
        });
      }

      if (descriptionFilter && descriptionFilter.trim()) {
        const desc = descriptionFilter.trim().toLowerCase();
        filteredExpenses = filteredExpenses.filter((expense) =>
          (expense.description || '').toLowerCase().includes(desc)
        );
      }
    }
    return filteredExpenses;
  }
}
