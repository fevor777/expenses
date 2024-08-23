import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseComponent } from './expense/expense.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
  {
    path: 'history',
    loadChildren: () =>
      import('./history/history.module').then((m) => m.HistoryModule),
  },
  {
    path: 'statistics',
    component: StatisticsComponent,
  },
  {
    path: 'details',
    component: DetailsComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    component: ExpenseComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
