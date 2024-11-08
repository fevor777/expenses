import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BalanceStoreService {
  private readonly balanceSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  readonly balance$: Observable<number> = this.balanceSubject.asObservable();

  getBalance(): number {
    return this.balanceSubject.value;
  }
  
  updateBalance(balance: number): void {
    this.balanceSubject.next(balance);
  }

  getBalanceObs(): Observable<number> {
    const balance = Number(localStorage.getItem('balance')) || 0;
    this.updateBalance(balance);
    return this.balance$;
  }

  addBalanceObs(balance: number): Observable<number> {
    localStorage.setItem('balance', balance.toString());
    this.updateBalance(balance);
    return this.balance$;
  }
}
