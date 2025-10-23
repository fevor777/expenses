// CLEAN REPLACEMENT FILE BELOW
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
import {
  BudgetSummaryService,
  BudgetSummaryBuildResult,
} from '../service/budget-summary.service';
import { trendIconByRatio } from '../model/budget-summary/budget-summary.br-notifi-formatter';
import { first, Subject, takeUntil } from 'rxjs';
import { Budget } from '../model/budget.model';

interface CalendarDay {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isWeekend: boolean;
  limitState?: 'under' | 'near' | 'over';
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, SegmentedSwitchComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnDestroy {
  @Input() selectedDate: Date = new Date();
  @Output() dateChange = new EventEmitter<Date>();
  @Output() close = new EventEmitter<void>();
  @Output() today = new EventEmitter<Date>();
  @Output() modeChange = new EventEmitter<'month' | 'period'>();

  private unsubscribe = new Subject<void>();

  viewDate: Date = new Date();
  weeks: CalendarDay[][] = [];
  weekDayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  show = false;

  calendarModes: SegmentedOption[] = [
    { value: 'period', label: 'Бюджет' },
    { value: 'month', label: 'Месяц' },
  ];
  mode: 'month' | 'period' = 'period';

  budgetStart?: Date;
  budgetEnd?: Date;
  private currentBudget?: Budget; // retained for potential future use
  private budgetSummaryResult?: BudgetSummaryBuildResult;
  private exhaustionDate?: Date;
  private perDaySpent = new Map<string, number>();
  private perDayBudget = new Map<string, number>(); // dynamic daily budget per core day

  // Budget strip variables
  summaryAvailable = false;
  stripSpentTotal = '';
  stripRemaining = '';
  stripDaysPassedFrame = '';
  stripDaysLeft = '';
  stripNeedPerDay = '';
  stripNeedIcon = '';
  stripAriaLabel = '';

  constructor(private budgetSummaryService: BudgetSummaryService) {}

  ngOnInit() {
    this.viewDate = new Date(this.selectedDate);
    this.generate();
    this.listenBudgetSummary();
  }

  ngOnChanges() {
    this.viewDate = new Date(this.selectedDate);
    this.generate();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private listenBudgetSummary() {
    this.budgetSummaryService
      .buildCurrentBudgetSummary()
      .pipe(first(), takeUntil(this.unsubscribe))
      .subscribe(result => {
        this.budgetSummaryResult = result;
        if (!result.summary) {
          this.mode = 'month';
          this.generate();
          this.clearBudgetStrip();
          return;
        }
        this.show = true;
        const startMs = result.summary.meta?.dateFrameStart;
        const finishMs = result.summary.meta?.dateFrameFinish;
        if (startMs && finishMs) {
          this.budgetStart = new Date(startMs);
          this.budgetEnd = new Date(finishMs);
        } else {
          this.budgetStart = undefined;
          this.budgetEnd = undefined;
        }
        this.computeBudgetStrip(result.summary);
        this.parseExhaustionDate(result.summary);
        this.buildPerDaySpentMap(result.summary);
        this.buildPerDayBudgetMap(result.summary);
        if (this.mode === 'period') this.generatePeriod();
      });
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
  selectDay(_day: CalendarDay) {
    /* selection disabled */
  }

  private generatePeriod() {
    if (!this.budgetStart || !this.budgetEnd) {
      this.weeks = [];
      return;
    }
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
        for (let i = 0; i < weekday; i++) {
          const padDate = new Date(
            current.getFullYear(),
            current.getMonth(),
            current.getDate() - (weekday - i)
          );
          week.push({
            date: padDate,
            inMonth: false,
            isToday: false,
            isSelected: false,
            isWeekend: false,
            limitState: undefined,
          });
        }
      }
      week.push({
        date: new Date(current),
        inMonth: true,
        isToday: this.isSameDate(current, today),
        isSelected: this.isSameDate(current, this.selectedDate),
        isWeekend: this.isWeekend(current),
        limitState: this.computeLimitState(current),
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
          limitState: undefined,
        });
      }
      weeks.push(week);
    }
    this.weeks = weeks;
  }

  private generate() {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startDay = (firstOfMonth.getDay() + 6) % 7; // Monday=0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const weeks: CalendarDay[][] = [];
    let currentDayCounter = 1;
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
        limitState: undefined,
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
        limitState: this.computeLimitState(date),
      });
      currentDayCounter++;
    }
    let nextMonthDay = 1;
    while (week.length < 7) {
      const date = new Date(year, month + 1, nextMonthDay);
      week.push({
        date,
        inMonth: false,
        isToday: this.isSameDate(date, today),
        isSelected: this.isSameDate(date, this.selectedDate),
        isWeekend: this.isWeekend(date),
        limitState: undefined,
      });
      nextMonthDay++;
    }
    weeks.push(week);
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
          limitState: undefined,
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
    return day === 6 || day === 0;
  }

  private fmtMoney(n?: number): string {
    if (n === undefined || n === null || isNaN(n)) return '0';
    const rounded =
      Math.abs(n - Math.round(n)) < 0.05 ? n.toFixed(0) : n.toFixed(1);
    return rounded.replace(/\.0$/, '');
  }
  private computeBudgetStrip(summary: any) {
    this.summaryAvailable = !!summary;
    if (!summary) {
      this.clearBudgetStrip();
      return;
    }
    this.stripSpentTotal = `${this.fmtMoney(summary.periodIrregular)}/${this.fmtMoney(summary.budget)}€`;
    this.stripRemaining = this.fmtMoney(summary.remaining);
    const passed = summary.meta?.daysPassed ?? 0;
    const frameDays = summary.meta?.frameDays ?? 0;
    this.stripDaysPassedFrame = `${passed}/${frameDays}`;
    this.stripDaysLeft = `${summary.daysLeft ?? 0}`;
    this.stripNeedPerDay = summary.needPerDay
      ? `${this.fmtMoney(summary.needPerDay)}€/д`
      : '';
    this.stripNeedIcon =
      summary.todaysNeedRatio !== undefined
        ? trendIconByRatio(summary.todaysNeedRatio)
        : '';
    const needLabelPart = this.stripNeedPerDay
      ? `${this.stripNeedIcon ? this.stripNeedIcon + ' ' : ''}${this.stripNeedPerDay}`
      : '';
    this.stripAriaLabel = `Бюджет: ${this.stripSpentTotal} ост ${this.stripRemaining} дней прошло ${this.stripDaysPassedFrame} осталось дней ${this.stripDaysLeft} нужно в день ${needLabelPart}`;
  }
  private clearBudgetStrip() {
    this.summaryAvailable = false;
    this.stripSpentTotal = '';
    this.stripRemaining = '';
    this.stripDaysPassedFrame = '';
    this.stripDaysLeft = '';
    this.stripNeedPerDay = '';
    this.stripNeedIcon = '';
    this.stripAriaLabel = '';
    this.exhaustionDate = undefined;
    this.perDaySpent.clear();
    this.perDayBudget.clear();
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
  isInBudgetCore(d: Date): boolean {
    if (!this.budgetStart || !this.budgetEnd) return false;
    const time = d.getTime();
    return (
      time >= this.budgetStart.getTime() && time <= this.budgetEnd.getTime()
    );
  }
  isInBudgetBuffer(d: Date): boolean {
    if (!this.budgetStart || !this.budgetEnd) return false;
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

  private parseExhaustionDate(summary: any) {
    this.exhaustionDate = undefined;
    const label: string | undefined = summary?.budgetExhaustion; // "F: dd.mm"
    if (!label) return;
    const match = /F:\s*(\d{2})\.(\d{2})/.exec(label);
    if (!match) return;
    const [, ddStr, mmStr] = match;
    const day = parseInt(ddStr, 10);
    const monthIndex = parseInt(mmStr, 10) - 1;
    if (isNaN(day) || isNaN(monthIndex)) return;
    const baseYear =
      this.budgetStart?.getFullYear() || new Date().getFullYear();
    let candidate = new Date(baseYear, monthIndex, day);
    if (
      this.budgetStart &&
      this.budgetEnd &&
      candidate.getTime() < this.budgetStart.getTime()
    ) {
      const startMonth = this.budgetStart.getMonth();
      const endMonth = this.budgetEnd.getMonth();
      if (endMonth < startMonth)
        candidate = new Date(baseYear + 1, monthIndex, day);
    }
    this.exhaustionDate = candidate;
  }
  isExhaustionDay(d: Date): boolean {
    if (!this.exhaustionDate) return false;
    return (
      d.getFullYear() === this.exhaustionDate.getFullYear() &&
      d.getMonth() === this.exhaustionDate.getMonth() &&
      d.getDate() === this.exhaustionDate.getDate()
    );
  }

  private buildPerDaySpentMap(summary: any) {
    this.perDaySpent.clear();
    const expenses: any[] = summary?.meta?.expenses || [];
    if (!Array.isArray(expenses)) return;
    for (const e of expenses) {
      if (!e || typeof e.date !== 'number') continue;
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const prev = this.perDaySpent.get(key) || 0;
      if (e.includeInBalance) this.perDaySpent.set(key, prev + (e.amount || 0));
    }
  }
  private buildPerDayBudgetMap(summary: any) {
    this.perDayBudget.clear();
    if (!summary) return;
    const startMs = summary.meta?.dateFrameStart;
    const finishMs = summary.meta?.dateFrameFinish;
    if (!startMs || !finishMs) return;
    const frameStart = new Date(startMs);
    const frameEnd = new Date(finishMs);
    const coreDates: Date[] = [];
    let cursor = new Date(
      frameStart.getFullYear(),
      frameStart.getMonth(),
      frameStart.getDate()
    );
    while (cursor.getTime() <= frameEnd.getTime()) {
      coreDates.push(new Date(cursor));
      cursor = new Date(
        cursor.getFullYear(),
        cursor.getMonth(),
        cursor.getDate() + 1
      );
    }
    let remaining = summary.budget ?? 0;
    for (let i = 0; i < coreDates.length; i++) {
      const date = coreDates[i];
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      const daysLeftIncludingToday = coreDates.length - i;
      const daily =
        daysLeftIncludingToday > 0 ? remaining / daysLeftIncludingToday : 0;
      this.perDayBudget.set(key, daily);
      const spent = this.perDaySpent.get(key) || 0;
      remaining -= spent;
      if (remaining < 0) remaining = 0;
    }
  }
  private computeLimitState(date: Date): 'under' | 'near' | 'over' | undefined {
    if (!this.isInBudgetCore(date)) return undefined;
    if (!this.isBudgetCorePast(date) && !this.isSameDate(date, new Date()))
      return undefined;
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const spent = this.perDaySpent.get(key) || 0;
    const budget = this.perDayBudget.get(key);
    let result: 'under' | 'near' | 'over' | undefined = 'over';
    if (!budget || budget <= 0) {
      result = spent > 0 ? 'over' : 'under';
    } else if (spent <= 0) {
      result = 'under';
    } else {
      const ratio = spent / budget;
      if (ratio < 0.75) {
        result = 'under';
      } else if (ratio <= 1.15) {
        result = 'near';
      }
    }
    return result;
  }
}
