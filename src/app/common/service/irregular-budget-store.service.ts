import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Budget } from '../model/budget.model';

@Injectable({ providedIn: 'root' })
export class IrregularBudgetStoreService {
  private readonly valueSubject = new BehaviorSubject<Budget>({ uid: '', value: 600, period: 30, periodStart: 8 });
  readonly value$: Observable<Budget> = this.valueSubject.asObservable();

  getValue(): Budget {
    return this.valueSubject.value;
  }
  updateValue(v: Budget): void {
    this.valueSubject.next(v);
  }

  getValueObs(): Observable<Budget> {
    const v = JSON.parse(localStorage.getItem('irregularBudget') || '{}');
    this.updateValue(v);
    return this.value$;
  }

  addValueObs(v: Budget): Observable<Budget> {
    localStorage.setItem('irregularBudget', JSON.stringify(v));
    this.updateValue(v);
    return this.value$;
  }
}
