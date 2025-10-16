import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
  group,
  state,
} from '@angular/animations';
import { CalendarComponent } from '../../common/calendar/calendar.component';
import { SpinnerComponent } from '../../common/component/spinner/spinner.component';
import { NotificationService } from '../../common/component/notification/notification.service';

@Component({
  selector: 'app-expense-header',
  templateUrl: './expense-header.component.html',
  styleUrls: ['./expense-header.component.scss'],
  standalone: true,
  imports: [CommonModule, CalendarComponent, SpinnerComponent],
  animations: [
    trigger('amountSwap', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(6px) scale(.94)' }),
        animate(
          '130ms ease-out',
          style({ opacity: 1, transform: 'translateY(0) scale(1)' })
        ),
      ]),
      transition(':leave', [
        group([
          animate(
            '100ms ease-out',
            style({ opacity: 0, transform: 'translateY(-4px) scale(.94)' })
          ),
        ]),
      ]),
    ]),
    trigger('amountValueChange', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(.92)' }),
        animate('120ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('80ms ease-in', style({ opacity: 0, transform: 'scale(.92)' })),
      ]),
    ]),
    trigger('amountFlash', [
      transition(':enter', [
        style({ filter: 'brightness(1.25)', opacity: 0.85 }),
        animate(
          '260ms ease-out',
          style({ filter: 'brightness(1)', opacity: 1 })
        ),
      ]),
    ]),
  ],
})
export class ExpenseHeaderComponent implements OnInit {
  @Input() currentAmount: number = 0;
  @Input() currentBalanceAmount: number = 0;
  @Input() balance: number = 0;
  @Input() balanceDate: string = '';
  // External loading flag (parent controls) for amount area spinner
  @Input() amountLoading: boolean = false;

  // Current date for header display
  today: Date = new Date();
  // Russian formatted date: weekday, day, month (e.g., "суббота, 4 октября")
  todayLabel: string = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    weekday: 'long',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  // Calendar state
  showCalendar: boolean = false;
  selectedDate: Date = new Date();
  // Clicking the date label toggles an inline calendar overlay (auto closes on selection)

  @Output() menuIconClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() historyIconClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() statisticsIconClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() detailsIconClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() balanceChange: EventEmitter<number> = new EventEmitter<number>();

  isShowCurrentBalanceAmount: boolean = false;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    const localStorageIsShowCurrentBalanceAmount =
      localStorage.getItem('isShowCurrentBalanceAmount') || 'false';
    this.isShowCurrentBalanceAmount = JSON.parse(
      localStorageIsShowCurrentBalanceAmount
    );
  }

  onMenuIconClick(): void {
    this.menuIconClick.emit();
  }

  onHistoryIconClick(): void {
    this.historyIconClick.emit();
  }

  onStatisticsIconClick(): void {
    this.statisticsIconClick.emit();
  }

  onDetailsIconClick(): void {
    this.detailsIconClick.emit();
  }

  onCurrentAmountClick(): void {
    this.isShowCurrentBalanceAmount = !this.isShowCurrentBalanceAmount;
    localStorage.setItem(
      'isShowCurrentBalanceAmount',
      this.isShowCurrentBalanceAmount.toString()
    );
  }

  onBalanceChange(): void {
    const newBalance = prompt('Enter new balance', this.balance.toString());
    if (Number(newBalance)) {
      this.balanceChange.emit(Number(newBalance));
    }
  }

  onHeaderBottomClick(): void {
    this.notificationService.hide();
    this.showCalendar = !this.showCalendar;
  }

  onCalendarClose(): void {
    this.showCalendar = false;
  }
}
