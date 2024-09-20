import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from, map, of } from 'rxjs';
import { AuthService } from './auth.service';
import { Balance } from './balance.model';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  private balanceCollection;

  constructor(
    private fireStore: AngularFirestore,
    private authService: AuthService
  ) {
    this.balanceCollection = this.fireStore.collection<Balance>('balance');
  }

  addBalance(balance: number): Observable<number> {
    localStorage.setItem('balance', balance.toString());
    if (this.authService.user) {
      const uid = this.authService.user.uid;
      const balanceObj = { value: balance, uid: this.authService.user.uid };
      return from(this.balanceCollection.doc(uid).set(balanceObj)).pipe(map(() => balance));
    } else {
      return of(balance);
    }
  }

  getBalance(): Observable<number> {
    if (this.authService.user) {
      const uid = this.authService.user.uid;
      return this.fireStore
        .doc<Balance>(`balance/${uid}`)
        .valueChanges()
        .pipe(map((v) => v?.value || 0));
    } else {
      return of(Number(localStorage.getItem('balance')) || 0);
    }
  }
}
