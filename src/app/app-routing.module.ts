import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DetailsComponent } from './details/details.component';
import { ExportComponent } from './export/export.component';

const routes: Routes = [
  {
    path: 'history',
    loadChildren: () =>
      import('./history/history.module').then((m) => m.HistoryModule),
  },
  {
    path: 'statistics',
    loadComponent: () =>
      import('./statistics/statistics.component').then(
        (m) => m.StatisticsComponent
      ),
  },
  {
    path: 'export',
    component: ExportComponent,
  },
  {
    path: 'details',
    component: DetailsComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./expense/expense.component').then((m) => m.ExpenseComponent),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
