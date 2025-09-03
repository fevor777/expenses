import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, map, Observable } from 'rxjs';

import { DateFrame } from '../component/filter/date/dateFrame.model';
import { Expense } from '../model/expense.model';
import { ExpenseStoreService } from './expense-store.service';
import { withUserId } from './with-user-id.helper';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private expensesCollection;

  constructor(
    private fireStore: AngularFirestore,
    private expenseStoreService: ExpenseStoreService,
    private afAuth: AngularFireAuth
  ) {
    this.expensesCollection = this.fireStore.collection<Expense>('expenses');
  }

  addExpense(expense: Expense): Observable<Expense> {
    const id = this.fireStore.createId();
    const itemWithId = { ...expense, id };
    const fallback = () => this.expenseStoreService.addExpense(itemWithId);
    const request = (uid: string) =>
      from(this.expensesCollection.doc(id).set({ ...itemWithId, uid })).pipe(
        map(() => ({ ...itemWithId, uid })),
      );
    return withUserId(this.afAuth, request, fallback, fallback);
  }

  getExpenses(
    dateFilter?: DateFrame,
    category?: string[],
    descriptionFilter?: string
  ): Observable<Expense[]> {
    const desc = (descriptionFilter || '').trim().toLowerCase();
    const applyDescriptionFilter = (expenses: Expense[]) => {
      if (!desc) return expenses;
      return expenses.filter((e) =>
        (e.description || '').toLowerCase().includes(desc)
      );
    };
    const fallback = () =>
      this.expenseStoreService
        .getExpensesObs(dateFilter, category, descriptionFilter)
    const request = (userId: string) =>
      this.getExpensesFromFirebase(dateFilter, category, userId).pipe(
        map(applyDescriptionFilter)
      );
    return withUserId(this.afAuth, request, fallback, fallback);
  }

  updateExpense(expense: Expense): Observable<unknown> {
    const fallback = () => this.expenseStoreService.updateExpense(expense);
    const request = () =>
      from(this.expensesCollection.doc(expense.id).update(expense));
    return withUserId(this.afAuth, request, fallback, fallback);
  }

  deleteExpense(id: string): Observable<string> {
    const fallback = () => this.expenseStoreService.deleteExpense(id);
    const request = () =>
      from(this.expensesCollection.doc(id).delete()).pipe(
        map(() => id),
      );
    return withUserId(this.afAuth, request, fallback, fallback);
  }

  private getExpensesFromFirebase(
    dateFilter?: DateFrame,
    category?: string[],
    userId?: string
  ): Observable<Expense[]> {
    return this.fireStore
      .collection<Expense>('expenses', (ref) => {
        let query = ref.where('uid', '==', userId);

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
      );
  }
}
