import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, from, map, Observable } from 'rxjs';

import { DateFrame } from '../component/filter/date/dateFrame.model';
import { Expense } from '../model/expense.model';
import { AuthService } from './auth.service';
import { ExpenseStoreService } from './expense-store.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private expensesCollection;

  constructor(
    private fireStore: AngularFirestore,
    private authService: AuthService,
    private expenseStoreService: ExpenseStoreService
  ) {
    this.expensesCollection = this.fireStore.collection<Expense>('expenses');
  }

  addExpense(expense: Expense): Observable<Expense> {
    const id = this.fireStore.createId();
    const itemWithId = { ...expense, id };
    if (this.authService.user) {
      const uid = this.authService.user.uid;
      return from(
        this.expensesCollection.doc(id).set({ ...itemWithId, uid })
      ).pipe(
        map(() => ({ ...itemWithId, uid })),
        catchError(() => {
          return this.expenseStoreService.addExpense(itemWithId);
        })
      );
    } else {
      return this.expenseStoreService.addExpense(itemWithId);
    }
  }

  getExpenses(
    dateFilter?: DateFrame,
    category?: string[]
  ): Observable<Expense[]> {
    if (this.authService.user) {
      return this.getExpensesFromFirebase(dateFilter, category);
    } else {
      return this.expenseStoreService.getExpensesObs(dateFilter, category);
    }
  }

  updateExpense(expense: Expense): Observable<unknown> {
    if (this.authService.user) {
      return from(this.expensesCollection.doc(expense.id).update(expense)).pipe(
        catchError(() => this.expenseStoreService.updateExpense(expense))
      );
    } else {
      return this.expenseStoreService.updateExpense(expense);
    }
  }

  deleteExpense(id: string): Observable<string> {
    if (this.authService.user) {
      return from(this.expensesCollection.doc(id).delete())
        .pipe(map(() => id))
        .pipe(catchError(() => this.expenseStoreService.deleteExpense(id)));
    } else {
      return this.expenseStoreService.deleteExpense(id);
    }
  }

  private getExpensesFromFirebase(
    dateFilter?: DateFrame,
    category?: string[]
  ): Observable<Expense[]> {
    return this.fireStore
      .collection<Expense>('expenses', (ref) => {
        let query = ref.where('uid', '==', this.authService.user.uid);

        // If dateFilter is provided, add the date conditions to the query
        if (dateFilter?.start && dateFilter?.finish) {
          query = query
            .where('date', '>=', dateFilter.start.valueOf())
            .where('date', '<=', dateFilter.finish.valueOf());
        }

        if (Array.isArray(category) && category.length > 0) {
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
        ),
        catchError(() => {
          return this.expenseStoreService.getExpensesObs(dateFilter, category);
        })
      );
  }
}
