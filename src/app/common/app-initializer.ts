import { switchMap, take, tap } from 'rxjs';

import { BalanceService } from './service/balance.service';
import { AuthService } from './service/auth.service';
import { BalanceStoreService } from './service/balance-store.service';

export const appInitializer = (
  authService: AuthService,
  balanceService: BalanceService,
  balanceStoreService: BalanceStoreService
) => {
  return () =>
    authService.user$.pipe(
      take(1),
      tap((user) => authService.updateUser(user)),
      switchMap(() => balanceService.getBalance()),
      take(1),
      tap((balance) => {
        balanceStoreService.updateBalance(balance);
      })
    );
};
