import { NgModule } from '@angular/core';
import { HistoryComponent } from './history.component';
import { RouterModule } from '@angular/router';
import { HistoryRoutingModule } from './history-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [HistoryComponent],
  imports: [RouterModule, HistoryRoutingModule, CommonModule],
})
export class HistoryModule {}
