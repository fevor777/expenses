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
}
