import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'history',
    loadComponent: () =>
      import('./history/history.component').then(m => m.HistoryComponent),
  },
  {
    path: 'statistics',
    loadComponent: () =>
      import('./statistics/statistics.component').then(
        m => m.StatisticsComponent
      ),
  },
  {
    path: 'export',
    loadComponent: () =>
      import('./export/export.component').then(m => m.ExportComponent),
  },
  {
    path: 'period-summary',
    loadComponent: () =>
      import('./period-summary/period-summary.component').then(m => m.PeriodSummaryComponent),
  },
  {
    path: 'br-notification-redirect',
    loadComponent: () =>
      import('./br-notification-redirect/br-notification-redirect.component').then(
        m => m.BrNotificationRedirectComponent
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./expense/expense.component').then(m => m.ExpenseComponent),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
