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
    if ('serviceWorker' in navigator) {
      const controller = navigator.serviceWorker.controller;
      if (controller) {
        try {
          controller.postMessage({
            type: 'SHOW_BUDGET_NOTIFICATION',
            payload: { title, body: cleanMessage, tag }
          });
          return of(undefined);
        } catch (e) {
          console.warn('[NotificationService] SW postMessage failed, fallback to window Notification', e);
        }
      } else {
        // Wait for controller (first load after registration) then send
        const sendLater = () => {
          const c = navigator.serviceWorker.controller;
            if (c) {
              try {
                c.postMessage({
                  type: 'SHOW_BUDGET_NOTIFICATION',
                  payload: { title, body: cleanMessage, tag }
                });
              } catch (e) {
                console.warn('[NotificationService] delayed SW postMessage failed', e);
              }
            }
        };
        navigator.serviceWorker.addEventListener('controllerchange', sendLater, { once: true });
        // We still return; no immediate notification until controller takes control.
        return of(undefined);
      }
    }

    // Fallback: page-created notification (click only works while tab alive)
    try {
      const notification = new Notification(title, {
        body: cleanMessage,
        icon: 'favicon2.ico', // relative so works under /expenses/ and local preview
        badge: 'favicon2.ico',
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

  /** Convenience wrapper for budget summary notifications ensuring permission and SW delivery. */
  showBudgetNotification(title: string, htmlMessage: string) {
    return this.showBrowserNotification(title, htmlMessage, { tag: 'app-expenses-budget-summary' });
  }

  /** Clear existing notifications (optionally by tag) via Service Worker. */
  clearNotifications(tag?: string) {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      try {
        navigator.serviceWorker.controller.postMessage({
          type: 'CLEAR_NOTIFICATIONS',
          payload: { tag }
        });
      } catch (e) {
        console.warn('[NotificationService] CLEAR_NOTIFICATIONS postMessage failed', e);
      }
    }
  }

  /** Convenience: clear existing budget summary notification then show a fresh one. */
  showBudgetNotificationFresh(title: string, htmlMessage: string) {
    this.clearNotifications('app-expenses-budget-summary');
    return this.showBudgetNotification(title, htmlMessage);
  }

  /** Atomically replace existing budget notification via single SW message. */
  showReplacingBudgetNotification(title: string, htmlMessage: string) {
    const tag = 'app-expenses-budget-summary';
    const cleanMessage = htmlMessage.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ');
    if ('serviceWorker' in navigator) {
      const send = () => {
        try {
          navigator.serviceWorker.controller?.postMessage({
            type: 'SHOW_REPLACING_NOTIFICATION',
            payload: { title, body: cleanMessage, tag }
          });
        } catch (e) {
          console.warn('[NotificationService] SHOW_REPLACING_NOTIFICATION failed', e);
          // Fallback: clear then show using existing flow
          this.showBudgetNotificationFresh(title, htmlMessage);
        }
      };
      if (navigator.serviceWorker.controller) {
        send();
        return of(undefined);
      }
      navigator.serviceWorker.addEventListener('controllerchange', () => send(), { once: true });
      return of(undefined);
    }
    return this.showBudgetNotificationFresh(title, htmlMessage);
  }
}
