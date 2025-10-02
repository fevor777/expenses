import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExpenseSummaryService } from '../common/service/expense-summary.service';
import { Subject } from 'rxjs';

/**
 * Route component whose sole responsibility is to trigger a browser budget summary notification
 * and then redirect user back to the main page. Useful for external automation / deep linking
 * (e.g., opening a special URL to refresh notification state).
 */
@Component({
  standalone: true,
  selector: 'app-br-notification-redirect',
  imports: [CommonModule],
  template: ``,
})
export class BrNotificationRedirectComponent implements OnInit, OnDestroy {
  private readonly summary = inject(ExpenseSummaryService);
  private readonly router = inject(Router);

  private readonly destroySubject: Subject<void> = new Subject();

  ngOnInit(): void {
    // Trigger notification build + send; then navigate home regardless of outcome
    this.summary.sendBrowserNotificationWithBudgetSummary().subscribe({
      next: () => this.safeRedirect(),
      error: () => this.safeRedirect(),
    });
  }

  private safeRedirect() {
    // Using hash routing root
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
