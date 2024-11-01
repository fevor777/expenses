import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';
import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule } from '@angular/platform-browser';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { take, tap } from 'rxjs';

import { firebaseConfig } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotificationComponent } from './common/component/notification/notification.component';
import { CustomHammerConfig } from './common/custom-hammer.config';
import { AuthService } from './common/service/auth.service';
import { BalanceService } from './common/service/balance.service';

export class HammerConfig extends HammerGestureConfig {
  override = {
    swipe: { direction: Hammer.DIRECTION_ALL },
    press: { time: 500 },
  };
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HammerModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    NotificationComponent,
],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: CustomHammerConfig,
    },
    provideCharts(withDefaultRegisterables()),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (authService: AuthService) => {
        return () =>
          authService.user$.pipe(
            take(1),
            tap((user) => authService.updateUser(user))
          );
      },
      deps: [AuthService],
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (balanceService: BalanceService) => {
        return () =>
          balanceService.getBalance().pipe(
            take(1),
            tap((balance) => localStorage.setItem('balance', balance?.toString() || '0'))
          );
      },
      deps: [BalanceService],
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
