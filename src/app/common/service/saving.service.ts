import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, from, map, Observable } from 'rxjs';

import { Savings } from '../model/saving.model';
import { AuthService } from './auth.service';
import { SavingStoreService } from './saving-store.service';

@Injectable({
  providedIn: 'root',
})
export class SavingService {
  private savingCollection;

  constructor(
    private fireStore: AngularFirestore,
    private authService: AuthService,
    private savingStoreService: SavingStoreService
  ) {
    this.savingCollection = this.fireStore.collection<Savings>('savings');
  }

  addSaving(savings: number): Observable<number> {
    localStorage.setItem('savings', savings.toString());
    if (this.authService.user) {
      const uid = this.authService.user.uid;
      const savingsObj = { value: savings, uid: this.authService.user.uid };
      return from(this.savingCollection.doc(uid).set(savingsObj)).pipe(
        map(() => savings),
        catchError(() => this.savingStoreService.addSavingObs(savings))
      );
    } else {
      return this.savingStoreService.addSavingObs(savings);
    }
  }

  getSavings(): Observable<number> {
    if (this.authService.user) {
      const uid = this.authService.user.uid;
      return this.fireStore
        .doc<Savings>(`savings/${uid}`)
        .valueChanges()
        .pipe(
          map((v) => v?.value || 0),
          catchError(() => this.savingStoreService.getSavingObs())
        );
    } else {
      return this.savingStoreService.getSavingObs();
    }
  }
}
