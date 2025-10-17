import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  SegmentedSwitchComponent,
  SegmentedOption,
} from '../component/segmented/segmented-switch.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { IrregularBudgetService } from '../service/irregular-budget.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Budget } from '../model/budget.model';

interface CalendarDay {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isWeekend: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, SegmentedSwitchComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  animations: [
    trigger('dayAppear', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(.92)' }),
        animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class CalendarComponent implements OnDestroy {
  @Input() selectedDate: Date = new Date();
  @Output() dateChange = new EventEmitter<Date>();
  @Output() close = new EventEmitter<void>();
  @Output() today = new EventEmitter<Date>();

  private unsubscribe: Subject<void> = new Subject();

  viewDate: Date = new Date();
  weeks: CalendarDay[][] = [];
  weekDayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  // mode switching between standard calendar month and irregular budget period
  calendarModes: SegmentedOption[] = [
    { value: 'period', label: 'Бюджет' },
    { value: 'month', label: 'Месяц' },
  ];
  mode: 'month' | 'period' = 'period';
  @Output() modeChange = new EventEmitter<'month' | 'period'>();

  // irregular budget period boundaries (computed from Budget.periodStartTs + period days)
  budgetStart?: Date;
  budgetEnd?: Date;
  private currentBudget?: Budget;

  constructor(private irregularBudgetService: IrregularBudgetService) {}

  ngOnInit() {
    this.viewDate = new Date(this.selectedDate);
    this.generate();
    this.listenIrregularBudget();
  }

  ngOnChanges() {
    this.viewDate = new Date(this.selectedDate);
    this.generate();
  }

  private listenIrregularBudget() {
    this.irregularBudgetService
      .getValue()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(budget => {
        this.currentBudget = { ...budget, period: budget.period };
        this.computeBudgetFrame();
        if (this.mode === 'period') {
          this.generatePeriod();
        }
      });
  }

  private computeBudgetFrame() {
    const b = this.currentBudget;
    if (!b) {
      this.budgetStart = undefined;
      this.budgetEnd = undefined;
      return;
    }
    const periodDays = b.period && b.period > 0 ? Math.floor(b.period) : 30;
    if (b.periodStartTs && !isNaN(b.periodStartTs)) {
      const start = new Date(b.periodStartTs);
      const finish = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate() + periodDays - 1,
        23,
        59,
        59,
        999
      );
      this.budgetStart = start;
      this.budgetEnd = finish;
    } else {
      // Fallback: rolling frame ending today inclusive
      const today = new Date();
      const start = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - (periodDays - 1)
      );
      const finish = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999
      );
      this.budgetStart = start;
      this.budgetEnd = finish;
    }
  }

  onModeSelect(value: string) {
    if (value === this.mode) return;
    this.mode = value as 'month' | 'period';
    this.modeChange.emit(this.mode);
    if (this.mode === 'month') {
      this.viewDate = new Date(this.selectedDate);
      this.generate();
    } else {
      this.generatePeriod();
    }
  }

  private generatePeriod() {
    if (!this.budgetStart || !this.budgetEnd) {
      this.weeks = [];
      return;
    }
    // include one extra week before and after
    const start = new Date(
      this.budgetStart.getFullYear(),
      this.budgetStart.getMonth(),
      this.budgetStart.getDate()
    );
    const end = new Date(
      this.budgetEnd.getFullYear(),
      this.budgetEnd.getMonth(),
      this.budgetEnd.getDate()
    );
    const extendedStart = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() - 7
    );
    const extendedEnd = new Date(
      end.getFullYear(),
      end.getMonth(),
      end.getDate() + 7
    );
    const today = new Date();
    const weeks: CalendarDay[][] = [];
    let current = new Date(extendedStart);
    let week: CalendarDay[] = [];
    while (current <= extendedEnd) {
      const weekday = (current.getDay() + 6) % 7; // Monday=0
      if (week.length === 0 && weekday > 0) {
        // pad start with blanks
        for (let i = 0; i < weekday; i++) {
          week.push({
            date: new Date(
              current.getFullYear(),
              current.getMonth(),
              current.getDate() - (weekday - i)
            ),
            inMonth: false,
            isToday: false,
            isSelected: false,
            isWeekend: false,
          });
        }
      }
      week.push({
        date: new Date(current),
        inMonth: true,
        isToday: this.isSameDate(current, today),
        isSelected: this.isSameDate(current, this.selectedDate),
        isWeekend: this.isWeekend(current),
      });
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
      current = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate() + 1
      );
    }
    if (week.length) {
      while (week.length < 7) {
        const last = week[week.length - 1].date;
        const nxt = new Date(
          last.getFullYear(),
          last.getMonth(),
          last.getDate() + 1
        );
        week.push({
          date: nxt,
          inMonth: false,
          isToday: this.isSameDate(nxt, today),
          isSelected: this.isSameDate(nxt, this.selectedDate),
          isWeekend: this.isWeekend(nxt),
        });
      }
      weeks.push(week);
    }
    this.weeks = weeks;
  }

  prevMonth() {
    this.viewDate = new Date(
      this.viewDate.getFullYear(),
      this.viewDate.getMonth() - 1,
      1
    );
    this.generate();
  }

  nextMonth() {
    this.viewDate = new Date(
      this.viewDate.getFullYear(),
      this.viewDate.getMonth() + 1,
      1
    );
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
    // if (!day.inMonth) return;
    // this.selectedDate = day.date;
    // this.dateChange.emit(day.date);
    // this.generate();
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
      const date = new Date(
        year,
        month - 1,
        prevMonthLastDate - prevMonthDays + i + 1
      );
      week.push({
        date,
        inMonth: false,
        isToday: this.isSameDate(date, today),
        isSelected: this.isSameDate(date, this.selectedDate),
        isWeekend: this.isWeekend(date),
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
        isSelected: this.isSameDate(date, this.selectedDate),
        isWeekend: this.isWeekend(date),
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
        isSelected: this.isSameDate(date, this.selectedDate),
        isWeekend: this.isWeekend(date),
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
          isSelected: this.isSameDate(date, this.selectedDate),
          isWeekend: this.isWeekend(date),
        });
        nextMonthDay++;
      }
      weeks.push(week);
    }

    this.weeks = weeks;
  }

  private isSameDate(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  private isWeekend(date: Date): boolean {
    const day = date.getDay();
    // Saturday (6) or Sunday (0)
    return day === 6 || day === 0;
  }

  get monthLabel(): string {
    if (this.mode === 'period' && this.budgetStart && this.budgetEnd) {
      const fmtShort = new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'short',
      });
      const start = fmtShort.format(this.budgetStart);
      const end = fmtShort.format(this.budgetEnd);
      const days = Math.ceil(
        (this.budgetEnd.getTime() - this.budgetStart.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      return `${start} – ${end} (${days - 1}д)`;
    }
    return new Intl.DateTimeFormat('ru-RU', {
      month: 'long',
      year: 'numeric',
    }).format(this.viewDate);
  }

  // Period highlighting helpers
  isInBudgetCore(d: Date): boolean {
    if (!this.budgetStart || !this.budgetEnd) return false;
    const time = d.getTime();
    return (
      time >= this.budgetStart.getTime() && time <= this.budgetEnd.getTime()
    );
  }

  isInBudgetBuffer(d: Date): boolean {
    if (!this.budgetStart || !this.budgetEnd) return false;
    // buffer defined as +/- 7 days window around core we actually rendered
    const bufferStart = this.budgetStart.getTime() - 7 * 24 * 60 * 60 * 1000;
    const bufferEnd = this.budgetEnd.getTime() + 7 * 24 * 60 * 60 * 1000;
    const time = d.getTime();
    return time >= bufferStart && time <= bufferEnd;
  }

  isBudgetCorePast(d: Date): boolean {
    if (!this.isInBudgetCore(d)) return false;
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();
    return d.getTime() < startOfToday;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
