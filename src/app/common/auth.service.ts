import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, User } from 'firebase/auth';
import { Observable, from, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User>;
  user: User;

  constructor(private afAuth: AngularFireAuth) {
    this.user$ = this.afAuth.authState.pipe(
      tap((user) => this.updateUser(user))
    );
  }

  signInWithGoogle() {
    return from(this.afAuth.signInWithPopup(new GoogleAuthProvider()));
  }

  signOut() {
    return this.afAuth.signOut();
  }

  updateUser(user: User) {
    this.user = user;
  }
}
