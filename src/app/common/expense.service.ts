import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, map, Observable, of } from 'rxjs';

import { getExpensesFromTo } from '../statistics/functions/expense-helpers';
import { AuthService } from './auth.service';
import { DateFrame } from './component/filter/date/dateFrame.model';
import { Expense } from './expense.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private expensesCollection;

  constructor(
    private fireStore: AngularFirestore,
    private authService: AuthService
  ) {
    this.expensesCollection = this.fireStore.collection<Expense>('expenses');
  }

  // Add expense
  addExpense(expense: Expense): Observable<Expense> {
    const id = this.fireStore.createId();
    const itemWithId = { ...expense, id };
    if (this.authService.user) {
      const uid = this.authService.user.uid;
      return from(
        this.expensesCollection.doc(id).set({ ...itemWithId, uid })
      ).pipe(map(() => ({ ...itemWithId, uid })));
    } else {
      const jsonInLocalStorage = localStorage.getItem('expenses');
      let expenseList = jsonInLocalStorage
        ? JSON.parse(jsonInLocalStorage)
        : [];
      expenseList.unshift(itemWithId);
      localStorage.setItem('expenses', JSON.stringify(expenseList));
      return of(itemWithId);
    }
  }

  // Get all expenses
  getExpenses(
    dateFilter?: DateFrame,
    category?: string[]
  ): Observable<Expense[]> {
    if (this.authService.user) {
      return this.fireStore
        .collection<Expense>('expenses', (ref) => {
          let query = ref.where('uid', '==', this.authService.user.uid);

          // If dateFilter is provided, add the date conditions to the query
          if (dateFilter?.start && dateFilter?.finish) {
            query = query
              .where('date', '>=', dateFilter.start.valueOf())
              .where('date', '<=', dateFilter.finish.valueOf());
          }

          if (
            Array.isArray(category) &&
            category.length > 0
          ) {
            query = query.where('category', 'in', category);
          }

          // Always order by date
          return query.orderBy('date', 'desc');
        })
        .snapshotChanges()
        .pipe(
          map((actions) =>
            actions.map((a) => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return { id, ...data };
            })
          )
        );
    } else {
      let expensesFromLocStorage = JSON.parse(
        localStorage.getItem('expenses') || '[]'
      );
      if (dateFilter) {
        expensesFromLocStorage = getExpensesFromTo(
          expensesFromLocStorage,
          dateFilter.start,
          dateFilter.finish
        );
      }

      if (
        Array.isArray(category) &&
        category.length > 0
      ) {
        expensesFromLocStorage = expensesFromLocStorage.filter((expense) => {
          return category.includes(expense.category);
        });
      }
      return of(expensesFromLocStorage);
    }
  }

  // Update expense
  updateExpense(expense: Expense): Observable<unknown> {
    if (this.authService.user) {
      return from(this.expensesCollection.doc(expense.id).update(expense));
    } else {
      const expensesFromLocStorage = JSON.parse(
        localStorage.getItem('expenses') || '[]'
      );
      const updatedExpenses = expensesFromLocStorage.map((exp: Expense) => {
        if (exp.id === expense.id) {
          return expense;
        }
        return exp;
      });
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
      return of();
    }
  }

  // Delete expense
  deleteExpense(id: string): Observable<string> {
    if (this.authService.user) {
      return from(this.expensesCollection.doc(id).delete()).pipe(map(() => id));
    } else {
      const expensesFromLocStorage = JSON.parse(
        localStorage.getItem('expenses') || '[]'
      );
      const updatedExpenses = expensesFromLocStorage.filter(
        (expense: Expense) => expense.id !== id
      );
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
      return of(id);
    }
  }
}
