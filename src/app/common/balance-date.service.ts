import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, map, Observable, of } from 'rxjs';

import { AuthService } from './auth.service';
import { BalanceDate } from './balance-date.model';

@Injectable({
  providedIn: 'root',
})
export class BalanceDateService {
  private balanceCollection;

  constructor(
    private fireStore: AngularFirestore,
    private authService: AuthService
  ) {
    this.balanceCollection = this.fireStore.collection<BalanceDate>('balance-date');
  }

  addBalanceDate(balance: string): Observable<string> {
    if (this.authService.user) {
      const uid = this.authService.user.uid;
      const balanceObj = { value: balance, uid: this.authService.user.uid };
      return from(this.balanceCollection.doc(uid).set(balanceObj)).pipe(map(() => balance));
    } else {
      localStorage.setItem('balanceDate', balance);
      return of(balance);
    }
  }

  getBalanceDate(): Observable<string> {
    if (this.authService.user) {
      const uid = this.authService.user.uid;
      return this.fireStore
        .doc<BalanceDate>(`balance-date/${uid}`)
        .valueChanges()
        .pipe(map((v) => v?.value || ''));
    } else {
      return of(localStorage.getItem('balanceDate') || '');
    }
  }
}
