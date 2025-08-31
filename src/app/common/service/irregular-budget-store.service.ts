import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IrregularBudgetStoreService {
    private readonly valueSubject = new BehaviorSubject<number>(0);
    readonly value$: Observable<number> = this.valueSubject.asObservable();

    getValue(): number { return this.valueSubject.value; }
    updateValue(v: number): void { this.valueSubject.next(v); }

    getValueObs(): Observable<number> {
        const v = Number(localStorage.getItem('irregularBudget')) || 0;
        this.updateValue(v);
        return this.value$;
    }

    addValueObs(v: number): Observable<number> {
        localStorage.setItem('irregularBudget', v.toString());
        this.updateValue(v);
        return this.value$;
    }
}
