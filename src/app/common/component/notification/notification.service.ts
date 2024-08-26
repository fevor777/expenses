import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly messageSubject: Subject<string> = new Subject<string>();
  readonly message$ = this.messageSubject.asObservable();

  showMessage(message: string) {
    this.messageSubject.next(message);
  }
}
