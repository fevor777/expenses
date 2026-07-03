import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, map, Observable, tap } from 'rxjs';
import { IrregularBudgetStoreService } from './irregular-budget-store.service';
import { withUserId } from './with-user-id.helper';
import { Budget } from '../model/budget.model';

@Injectable({ providedIn: 'root' })
export class IrregularBudgetService {
  private collection;
  constructor(
    private fireStore: AngularFirestore,
    private store: IrregularBudgetStoreService,
    private afAuth: AngularFireAuth
  ) {
    this.collection =
      this.fireStore.collection<Budget>('irregularBudget');
  }

  addValue(value: Budget): Observable<Budget> {
    const fallback = () => this.store.addValueObs(value);
    fallback();
    const request = (uid: string) => {
      const obj = { ...value, uid };
      return from(this.collection.doc(uid).set(obj)).pipe(map(() => value));
    };
    return withUserId(this.afAuth, request, fallback, fallback);
  }

  getValue(): Observable<Budget> {
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const attachTimezone = (value: Budget | null | undefined): Budget => {
      const fallbackBudget: Budget = {
        uid: '',
        value: 600,
        period: 30,
        timezone: browserTimezone,
      };
      return value
        ? { ...value, timezone: value.timezone || browserTimezone }
        : fallbackBudget;
    };
    const fallback = () => this.store.getValueObs().pipe(map(attachTimezone));
    const request = (uid: string) => {
      const doc = this.fireStore.doc<Budget>(`irregularBudget/${uid}`);
      return doc.valueChanges().pipe(
        tap(value => {
          if (!value) return;
          this.store.addValueObs(value);
          if (value.timezone) return;
          const migrated = { ...value, timezone: browserTimezone };
          void doc
            .set(migrated, { merge: true })
            .catch(error => console.warn('Failed to migrate budget timezone', error));
        }),
        map(attachTimezone)
      );
    };
    return withUserId(this.afAuth, request, fallback, fallback);
  }
}
