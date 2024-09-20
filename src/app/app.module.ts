import { NgModule } from '@angular/core';
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
  HammerGestureConfig,
  HammerModule,
} from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { firebaseConfig } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ExpenseComponent } from './expense/expense.component';
import { SwipeDirective } from './common/swipe.directive';
import { CustomHammerConfig } from './common/custom-hammer.config';
import { StatisticsComponent } from './statistics/statistics.component';
import { DetailsComponent } from './details/details.component';
import { CategoriesComponent } from './common/component/category/categories.component';
import { NotificationComponent } from './common/component/notification/notification.component';
import { StatisticsBarComponent } from './statistics/bar/statistics-bar.component';
import { BaseChartDirective } from 'ng2-charts';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ExportComponent } from './export/export.component';

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
    DetailsComponent,
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
    BaseChartDirective,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: CustomHammerConfig,
    },
    provideCharts(withDefaultRegisterables()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
