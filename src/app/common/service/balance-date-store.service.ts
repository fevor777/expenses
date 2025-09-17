import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BalanceDateStoreService {
  private readonly balanceDateSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  readonly balanceDate$: Observable<string> =
    this.balanceDateSubject.asObservable();

  getBalanceDate(): string {
    return this.balanceDateSubject.value;
  }

  updateBalanceDate(balance: string): void {
    this.balanceDateSubject.next(balance);
  }

  getBalanceDateObs(): Observable<string> {
    const balance = localStorage.getItem('balanceDate') || '';
    this.updateBalanceDate(balance);
    return this.balanceDate$;
  }

  addBalanceDateObs(balance: string): Observable<string> {
    localStorage.setItem('balanceDate', balance.toString());
    this.updateBalanceDate(balance);
    return this.balanceDate$;
  }
}
