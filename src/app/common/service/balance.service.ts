import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, map, Observable, tap } from 'rxjs';

import { Balance } from '../model/balance.model';
import { BalanceStoreService } from './balance-store.service';
import { withUserId } from './with-user-id.helper';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  private balanceCollection;

  constructor(
    private fireStore: AngularFirestore,
    private balanceStoreService: BalanceStoreService,
    private afAuth: AngularFireAuth
  ) {
    this.balanceCollection = this.fireStore.collection<Balance>('balance');
  }

  addBalance(balance: number): Observable<number> {
    const fallback = () => this.balanceStoreService.addBalanceObs(balance);
    fallback();
    const project = (uid: string) => {
      const balanceObj = { value: balance, uid };
      return from(this.balanceCollection.doc(uid).set(balanceObj)).pipe(
        map(() => balance)
      );
    };
    return withUserId(this.afAuth, project, fallback, fallback);
  }

  getBalance(): Observable<number> {
    const fallback = () => this.balanceStoreService.getBalanceObs();
    const request = (uid: string) =>
      this.fireStore
        .doc<Balance>(`balance/${uid}`)
        .valueChanges()
        .pipe(
          map(v => v?.value || 0),
          tap(value => this.balanceStoreService.addBalanceObs(value))
        );
    return withUserId(this.afAuth, request, fallback, fallback);
  }
}
