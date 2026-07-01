import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, Observable, switchMap, catchError, take } from 'rxjs';

// Generic higher-order helper to project authenticated user id or fallback.
export function withUserId<T>(
  afAuth: AngularFireAuth,
  request: (uid: string) => Observable<T>,
  fallback: () => Observable<T>,
  onError?: () => Observable<T>
): Observable<T> {
  return afAuth.authState.pipe(
    take(1),
    switchMap(user => {
      if (user) {
        return request(user.uid);
      }

      // authState can be transiently null during startup; re-check resolved currentUser.
      return from(afAuth.currentUser).pipe(
        switchMap(currentUser =>
          currentUser ? request(currentUser.uid) : fallback()
        )
      );
    }),
    catchError((e) => { 
      console.error('Error:', e);
      if (onError) {
        return onError();
      }
      return fallback();
    })
  );
}
