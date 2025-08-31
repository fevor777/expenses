import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, from, map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { IrregularBudget } from '../model/irregular-budget.model';
import { IrregularBudgetStoreService } from './irregular-budget-store.service';

@Injectable({ providedIn: 'root' })
export class IrregularBudgetService {
    private collection;
    constructor(
        private fireStore: AngularFirestore,
        private authService: AuthService,
        private store: IrregularBudgetStoreService
    ) {
        this.collection = this.fireStore.collection<IrregularBudget>('irregularBudget');
    }

    addValue(value: number): Observable<number> {
        localStorage.setItem('irregularBudget', value.toString());
        if (this.authService.user) {
            const uid = this.authService.user.uid;
            const obj = { value, uid };
            return from(this.collection.doc(uid).set(obj)).pipe(
                map(() => value),
                catchError(() => this.store.addValueObs(value))
            );
        } else {
            return this.store.addValueObs(value);
        }
    }

    getValue(): Observable<number> {
        if (this.authService.user) {
            const uid = this.authService.user.uid;
            return this.fireStore.doc<IrregularBudget>(`irregularBudget/${uid}`)
                .valueChanges()
                .pipe(
                    map(v => v?.value || 0),
                    catchError(() => this.store.getValueObs())
                );
        } else {
            return this.store.getValueObs();
        }
    }
}
