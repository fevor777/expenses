import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, map, Observable, tap } from 'rxjs';

import { BalanceDate } from '../model/balance-date.model';
import { BalanceDateStoreService } from './balance-date-store.service';
import { withUserId } from './with-user-id.helper';

@Injectable({
  providedIn: 'root',
})
export class BalanceDateService {
  private balanceCollection;

  constructor(
    private fireStore: AngularFirestore,
    private balanceDateStoreService: BalanceDateStoreService,
    private afAuth: AngularFireAuth
  ) {
    this.balanceCollection =
      this.fireStore.collection<BalanceDate>('balance-date');
  }

  addBalanceDate(balance: string): Observable<string> {
    const fallback = () =>
      this.balanceDateStoreService.addBalanceDateObs(balance);
    fallback();
    const request = (uid: string) => {
      const balanceObj = { value: balance, uid };
      return from(this.balanceCollection.doc(uid).set(balanceObj)).pipe(
        map(() => balance)
      );
    };
    return withUserId(this.afAuth, request, fallback, fallback);
  }

  getBalanceDate(): Observable<string> {
    const fallback = () => this.balanceDateStoreService.getBalanceDateObs();
    const request = (uid: string) =>
      this.fireStore
        .doc<BalanceDate>(`balance-date/${uid}`)
        .valueChanges()
        .pipe(
          map(v => v?.value || ''),
          tap(value => this.balanceDateStoreService.addBalanceDateObs(value))
        );
    return withUserId(this.afAuth, request, fallback, fallback);
  }
}
