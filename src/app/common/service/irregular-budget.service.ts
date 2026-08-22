import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, map, Observable, tap } from 'rxjs';
import { IrregularBudgetStoreService } from './irregular-budget-store.service';
import { withUserId } from './with-user-id.helper';
import { Budget, canonicalizeBudget } from '../model/budget.model';

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
    const canonical = canonicalizeBudget(value);
    const fallback = () => this.store.addValueObs(canonical);
    fallback();
    const request = (uid: string) => {
      const obj = canonicalizeBudget({ ...canonical, uid });
      return from(this.collection.doc(uid).set(obj)).pipe(
        map(() => canonical)
      );
    };
    return withUserId(this.afAuth, request, fallback, fallback);
  }

  getValue(): Observable<Budget> {
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const attachTimezone = (value: Budget | null | undefined): Budget => {
      return canonicalizeBudget(
        value || { uid: '', value: 600, period: 30 },
        browserTimezone
      );
    };
    const fallback = () => this.store.getValueObs().pipe(map(attachTimezone));
    const request = (uid: string) => {
      const doc = this.fireStore.doc<Budget>(`irregularBudget/${uid}`);
      return doc.valueChanges().pipe(
        tap(value => {
          if (!value) return;
          const canonical = canonicalizeBudget(value, browserTimezone);
          this.store.addValueObs(canonical);
          if (JSON.stringify(value) === JSON.stringify(canonical)) return;
          const migrated = canonicalizeBudget(
            { ...value, timezone: browserTimezone },
            browserTimezone
          );
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
