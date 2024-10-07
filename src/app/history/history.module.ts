import { NgModule } from '@angular/core';
import { HistoryComponent } from './history.component';
import { RouterModule } from '@angular/router';
import { HistoryRoutingModule } from './history-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaIconComponent, FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DateFilterComponent } from "../common/component/filter/date-filter.component";
import { DateFilterService } from '../common/component/filter/date-filter.service';

@NgModule({
  declarations: [HistoryComponent],
  imports: [RouterModule, HistoryRoutingModule, CommonModule, FormsModule, FontAwesomeModule, DateFilterComponent],
  providers: [DateFilterService],
})
export class HistoryModule {}
