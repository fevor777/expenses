import { Injectable } from '@angular/core';
import { Subject, Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SummaryBuildResult } from '../../service/expense-summary.service';

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
  
  summaryBuildResultCache: SummaryBuildResult;

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

    const notification = new Notification(title, {
      body: cleanMessage,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag,
      data: {
        ...(options as any)?.data,
        route: '/expenses/#/' // target route for click navigation (hash routing root)
      },
      ...options,
    });

    // Click handler: navigate to /expenses root (hash '/') and attempt to keep notification (browser may still auto-close)
    notification.onclick = (event: Event) => {
      try {
        // Bring window to front
        window.focus();
        const target = '/expenses/#/';
        // If already on /expenses path just adjust hash
        if (!location.pathname.endsWith('/expenses/') || location.hash !== '#/') {
          // Use direct location change to avoid needing Angular Router here
          location.href = target;
        }
        // Do NOT call notification.close(); we want to keep it if browser allows
      } catch (err) {
        console.warn('Notification click navigation failed', err);
      }
    };

    return of(undefined);
  }

  private checkNotificationPermission(): void {
    if ('Notification' in window) {
      this.browserNotificationPermission = Notification.permission;
    }
  }
}
