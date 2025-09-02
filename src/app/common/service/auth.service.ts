import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, User } from 'firebase/auth';
import { Observable, from, of, tap, catchError, BehaviorSubject, filter, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: User;

  constructor(private afAuth: AngularFireAuth) {
  }

  signInWithGoogle() {
    const anyWindow: any = window as any;
    const isAndroidWebView = location.protocol === 'file:' && /Android/.test(navigator.userAgent) && /wv/.test(navigator.userAgent);
    const invokeNative = () => {
      try {
        anyWindow?.NativeAuth?.requestGoogleSignIn?.();
        return true;
      } catch (e) {
        return false;
      }
    };
    if (anyWindow?.NativeAuth?.requestGoogleSignIn) {
      invokeNative();
      return of(null);
    }
    if (isAndroidWebView) {
      // Retry a few times waiting for JS interface
      let attempts = 0;
      const max = 5;
      const interval = 250;
      const tryLater = (observer) => {
        if (invokeNative()) { observer.next(null); observer.complete(); return; }
        attempts++;
        if (attempts < max) setTimeout(() => tryLater(observer), interval); else {
          observer.next(null); observer.complete();
        }
      };
      return new Observable(sub => { tryLater(sub); });
    }
    // Web fallback
    return from(this.afAuth.signInWithPopup(new GoogleAuthProvider())).pipe(
      tap(res => { if (res?.user) { this.updateUser(res.user); } }),
      catchError(err => { console.error('[AuthService] signInWithPopup error'); return of(null); })
    );
  }

  signOut() {
    return this.afAuth.signOut().then(() => {
      // Optimistically clear current user immediately; authState will confirm.
      this.updateUser(null as any);
    });
  }

  updateUser(user: User) {
    this.user = user;
  }

  private attachNativeTokenHandler() {
    const anyWindow: any = window as any;
    if (!anyWindow.onNativeGoogleIdToken) {
      anyWindow.onNativeGoogleIdToken = (idToken: string) => {
        if (!idToken) { console.error('[AuthService] Empty idToken from native'); return; }
        const cred = GoogleAuthProvider.credential(idToken);
        this.afAuth.signInWithCredential(cred)
          .then(res => {
            if (res?.user) {
              this.updateUser(res.user);
              // Force full reload so services/components re-run constructors with user present (no other service edits)
              setTimeout(() => { try { window.location.reload(); } catch (_) { } }, 100);
            }
          })
          .catch(e => console.error('[AuthService] signInWithCredential failed', e));
      };
    }
  }
  private _init = this.attachNativeTokenHandler();
}
