import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, map, Observable, tap } from 'rxjs';

import { Savings } from '../model/saving.model';
import { SavingStoreService } from './saving-store.service';
import { withUserId } from './with-user-id.helper';

@Injectable({
  providedIn: 'root',
})
export class SavingService {
  private savingCollection;

  constructor(
    private fireStore: AngularFirestore,
    private savingStoreService: SavingStoreService,
    private afAuth: AngularFireAuth
  ) {
    this.savingCollection = this.fireStore.collection<Savings>('savings');
  }

  addSaving(savings: number): Observable<number> {
    const fallback = () => this.savingStoreService.addSavingObs(savings);
    fallback();
    return withUserId(
      this.afAuth,
      uid => {
        const savingsObj = { value: savings, uid };
        return from(this.savingCollection.doc(uid).set(savingsObj)).pipe(
          map(() => savings)
        );
      },
      fallback,
      fallback
    );
  }

  getSavings(): Observable<number> {
    const fallback = () => this.savingStoreService.getSavingObs();
    const request = (uid: string) =>
      this.fireStore
        .doc<Savings>(`savings/${uid}`)
        .valueChanges()
        .pipe(
          map(v => v?.value || 0),
          tap(value => this.savingStoreService.addSavingObs(value))
        );
    return withUserId(this.afAuth, request, fallback, fallback);
  }
}
