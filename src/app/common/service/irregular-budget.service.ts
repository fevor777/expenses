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
    const fallback = () => this.store.getValueObs();
    const request = (uid: string) =>
      this.fireStore
        .doc<Budget>(`irregularBudget/${uid}`)
        .valueChanges()
        .pipe(
          tap(value => {
            if (value) this.store.addValueObs(value);
          })
        );
    return withUserId(this.afAuth, request, fallback, fallback);
  }
}
