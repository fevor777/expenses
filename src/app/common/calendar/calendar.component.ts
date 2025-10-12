import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

interface CalendarDay {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  @Input() selectedDate: Date = new Date();
  @Output() dateChange = new EventEmitter<Date>();
  @Output() close = new EventEmitter<void>();
  @Output() today = new EventEmitter<Date>();

  viewDate: Date = new Date();
  weeks: CalendarDay[][] = [];
  weekDayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  ngOnInit() {
    this.viewDate = new Date(this.selectedDate);
    this.generate();
  }

  ngOnChanges() {
    this.viewDate = new Date(this.selectedDate);
    this.generate();
  }

  prevMonth() {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
    this.generate();
  }

  nextMonth() {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
    this.generate();
  }

  goToday() {
    const now = new Date();
    this.viewDate = new Date(now.getFullYear(), now.getMonth(), 1);
    this.selectedDate = now;
    this.today.emit(now);
    this.generate();
  }

  onClose() {
    this.close.emit();
  }

  selectDay(day: CalendarDay) {
    if (!day.inMonth) return;
    this.selectedDate = day.date;
    this.dateChange.emit(day.date);
    this.generate();
  }

  private generate() {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startDay = (firstOfMonth.getDay() + 6) % 7; // make Monday=0
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    const weeks: CalendarDay[][] = [];
    let currentDayCounter = 1;

    // Previous month days to fill first week
    const prevMonthDays = startDay;
    const prevMonthLastDate = new Date(year, month, 0).getDate();

    let week: CalendarDay[] = [];

    for (let i = 0; i < prevMonthDays; i++) {
      const date = new Date(year, month - 1, prevMonthLastDate - prevMonthDays + i + 1);
      week.push({
        date,
        inMonth: false,
        isToday: this.isSameDate(date, today),
        isSelected: this.isSameDate(date, this.selectedDate)
      });
    }

    while (currentDayCounter <= daysInMonth) {
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
      const date = new Date(year, month, currentDayCounter);
      week.push({
        date,
        inMonth: true,
        isToday: this.isSameDate(date, today),
        isSelected: this.isSameDate(date, this.selectedDate)
      });
      currentDayCounter++;
    }

    // Fill remaining days with next month
    let nextMonthDay = 1;
    while (week.length < 7) {
      const date = new Date(year, month + 1, nextMonthDay);
      week.push({
        date,
        inMonth: false,
        isToday: this.isSameDate(date, today),
        isSelected: this.isSameDate(date, this.selectedDate)
      });
      nextMonthDay++;
    }
    weeks.push(week);

    // Possibly an extra week if days overflow
    while (weeks.length < 6) {
      week = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(year, month + 1, nextMonthDay);
        week.push({
          date,
          inMonth: false,
          isToday: this.isSameDate(date, today),
          isSelected: this.isSameDate(date, this.selectedDate)
        });
        nextMonthDay++;
      }
      weeks.push(week);
    }

    this.weeks = weeks;
  }

  private isSameDate(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  get monthLabel(): string {
    return new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(this.viewDate);
  }
}
