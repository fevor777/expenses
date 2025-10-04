import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-expense-header',
  templateUrl: './expense-header.component.html',
  styleUrls: ['./expense-header.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ExpenseHeaderComponent implements OnInit {
  @Input() currentAmount: number = 0;
  @Input() currentBalanceAmount: number = 0;
  @Input() balance: number = 0;
  @Input() balanceDate: string = '';

  // Current date for header display
  today: Date = new Date();
  // Russian formatted date: weekday, day, month (e.g., "суббота, 4 октября")
  todayLabel: string = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    weekday: 'long',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  @Output() menuIconClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() historyIconClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() statisticsIconClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() detailsIconClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() balanceChange: EventEmitter<number> = new EventEmitter<number>();

  isShowCurrentBalanceAmount: boolean = false;

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
}
