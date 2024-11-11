import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, from, map, Observable } from 'rxjs';

import { Balance } from '../model/balance.model';
import { AuthService } from './auth.service';
import { BalanceStoreService } from './balance-store.service';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  private balanceCollection;

  constructor(
    private fireStore: AngularFirestore,
    private authService: AuthService,
    private balanceStoreService: BalanceStoreService
  ) {
    this.balanceCollection = this.fireStore.collection<Balance>('balance');
  }

  addBalance(balance: number): Observable<number> {
    localStorage.setItem('balance', balance.toString());
    if (this.authService.user) {
      const uid = this.authService.user.uid;
      const balanceObj = { value: balance, uid: this.authService.user.uid };
      return from(this.balanceCollection.doc(uid).set(balanceObj)).pipe(
        map(() => balance),
        catchError(() => this.balanceStoreService.addBalanceObs(balance))
      );
    } else {
      return this.balanceStoreService.addBalanceObs(balance);
    }
  }

  getBalance(): Observable<number> {
    if (this.authService.user) {
      const uid = this.authService.user.uid;
      return this.fireStore
        .doc<Balance>(`balance/${uid}`)
        .valueChanges()
        .pipe(
          map((v) => v?.value || 0),
          catchError(() => this.balanceStoreService.getBalanceObs())
        );
    } else {
      return this.balanceStoreService.getBalanceObs();
    }
  }
}
