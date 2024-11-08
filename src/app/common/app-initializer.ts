import { first, tap } from 'rxjs';

import { AuthService } from './service/auth.service';

export const appInitializer = (authService: AuthService) => {
  return () =>
    authService.user$.pipe(
      first(),
      tap((user) => authService.updateUser(user))
    );
};
