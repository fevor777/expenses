import { Component, OnDestroy } from '@angular/core';
import { NotificationService } from './notification.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
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
    }, 5000);
  }

  onCloseNotification() {
    this.show = false;
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
