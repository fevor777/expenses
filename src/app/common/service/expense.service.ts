import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { filter, from, map, Observable } from 'rxjs';

import { DateFrame } from '../component/filter/date/dateFrame.model';
import { Expense } from '../model/expense.model';
import {
  BalanceFilter,
  DEFAULT_BALANCE_FILTER,
  matchesBalanceFilter,
} from '../model/balance-filter.model';
import { canonicalizeTagIds, normalizeTagIds } from '../model/tag.model';
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
    const itemWithId = canonicalizeTagIds({ ...expense, id });
    const fallback = () => this.expenseStoreService.addExpense(itemWithId);
    const request = (uid: string) =>
      from(this.expensesCollection.doc(id).set({ ...itemWithId, uid })).pipe(
        map(() => ({ ...itemWithId, uid }))
      );
    return withUserId(this.afAuth, request, fallback, fallback);
  }

  getExpenses(
    dateFilter?: DateFrame,
    category?: string[],
    descriptionFilter?: string,
    useCache = true,
    tagIds?: string[],
    balanceFilter: BalanceFilter = DEFAULT_BALANCE_FILTER
  ): Observable<Expense[]> {
    const desc = (descriptionFilter || '').trim().toLowerCase();
    const normalizedTagIds = normalizeTagIds(tagIds);
    const applyDescriptionFilter = (expenses: Expense[]) => {
      if (!desc) return expenses;
      return expenses.filter(e =>
        (e.description || '').toLowerCase().includes(desc)
      );
    };
    const applyTagFilter = (expenses: Expense[]) => {
      if (!normalizedTagIds?.length) return expenses;
      return expenses.filter(expense =>
        (expense.tagIds || []).some(tagId => normalizedTagIds.includes(tagId))
      );
    };
    const applyCategoryFilter = (expenses: Expense[]) => {
      if (!Array.isArray(category) || category.length === 0) return expenses;
      const categoryIds = new Set(category);
      return expenses.filter(expense => categoryIds.has(expense.category));
    };
    const applyBalanceFilter = (expenses: Expense[]) => {
      if (balanceFilter === DEFAULT_BALANCE_FILTER) return expenses;
      return expenses.filter(expense =>
        matchesBalanceFilter(expense.includeInBalance, balanceFilter)
      );
    };
    const fallback = () =>
      this.expenseStoreService.getExpensesObs(
        dateFilter,
        category,
        descriptionFilter,
        normalizedTagIds,
        balanceFilter
      );
    const request = (userId: string) =>
      this.getExpensesFromFirebase(
        dateFilter,
        category,
        userId,
        useCache,
        normalizedTagIds
      ).pipe(
        map(expenses => expenses.map(expense => canonicalizeTagIds(expense))),
        map(applyCategoryFilter),
        map(applyDescriptionFilter),
        map(applyTagFilter),
        map(applyBalanceFilter)
      );
    return withUserId(this.afAuth, request, fallback, fallback);
  }

  updateExpense(expense: Expense): Observable<unknown> {
    const normalizedExpense = canonicalizeTagIds(expense);
    const fallback = () =>
      this.expenseStoreService.updateExpense(normalizedExpense);
    const request = () => {
      const payload: Record<string, unknown> = {
        ...normalizedExpense,
      };

      if (!normalizedExpense.tagIds?.length) {
        payload['tagIds'] = firebase.firestore.FieldValue.delete();
      }

      return from(
        this.expensesCollection.doc(normalizedExpense.id).update(payload)
      );
    };
    return withUserId(this.afAuth, request, fallback, fallback);
  }

  deleteExpense(id: string): Observable<string> {
    const fallback = () => this.expenseStoreService.deleteExpense(id);
    const request = () =>
      from(this.expensesCollection.doc(id).delete()).pipe(map(() => id));
    return withUserId(this.afAuth, request, fallback, fallback);
  }

  /**
   * Get the latest (most recent by date) expense. Uses Firestore query limited to 1.
   * Offline / unauthenticated fallback returns the newest locally stored expense.
   * @param useCache whether to allow serving cached snapshot (true by default)
   */
  getLatestExpense(useCache = true): Observable<Expense | undefined> {
    const fallback = () =>
      new Observable<Expense | undefined>(subscriber => {
        subscriber.next(this.expenseStoreService.getLatestExpense());
        subscriber.complete();
      });

    const request = (userId: string) =>
      this.fireStore
        .collection<Expense>('expenses', ref =>
          ref.where('uid', '==', userId).orderBy('date', 'desc').limit(1)
        )
        .snapshotChanges()
        .pipe(
          filter(
            c =>
              useCache ||
              c.every(a => a.payload.doc.metadata.fromCache === false)
          ),
          map(actions => {
            if (!actions.length) return undefined;
            const a = actions[0];
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return canonicalizeTagIds({ id, ...data } as Expense);
          })
        );

    return withUserId(this.afAuth, request, fallback, fallback);
  }

  private getExpensesFromFirebase(
    dateFilter?: DateFrame,
    category?: string[],
    userId?: string,
    useCache = true,
    tagIds?: string[]
  ): Observable<Expense[]> {
    return this.fireStore
      .collection<Expense>('expenses', ref => {
        let query = ref.where('uid', '==', userId);

        // If dateFilter is provided, add the date conditions to the query
        if (dateFilter?.start && dateFilter?.finish) {
          query = query
            .where('date', '>=', dateFilter.start.valueOf())
            .where('date', '<=', dateFilter.finish.valueOf());
        }

        if (
          Array.isArray(category) &&
          category.length > 0 &&
          category.length <= 30
        ) {
          query = query.where('category', 'in', category);
        }

        if (
          (!category || category.length === 0) &&
          Array.isArray(tagIds) &&
          tagIds.length > 0
        ) {
          query = query.where('tagIds', 'array-contains-any', tagIds);
        }

        // Always order by date
        return query.orderBy('date', 'desc');
      })
      .snapshotChanges()
      .pipe(
        filter(
          c =>
            useCache || c.every(a => a.payload.doc.metadata.fromCache === false)
        ),
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return canonicalizeTagIds({ id, ...data } as Expense);
          })
        )
      );
  }
}
