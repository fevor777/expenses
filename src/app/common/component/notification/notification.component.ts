import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { NotificationService } from './notification.service';

type NotificationVariant = 'info' | 'success' | 'error' | 'warning';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class NotificationComponent implements OnDestroy {
  message = '';
  show = false;
  hiding = false;
  variant: NotificationVariant = 'info';
  icon: string | null = null;

  private hideTimeout: any;
  private autoCloseMs = 60000; // shorter default for UX

  private readonly destroySubject: Subject<void> = new Subject();

  constructor(
    private notificationService: NotificationService,
    private router: Router,
  ) {
    this.notificationService.message$
      .pipe(takeUntil(this.destroySubject))
      .subscribe((payload: any) => {
        // Support both legacy string and new object payload
        if (typeof payload === 'string') {
          this.showMessage(payload, 'info');
        } else if (
          payload &&
          typeof payload === 'object' &&
          'message' in payload
        ) {
          this.showMessage(payload.message, (payload.type as any) || 'info');
        }
      });

    this.notificationService.hide$
      .pipe(takeUntil(this.destroySubject))
      .subscribe(() => this.startHide());
  }

  showMessage(message: string, variant: NotificationVariant = 'info') {
    this.clearPending();
    this.message = message;
    this.variant = variant;
    this.icon = this.resolveIcon(variant);
    this.hiding = false;
    this.show = true;
    this.hideTimeout = setTimeout(() => this.startHide(), this.autoCloseMs);
  }

  private resolveIcon(v: NotificationVariant): string | null {
    switch (v) {
      case 'success':
        return '&#10003;'; // check mark
      case 'error':
        return '&#9888;'; // warning symbol (triangle) could use 26A0; or heavy X
      case 'warning':
        return '&#9888;';
      case 'info':
      default:
        return '&#9432;'; // info symbol
    }
  }

  private startHide() {
    if (!this.show) return;
    this.hiding = true;
    // allow animation to finish
    setTimeout(() => {
      this.show = false;
      this.hiding = false;
    }, 250);
  }

  onCloseNotification() {
    this.startHide();
  }

  onNavigateDetails() {
    this.router.navigate(['/details']);
    this.startHide();
  }

  private clearPending() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  ngOnDestroy(): void {
    this.clearPending();
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
