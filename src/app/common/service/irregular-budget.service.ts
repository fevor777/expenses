import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, map, Observable, tap } from 'rxjs';
import { IrregularBudget } from '../model/irregular-budget.model';
import { IrregularBudgetStoreService } from './irregular-budget-store.service';
import { withUserId } from './with-user-id.helper';

@Injectable({ providedIn: 'root' })
export class IrregularBudgetService {
  private collection;
  constructor(
    private fireStore: AngularFirestore,
    private store: IrregularBudgetStoreService,
    private afAuth: AngularFireAuth
  ) {
    this.collection =
      this.fireStore.collection<IrregularBudget>('irregularBudget');
  }

  addValue(value: number): Observable<number> {
    const fallback = () => this.store.addValueObs(value);
    fallback();
    const request = (uid: string) => {
      const obj = { value, uid };
      return from(this.collection.doc(uid).set(obj)).pipe(map(() => value));
    };
    return withUserId(this.afAuth, request, fallback, fallback);
  }

  getValue(): Observable<number> {
    const fallback = () => this.store.getValueObs();
    const request = (uid: string) =>
      this.fireStore
        .doc<IrregularBudget>(`irregularBudget/${uid}`)
        .valueChanges()
        .pipe(
          map(v => v?.value || 0),
          tap(value => this.store.addValueObs(value))
        );
    return withUserId(this.afAuth, request, fallback, fallback);
  }
}
