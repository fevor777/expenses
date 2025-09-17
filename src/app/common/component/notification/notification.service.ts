import { Injectable } from '@angular/core';
import { Subject, Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface NotificationPayload {
  message: string;
  type?: 'info' | 'success' | 'error' | 'warning';
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

  constructor() {
    this.checkNotificationPermission();
  }

  showMessage(message: string, type: NotificationPayload['type'] = 'info') {
    // For backward compatibility keep emitting plain string when type is info and no HTML semantics needed
    if (type === 'info') {
      this.messageSubject.next(message);
    } else {
      this.messageSubject.next({ message, type });
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
    
    const notification = new Notification(title, {
      body: cleanMessage,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    });

    // Auto-close after 5 seconds
    // setTimeout(() => {
    //   notification.close();
    // }, 5000);

    return of(undefined);
  }

  private checkNotificationPermission(): void {
    if ('Notification' in window) {
      this.browserNotificationPermission = Notification.permission;
    }
  }
}
