import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class NotificationComponent implements OnDestroy {
  message = '';
  show = false;

  private readonly destroySubject: Subject<void> = new Subject();

  constructor(private notificationService: NotificationService) {
    this.notificationService.message$
      .pipe(takeUntil(this.destroySubject))
      .subscribe((message) => {
        this.showMessage(message);
      });
  }

  showMessage(message: string) {
    this.message = message;
    this.show = true;
    setTimeout(() => {
      this.show = false;
    }, 60000);
  }

  onCloseNotification() {
    this.show = false;
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
