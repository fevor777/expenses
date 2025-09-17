import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

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
}
