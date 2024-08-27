import { NgModule } from '@angular/core';
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
  HammerGestureConfig,
  HammerModule,
} from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    HammerModule,
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: CustomHammerConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
