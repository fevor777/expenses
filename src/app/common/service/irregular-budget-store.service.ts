import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Budget } from '../model/budget.model';

@Injectable({ providedIn: 'root' })
export class IrregularBudgetStoreService {
  private readonly valueSubject = new BehaviorSubject<Budget>({ uid: '', value: 600, period: 30 });
  readonly value$: Observable<Budget> = this.valueSubject.asObservable();

  getValue(): Budget {
    return this.valueSubject.value;
  }
  updateValue(v: Budget): void {
    this.valueSubject.next(v);
  }

  getValueObs(): Observable<Budget> {
    let v = JSON.parse(localStorage.getItem('irregularBudget') || '{}');
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Legacy migration: if periodStartTs missing but periodStart exists, derive a timestamp anchor
    if (v && !v.periodStartTs && v.periodStart) {
      const day = v.periodStart;
      const periodDays = v.period && v.period > 0 ? Math.floor(v.period) : 30;
      const now = new Date();
      const dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      let candidate = new Date(now.getFullYear(), now.getMonth(), Math.min(day, dim));
      if (candidate.getTime() > Date.now()) {
        const prev = new Date(now.getFullYear(), now.getMonth(), 0);
        const prevDim = prev.getDate();
        candidate = new Date(prev.getFullYear(), prev.getMonth(), Math.min(day, prevDim));
      }
      while (candidate.getTime() + periodDays * 86400000 <= Date.now()) {
        candidate = new Date(candidate.getTime() + periodDays * 86400000);
      }
      v = { ...v, periodStartTs: candidate.getTime() };
      delete v.periodStart;
    }
    if (v && !v.timezone) {
      v = { ...v, timezone: browserTimezone };
    }
    localStorage.setItem('irregularBudget', JSON.stringify(v));
    this.updateValue(v);
    return this.value$;
  }

  addValueObs(v: Budget): Observable<Budget> {
    const clone = { ...v } as any;
    delete clone.periodStart; // ensure legacy field not persisted further
    localStorage.setItem('irregularBudget', JSON.stringify(clone));
    this.updateValue(v);
    return this.value$;
  }
}
