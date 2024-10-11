import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { DateFilterComponent } from '../common/component/filter/date-filter.component';
import { HistoryRoutingModule } from './history-routing.module';
import { HistoryComponent } from './history.component';

@NgModule({
  declarations: [HistoryComponent],
  imports: [RouterModule, HistoryRoutingModule, CommonModule, FormsModule, FontAwesomeModule, DateFilterComponent],
})
export class HistoryModule {}
