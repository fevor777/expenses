import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, from, map, Observable } from 'rxjs';

import { BalanceDate } from '../model/balance-date.model';
import { AuthService } from './auth.service';
import { BalanceDateStoreService } from './balance-date-store.service';

@Injectable({
  providedIn: 'root',
})
export class BalanceDateService {
  private balanceCollection;

  constructor(
    private fireStore: AngularFirestore,
    private authService: AuthService,
    private balanceDateStoreService: BalanceDateStoreService
  ) {
    this.balanceCollection =
      this.fireStore.collection<BalanceDate>('balance-date');
  }

  addBalanceDate(balance: string): Observable<string> {
    localStorage.setItem('balanceDate', balance.toString());
    if (this.authService.user) {
      const uid = this.authService.user.uid;
      const balanceObj = { value: balance, uid: this.authService.user.uid };
      return from(this.balanceCollection.doc(uid).set(balanceObj)).pipe(
        map(() => balance),
        catchError(() =>
          this.balanceDateStoreService.addBalanceDateObs(balance)
        )
      );
    } else {
      return this.balanceDateStoreService.addBalanceDateObs(balance);
    }
  }

  getBalanceDate(): Observable<string> {
    if (this.authService.user) {
      const uid = this.authService.user.uid;
      return this.fireStore
        .doc<BalanceDate>(`balance-date/${uid}`)
        .valueChanges()
        .pipe(
          map((v) => v?.value || ''),
          catchError(() => this.balanceDateStoreService.getBalanceDateObs())
        );
    } else {
      return this.balanceDateStoreService.getBalanceDateObs();
    }
  }
}
