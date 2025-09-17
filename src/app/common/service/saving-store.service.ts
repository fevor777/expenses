import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SavingStoreService {
  private readonly savingSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  readonly saving$: Observable<number> = this.savingSubject.asObservable();

  getSaving(): number {
    return this.savingSubject.value;
  }

  updateSaving(balance: number): void {
    this.savingSubject.next(balance);
  }

  getSavingObs(): Observable<number> {
    const balance = Number(localStorage.getItem('savings')) || 0;
    this.updateSaving(balance);
    return this.saving$;
  }

  addSavingObs(balance: number): Observable<number> {
    localStorage.setItem('savings', balance.toString());
    this.updateSaving(balance);
    return this.saving$;
  }
}
