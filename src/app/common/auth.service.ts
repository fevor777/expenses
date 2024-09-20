import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<any>;

  constructor(private afAuth: AngularFireAuth) {
    this.user$ = this.afAuth.authState; // Observable to track user auth state
  }

  // Google sign-in
  signInWithGoogle() {
    return this.afAuth.signInWithPopup(new GoogleAuthProvider());
  }

  // Sign out
  signOut() {
    return this.afAuth.signOut();
  }
}
