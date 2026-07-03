// CLEAN REPLACEMENT FILE BELOW
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  HostListener,
} from '@angular/core';
import {
  SegmentedSwitchComponent,
  SegmentedOption,
} from '../component/segmented/segmented-switch.component';
import { DayTooltipComponent } from './day-tooltip.component';
import {
  BudgetSummaryService,
  BudgetSummaryBuildResult,
} from '../service/budget-summary.service';
import { trendIconByRatio } from '../model/budget-summary/budget-summary.br-notifi-formatter';
import { first, Subject, takeUntil } from 'rxjs';
import { Budget } from '../model/budget.model';
import { getCategoryById } from '../model/categories';

interface DayData {
  date: Date;
  key: string;
  expenses: any[];
  totalAmount: number; // includeInBalance amount
  totalEntries: number;
  categories: Map<string, { count: number; amount: number }>;
  dynamicBudget: number; // calculated daily budget for this day
  limitState: 'under' | 'near' | 'over' | undefined;
}

interface WeekData {
  weekNumber: number;
  days: DayData[];
  totalAmount: number;
  totalEntries: number;
  categories: Map<string, { count: number; amount: number }>;
  daysWithExpenses: number;
}

interface CalendarDay {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isWeekend: boolean;
  limitState?: 'under' | 'near' | 'over';
}

interface CalendarWeek {
  weekNumber: number;
  days: CalendarDay[];
}

interface DayCategoryStat {
  id: string;
  name: string;
  short: string;
  count: number;
  amount: number; // summed amount for this category (includeInBalance only)
}

interface DayTooltipData {
  date: Date;
  total: number; // number of expense entries for the day
  categories: DayCategoryStat[]; // aggregated per category
  totalAmount: number; // summed amount for the day (includeInBalance only)
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, SegmentedSwitchComponent, DayTooltipComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnDestroy {
  @Input() selectedDate: Date = new Date();
  @Output() dateChange = new EventEmitter<Date>();
  @Output() close = new EventEmitter<void>();
  @Output() today = new EventEmitter<Date>();
  @Output() modeChange = new EventEmitter<'month' | 'period'>();
  // Navigation events delegated to parent (expense page) per requirement
  @Output() navigateHistory = new EventEmitter<Date>();
  @Output() navigateStatistics = new EventEmitter<Date>();

  private unsubscribe = new Subject<void>();

  viewDate: Date = new Date();
  weeks: CalendarWeek[] = [];
  weekDayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  show = false;

  // Optimized data structures
  private dayDataMap = new Map<string, DayData>();
  private weekDataMap = new Map<number, WeekData>();

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
  showVelocityHistory = true;
  
  // Legacy maps - kept for compatibility but will be populated from dayDataMap
  private perDaySpent = new Map<string, number>();
  private perDayBudget = new Map<string, number>(); // dynamic daily budget per core day
  private perDayExpenses = new Map<string, any[]>(); // raw expenses per day (from summary.meta.expenses)

  // Tooltip state
  tooltip: DayTooltipData | null = null;
  weekTooltip: DayTooltipData | null = null;
  activeWeekNumber: number | null = null;

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

  private getISOWeekNumber(date: Date): number {
    const tempDate = new Date(date.getTime());
    tempDate.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year
    tempDate.setDate(tempDate.getDate() + 3 - (tempDate.getDay() + 6) % 7);
    // January 4 is always in week 1
    const week1 = new Date(tempDate.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count weeks from there
    return 1 + Math.round(((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }

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
        this.buildComprehensiveDataMaps(result.summary);
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

  private generatePeriod() {
    // clear tooltip on regeneration (month/mode change)
    this.tooltip = null;
    this.weekTooltip = null;
    this.activeWeekNumber = null;
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
    const weeks: CalendarWeek[] = [];
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
            limitState: this.getLimitState(padDate),
          });
        }
      }
      week.push({
        date: new Date(current),
        inMonth: true,
        isToday: this.isSameDate(current, today),
        isSelected: this.isSameDate(current, this.selectedDate),
        isWeekend: this.isWeekend(current),
        limitState: this.getLimitState(current),
      });
      if (week.length === 7) {
        const weekNumber = this.getISOWeekNumber(week[0].date);
        weeks.push({ weekNumber, days: week });
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
          limitState: this.getLimitState(nxt),
        });
      }
      const weekNumber = this.getISOWeekNumber(week[0].date);
      weeks.push({ weekNumber, days: week });
    }
    this.weeks = weeks;
    this.buildWeekData(weeks);
  }

  private generate() {
    // clear tooltip when regenerating regular month view
    this.tooltip = null;
    this.weekTooltip = null;
    this.activeWeekNumber = null;
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startDay = (firstOfMonth.getDay() + 6) % 7; // Monday=0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const weeks: CalendarWeek[] = [];
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
        const weekNumber = this.getISOWeekNumber(week[0].date);
        weeks.push({ weekNumber, days: week });
        week = [];
      }
      const date = new Date(year, month, currentDayCounter);
      week.push({
        date,
        inMonth: true,
        isToday: this.isSameDate(date, today),
        isSelected: this.isSameDate(date, this.selectedDate),
        isWeekend: this.isWeekend(date),
        limitState: this.getLimitState(date),
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
    const weekNumber = this.getISOWeekNumber(week[0].date);
    weeks.push({ weekNumber, days: week });
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
      const weekNumber = this.getISOWeekNumber(week[0].date);
      weeks.push({ weekNumber, days: week });
    }
    this.weeks = weeks;
    this.buildWeekData(weeks);
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
    this.stripNeedPerDay = summary.needPerDay !== undefined
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
    this.dayDataMap.clear();
    this.weekDataMap.clear();
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

  private buildComprehensiveDataMaps(summary: any) {
    // Clear all data structures
    this.dayDataMap.clear();
    this.weekDataMap.clear();
    this.perDaySpent.clear();
    this.perDayBudget.clear();
    this.perDayExpenses.clear();

    const expenses: any[] = summary?.meta?.expenses || [];
    if (!Array.isArray(expenses)) return;

    // Step 1: Initialize day data structure and process expenses
    const dayDataMapTemp = new Map<string, DayData>();
    
    for (const expense of expenses) {
      if (!expense || typeof expense.date !== 'number') continue;
      
      const date = new Date(expense.date);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      
      // Initialize day data if not exists
      if (!dayDataMapTemp.has(key)) {
        dayDataMapTemp.set(key, {
          date,
          key,
          expenses: [],
          totalAmount: 0,
          totalEntries: 0,
          categories: new Map(),
          dynamicBudget: 0,
          limitState: undefined
        });
      }
      
      const dayData = dayDataMapTemp.get(key)!;
      dayData.expenses.push(expense);
      dayData.totalEntries++;
      
      // Process category and amount data
      if (expense.includeInBalance) {
        const amount = typeof expense.amount === 'number' ? expense.amount : 0;
        dayData.totalAmount += amount;
        
        const categoryId = expense.category;
        if (categoryId) {
          const existing = dayData.categories.get(categoryId) || { count: 0, amount: 0 };
          existing.count++;
          existing.amount += amount;
          dayData.categories.set(categoryId, existing);
        }
      }
    }

    // Step 2: Calculate dynamic budgets for core days
    const startMs = summary?.meta?.dateFrameStart;
    const finishMs = summary?.meta?.dateFrameFinish;
    
    if (startMs && finishMs) {
      const frameStart = new Date(startMs);
      const frameEnd = new Date(finishMs);
      const coreDates: Date[] = [];
      
      let cursor = new Date(frameStart.getFullYear(), frameStart.getMonth(), frameStart.getDate());
      while (cursor.getTime() <= frameEnd.getTime()) {
        coreDates.push(new Date(cursor));
        cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1);
      }
      
      let remainingBudget = summary?.budget ?? 0;
      
      for (let i = 0; i < coreDates.length; i++) {
        const date = coreDates[i];
        const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        const daysLeftIncludingToday = coreDates.length - i;
        const dailyBudget = daysLeftIncludingToday > 0 ? remainingBudget / daysLeftIncludingToday : 0;
        
        // Ensure day data exists for core days even if no expenses
        if (!dayDataMapTemp.has(key)) {
          dayDataMapTemp.set(key, {
            date,
            key,
            expenses: [],
            totalAmount: 0,
            totalEntries: 0,
            categories: new Map(),
            dynamicBudget: dailyBudget,
            limitState: undefined
          });
        } else {
          dayDataMapTemp.get(key)!.dynamicBudget = dailyBudget;
        }
        
        const spent = dayDataMapTemp.get(key)?.totalAmount || 0;
        remainingBudget -= spent;
        if (remainingBudget < 0) remainingBudget = 0;
      }
    }

    // Step 3: Calculate limit states for past and current days
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    
    for (const [key, dayData] of dayDataMapTemp) {
      const dayTime = dayData.date.getTime();
      const isPastOrToday = dayTime <= startOfToday;
      const isInBudgetCore = startMs && finishMs && dayTime >= startMs && dayTime <= finishMs;
      
      if (isPastOrToday && isInBudgetCore) {
        const spent = dayData.totalAmount;
        const budget = dayData.dynamicBudget;
        
        if (!budget || budget <= 0) {
          dayData.limitState = spent > 0 ? 'over' : 'under';
        } else if (spent <= 0) {
          dayData.limitState = 'under';
        } else {
          const ratio = spent / budget;
          if (ratio < 0.75) {
            dayData.limitState = 'under';
          } else if (ratio <= 1.15) {
            dayData.limitState = 'near';
          } else {
            dayData.limitState = 'over';
          }
        }
      }
    }
    
    // Step 4: Store in main data structure and populate legacy maps
    this.dayDataMap = dayDataMapTemp;
    
    for (const [key, dayData] of this.dayDataMap) {
      this.perDaySpent.set(key, dayData.totalAmount);
      this.perDayBudget.set(key, dayData.dynamicBudget);
      this.perDayExpenses.set(key, dayData.expenses);
    }
  }

  private getLimitState(date: Date): 'under' | 'near' | 'over' | undefined {
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const dayData = this.dayDataMap.get(key);
    return dayData?.limitState;
  }

  private buildWeekData(weeks: CalendarWeek[]) {
    this.weekDataMap.clear();
    
    for (const week of weeks) {
      const weekData: WeekData = {
        weekNumber: week.weekNumber,
        days: [],
        totalAmount: 0,
        totalEntries: 0,
        categories: new Map(),
        daysWithExpenses: 0
      };
      
      // Only include past and current days
      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
      
      for (const calendarDay of week.days) {
        const dayTime = new Date(
          calendarDay.date.getFullYear(),
          calendarDay.date.getMonth(),
          calendarDay.date.getDate()
        ).getTime();
        
        if (dayTime <= startOfToday) {
          const key = `${calendarDay.date.getFullYear()}-${calendarDay.date.getMonth()}-${calendarDay.date.getDate()}`;
          const dayData = this.dayDataMap.get(key);
          
          if (dayData) {
            weekData.days.push(dayData);
            weekData.totalAmount += dayData.totalAmount;
            weekData.totalEntries += dayData.totalEntries;
            
            if (dayData.totalEntries > 0) {
              weekData.daysWithExpenses++;
            }
            
            // Aggregate categories
            for (const [catId, catData] of dayData.categories) {
              const existing = weekData.categories.get(catId) || { count: 0, amount: 0 };
              existing.count += catData.count;
              existing.amount += catData.amount;
              weekData.categories.set(catId, existing);
            }
          }
        }
      }
      
      this.weekDataMap.set(week.weekNumber, weekData);
    }
  }

  // ===== Tooltip Logic =====
  selectDay(day: CalendarDay) {
    // Only allow tooltip for today or past days (no future days)
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();
    const dayTime = new Date(
      day.date.getFullYear(),
      day.date.getMonth(),
      day.date.getDate()
    ).getTime();
    if (dayTime > startOfToday) return; // future day -> ignore

    // Toggle off if same day already visible
    if (this.tooltip && this.isSameDate(this.tooltip.date, day.date)) {
      this.tooltip = null;
      return;
    }

    // Clear week tooltip when selecting a day
    this.weekTooltip = null;
    this.activeWeekNumber = null;

    const key = `${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`;
    const dayData = this.dayDataMap.get(key);
    
    if (!dayData) {
      this.tooltip = null;
      return;
    }

    // Convert category data to the expected format
    const categories: DayCategoryStat[] = Array.from(dayData.categories.entries()).map(
      ([id, catData]) => {
        const cat = getCategoryById(id);
        const name = cat?.name || id;
        return {
          id,
          name,
          short: this.shortCategoryName(name),
          count: catData.count,
          amount: catData.amount,
        } as DayCategoryStat;
      }
    );
    categories.sort((a, b) => b.amount - a.amount);
    
    this.tooltip = {
      date: day.date,
      total: dayData.totalEntries,
      categories,
      totalAmount: dayData.totalAmount,
    };
  }

  isTooltipVisible(d: Date): boolean {
    return !!this.tooltip && this.isSameDate(this.tooltip.date, d);
  }

  isWeekTooltipVisible(weekNumber: number): boolean {
    return !!this.weekTooltip && this.activeWeekNumber === weekNumber;
  }

  selectWeek(week: CalendarWeek) {
    // Toggle off if same week already visible
    if (this.weekTooltip && this.activeWeekNumber === week.weekNumber) {
      this.weekTooltip = null;
      this.activeWeekNumber = null;
      return;
    }

    // Clear day tooltip when showing week tooltip
    this.tooltip = null;

    // Get precomputed week data
    const weekData = this.weekDataMap.get(week.weekNumber);
    if (!weekData || weekData.totalEntries === 0) {
      this.weekTooltip = null;
      this.activeWeekNumber = null;
      return;
    }

    // Convert category data to the expected format
    const categories: DayCategoryStat[] = Array.from(weekData.categories.entries()).map(
      ([id, catData]) => {
        const cat = getCategoryById(id);
        const name = cat?.name || id;
        return {
          id,
          name,
          short: this.shortCategoryName(name),
          count: catData.count,
          amount: catData.amount,
        } as DayCategoryStat;
      }
    );
    categories.sort((a, b) => b.amount - a.amount);

    // Use the first day of the week as the "date" for the tooltip
    const startDate = weekData.days[0]?.date || week.days[0].date;

    this.weekTooltip = {
      date: startDate,
      total: weekData.totalEntries,
      categories,
      totalAmount: weekData.totalAmount,
    };
    this.activeWeekNumber = week.weekNumber;
  }

  private shortCategoryName(name: string): string {
    if (!name) return '';
    // Remove trailing punctuation, take first segment
    const firstSegment = name.replace(/\.+$/, '').split(/\s+/)[0] || name;
    const seg = firstSegment.replace(/\.+$/, '');
    if (seg.length <= 4) return seg;
    if (seg.length <= 6) return seg.slice(0, 4);
    return seg.slice(0, 3); // Long names -> 3 letters (e.g. 'Питание' -> 'Пит')
  }

  formatAmount(amount: number): string {
    return this.fmtMoney(amount) + ' €';
  }

  // Tooltip footer icon handlers
  onNavigateHistory(): void {
    if (this.tooltip?.date) this.navigateHistory.emit(this.tooltip.date);
  }
  onNavigateStatistics(): void {
    if (this.tooltip?.date) this.navigateStatistics.emit(this.tooltip.date);
  }

  // Close tooltip when clicking outside of a day or the tooltip itself
  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: MouseEvent): void {
    if (!this.tooltip && !this.weekTooltip) return;
    const target = ev.target as HTMLElement | null;
    if (!target) return;
    
    // Keep if click inside tooltip
    if (target.closest('.day-tooltip')) return;
    
    // Keep if click inside a day cell that currently shows tooltip (selectDay handles toggle)
    if (target.closest('.day')) return;
    
    // Keep if click inside a week number that currently shows tooltip (selectWeek handles toggle)
    if (target.closest('.week-number')) return;
    
    this.tooltip = null;
    this.weekTooltip = null;
    this.activeWeekNumber = null;
  }
}
