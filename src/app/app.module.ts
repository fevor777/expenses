import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';
import { FormsModule } from '@angular/forms';
import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { take, tap } from 'rxjs';

import { firebaseConfig } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './common/auth.service';
import { BalanceService } from './common/balance.service';
import { CategoriesComponent } from './common/component/category/categories.component';
import { BarChartComponent } from './common/component/chart/bar/bar-chart.component';
import { DateFilterComponent } from './common/component/filter/date/date-filter.component';
import { NotificationComponent } from './common/component/notification/notification.component';
import { CustomHammerConfig } from './common/custom-hammer.config';
import { CategoryListNamePipe } from './common/pipe/category-list-name.pipe';
import { SwipeDirective } from './common/swipe.directive';
import { ExpenseComponent } from './expense/expense.component';
import { ExportComponent } from './export/export.component';
import { StatisticsBarComponent } from './statistics/bar/statistics-bar.component';
import { StatisticsComponent } from './statistics/statistics.component';

export class HammerConfig extends HammerGestureConfig {
  override = {
    swipe: { direction: Hammer.DIRECTION_ALL },
    press: { time: 500 },
  };
}

@NgModule({
  declarations: [
    AppComponent,
    ExpenseComponent,
    SwipeDirective,
    StatisticsComponent,
    CategoriesComponent,
    NotificationComponent,
    StatisticsBarComponent,
    ExportComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    HammerModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    DateFilterComponent,
    CategoryListNamePipe,
    BarChartComponent,
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
