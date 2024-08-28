import { NgModule } from '@angular/core';
import { HistoryComponent } from './history.component';
import { RouterModule } from '@angular/router';
import { HistoryRoutingModule } from './history-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaIconComponent, FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [HistoryComponent],
  imports: [RouterModule, HistoryRoutingModule, CommonModule, FormsModule, FontAwesomeModule],
})
export class HistoryModule {}
