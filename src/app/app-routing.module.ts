import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'history',
    loadComponent: () =>
      import('./history/history.component').then(m => m.HistoryComponent),
    data: { animation: 'history' },
  },
  {
    path: 'statistics',
    loadComponent: () =>
      import('./statistics/statistics.component').then(
        m => m.StatisticsComponent
      ),
    data: { animation: 'statistics' },
  },
  {
    path: 'export',
    loadComponent: () =>
      import('./export/export.component').then(m => m.ExportComponent),
    data: { animation: 'export' },
  },
  {
    path: 'period-summary',
    loadComponent: () =>
      import('./period-summary/period-summary.component').then(m => m.PeriodSummaryComponent),
    data: { animation: 'period-summary' },
  },
  {
    path: 'br-notification-redirect',
    loadComponent: () =>
      import('./br-notification-redirect/br-notification-redirect.component').then(
        m => m.BrNotificationRedirectComponent
      ),
    data: { animation: 'redirect' },
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./expense/expense.component').then(m => m.ExpenseComponent),
    data: { animation: 'no-animation' },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      scrollPositionRestoration: 'enabled', // Ensures we start at top when navigating to a new route
      anchorScrolling: 'disabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
