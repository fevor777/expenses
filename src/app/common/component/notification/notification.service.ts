import { Injectable } from '@angular/core';
import { Subject, Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BudgetSummaryBuildResult } from '../../service/budget-summary.service';

export interface NotificationPayload {
  message: string;
  type?: 'info' | 'success' | 'error' | 'warning';
  /** Optional context tag to allow component to render extra UI */
  context?: string; // e.g. 'expense-added'
  /** When context === 'expense-added', full expense object can be passed */
  // Using any to avoid circular import / heavyweight typing here
  expense?: any;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly messageSubject: Subject<string | NotificationPayload> =
    new Subject();
  readonly message$ = this.messageSubject.asObservable();

  private readonly hideSubject: Subject<void> = new Subject();
  readonly hide$ = this.hideSubject.asObservable();

  private browserNotificationPermission: NotificationPermission = 'default';
  
  summaryBuildResultCache: BudgetSummaryBuildResult;

  constructor() {
    this.checkNotificationPermission();
  }

  showMessage(
    message: string,
    type: NotificationPayload['type'] = 'info',
    extras?: Pick<NotificationPayload, 'context' | 'expense'>
  ) {
    // Keep legacy simple string emission only if no context/expense provided
    if (type === 'info' && !extras?.context && !extras?.expense) {
      this.messageSubject.next(message);
    } else {
      this.messageSubject.next({ message, type, ...extras });
    }
  }

  show(payload: NotificationPayload) {
    this.messageSubject.next(payload);
  }

  hide() {
    this.hideSubject.next();
  }

  showBrowserNotification(title: string, message: string, options?: NotificationOptions): Observable<void> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return of(undefined);
    }

    // Request permission if not already granted
    if (this.browserNotificationPermission === 'default') {
      return from(Notification.requestPermission()).pipe(
        switchMap(permission => {
          this.browserNotificationPermission = permission;
          if (permission === 'granted') {
            return this.createNotification(title, message, options);
          }
          return of(undefined);
        })
      );
    }

    if (this.browserNotificationPermission === 'granted') {
      return this.createNotification(title, message, options);
    }

    return of(undefined);
  }

  private createNotification(title: string, message: string, options?: NotificationOptions): Observable<void> {
    // Strip HTML tags from message for browser notification
    const cleanMessage = message.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ');
    // Ensure a stable tag for replacement if caller did not provide one
    const tag = options?.tag || 'app-expenses-budget-summary';
    // Prefer Service Worker if active so click works when app closed
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      try {
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_BUDGET_NOTIFICATION',
          payload: { title, body: cleanMessage, tag }
        });
        return of(undefined);
      } catch (e) {
        console.warn('SW postMessage failed, falling back to window Notification', e);
      }
    }

    // Fallback: page-created notification (click only works while tab alive)
    try {
      const notification = new Notification(title, {
        body: cleanMessage,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag,
        ...options,
      });
      notification.onclick = () => {
        try {
          window.focus();
          const target = '/expenses/#/br-notification-redirect';
          if (location.href !== target) {
            location.href = target;
          }
        } catch (e) {
          console.warn('Notification click navigation failed', e);
        }
      };
    } catch (e) {
      console.warn('Window Notification failed', e);
    }

    return of(undefined);
  }

  private checkNotificationPermission(): void {
    if ('Notification' in window) {
      this.browserNotificationPermission = Notification.permission;
    }
  }
}
