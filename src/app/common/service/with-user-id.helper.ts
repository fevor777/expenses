import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, switchMap, catchError } from 'rxjs';

// Generic higher-order helper to project authenticated user id or fallback.
export function withUserId<T>(
  afAuth: AngularFireAuth,
  request: (uid: string) => Observable<T>,
  fallback: () => Observable<T>,
  onError?: () => Observable<T>
): Observable<T> {
  return afAuth.authState.pipe(
    switchMap(user => (user ? request(user.uid) : fallback())),
    catchError((e) => { 
      console.error('Error:', e);
      if (onError) {
        return onError();
      }
      return fallback();
    })
  );
}
