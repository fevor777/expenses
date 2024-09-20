import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, map, Observable, of } from 'rxjs';

import { AuthService } from './auth.service';
import { Savings } from './saving.model';

@Injectable({
  providedIn: 'root',
})
export class SavingService {
  private savingCollection;

  constructor(
    private fireStore: AngularFirestore,
    private authService: AuthService
  ) {
    this.savingCollection = this.fireStore.collection<Savings>('savings');
  }

  addSaving(savings: number): Observable<number> {
    if (this.authService.user) {
      const uid = this.authService.user.uid;
      const savingsObj = { value: savings, uid: this.authService.user.uid };
      return from(this.savingCollection.doc(uid).set(savingsObj)).pipe(map(() => savings));
    } else {
      localStorage.setItem('savings', savings.toString());
      return of(savings);
    }
  }

  getSavings(): Observable<number> {
    if (this.authService.user) {
      const uid = this.authService.user.uid;
      return this.fireStore
        .doc<Savings>(`savings/${uid}`)
        .valueChanges()
        .pipe(map((v) => v?.value || 0));
    } else {
      return of(Number(localStorage.getItem('savings')) || 0);
    }
  }
}
