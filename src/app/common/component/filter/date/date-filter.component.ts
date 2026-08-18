import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  NgZone,
  AfterViewInit,
} from '@angular/core';
import { DateTime } from 'luxon';

import { SelectOption } from '../../../model/select-option';
import { DateFrame, Mode } from './dateFrame.model';
import {
  DateFilterDropDownChange,
  DateFilterDropDownComponent,
} from '../dropdown/date-filter-drop-down.component';
import { DateFilterService } from './date-filter.service';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrl: './date-filter.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule, DateFilterDropDownComponent],
})
export class DateFilterComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() value: DateFrame;
  @Input() isHowSuggestionButton: boolean = false;
  @Input() defaultValue: DateFrame;
  @Output() changeFilter: EventEmitter<DateFrame> = new EventEmitter();
  // Enable compact on scroll (statistics page only)
  @Input() enableCompactOnScroll: boolean = false;

  readonly Mode = Mode;

  clickedMode: Mode;

  optionsForDaysSelect: SelectOption<DateFrame>[] = [];
  optionsForWeeksSelect: SelectOption<DateFrame>[] = [];
  optionsForMonthsSelect: SelectOption<DateFrame>[] = [];
  optionsForYearsSelect: SelectOption<DateFrame>[] = [];

  currentFilter: SelectOption<DateFrame>;
  defaultLabel: string;

  firstDayOption: SelectOption<DateFrame>;
  showCompact: boolean = false; // toggled by scroll
  private scrollThreshold = 10; // px before compact view activates
  private onScrollHandler = () => this.evaluateScrollPosition();
  compactLabel: string = '';
  customRangeOpen = false;
  customStartDate = '';
  customFinishDate = '';
  customRangeError = '';
  readonly maxDate = DateTime.now().toISODate() || '';

  constructor(
    private dateFilterService: DateFilterService,
    private ngZone: NgZone
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.setCurrentState(this.value);
    }
  }

  ngOnInit(): void {
    this.firstDayOption = {
      value: this.dateFilterService.getInitialDayValue(),
      display: DateFilterService.initialDayFrameLabel,
    };
    this.initOptions();
    this.defaultLabel = this.defaultValue?.display;
    this.buildCompactLabel();
  }

  ngAfterViewInit(): void {
    if (this.enableCompactOnScroll) {
      this.ngZone.runOutsideAngular(() => {
        window.addEventListener('scroll', this.onScrollHandler, {
          passive: true,
        });
      });
      // Initial evaluation
      this.evaluateScrollPosition();
    }
  }

  onRefresh(): void {
    this.setCurrentState(this.defaultValue);
    this.changeFilter.emit(this.currentFilter?.value);
    this.buildCompactLabel();
    this.evaluateScrollPosition();
  }

  onDateSelect(selectedValue: DateFilterDropDownChange<DateFrame, Mode>): void {
    this.clickedMode = selectedValue.name;
    this.setCurrentState(selectedValue.value);
    this.changeFilter.emit(this.currentFilter?.value);
    this.buildCompactLabel();
    this.evaluateScrollPosition();
  }

  onDropdownToggleClick(mode: Mode): void {
    this.clickedMode = mode;
  }

  toggleCustomRange(): void {
    if (this.customRangeOpen) {
      this.customRangeOpen = false;
      return;
    }

    const today = DateTime.now().startOf('day');
    const source = this.currentFilter?.value;
    const start = source?.start?.startOf('day') || today.startOf('month');
    const finish = source?.finish?.startOf('day') || today;
    this.customStartDate = start.toISODate() || '';
    this.customFinishDate = (finish > today ? today : finish).toISODate() || '';
    this.customRangeError = '';
    this.customRangeOpen = true;
    this.clickedMode = Mode.CUSTOM;
  }

  onCustomDateChange(): void {
    this.customRangeError = '';
  }

  get isCustomRangeInvalid(): boolean {
    if (!this.customStartDate || !this.customFinishDate) {
      return true;
    }
    const start = DateTime.fromISO(this.customStartDate);
    const finish = DateTime.fromISO(this.customFinishDate);
    return !start.isValid || !finish.isValid || start > finish;
  }

  applyCustomRange(): void {
    const start = DateTime.fromISO(this.customStartDate).startOf('day');
    const finish = DateTime.fromISO(this.customFinishDate).endOf('day');
    const todayFinish = DateTime.now().endOf('day');

    if (!start.isValid || !finish.isValid) {
      this.customRangeError = 'Выберите обе даты.';
      return;
    }
    if (start > finish) {
      this.customRangeError = 'Дата начала не может быть позже даты окончания.';
      return;
    }
    if (finish > todayFinish) {
      this.customRangeError = 'Нельзя выбрать будущую дату.';
      return;
    }

    const display = `${start.setLocale('ru').toFormat('d MMMM yyyy')} - ${finish
      .setLocale('ru')
      .toFormat('d MMMM yyyy')}`;
    this.clickedMode = Mode.CUSTOM;
    this.setCurrentState({ start, finish, mode: Mode.CUSTOM, display });
    this.changeFilter.emit(this.currentFilter.value);
    this.customRangeOpen = false;
    this.buildCompactLabel();
    this.evaluateScrollPosition();
  }

  onCompactClick(): void {
    // window.scrollTo({ top: 0, behavior: 'smooth' });
    //   const topEl = document.getElementById('back');
    //   if (topEl) { topEl.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    this.showCompact = false;
  }

  private setCurrentState(value: DateFrame): void {
    if (value) {
      if (value?.display !== this.currentFilter?.display) {
        this.currentFilter = {
          value,
          display: value.display,
        };
        this.buildCompactLabel();
      }
    } else {
      this.currentFilter = undefined;
      this.buildCompactLabel();
    }
  }

  private initOptions(): void {
    this.initDayOptions();
    this.initWeekOptions();
    this.initMonthOptions();
    this.initYearOptions();
  }

  private buildCompactLabel(): void {
    const display = this.currentFilter?.display || this.defaultLabel || '—';
    this.compactLabel = `${display}`;
  }

  private evaluateScrollPosition(): void {
    if (!this.enableCompactOnScroll) {
      return;
    }
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    const shouldShow = y > this.scrollThreshold;
    if (shouldShow !== this.showCompact) {
      this.ngZone.run(() => (this.showCompact = shouldShow));
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScrollHandler);
  }

  private initDayOptions(): void {
    const now = DateTime.now();
    const daysOptions: SelectOption<DateFrame>[] = [this.firstDayOption];
    for (let i = 1; i < 31; i++) {
      const displayDayValue = now
        .minus({ days: i })
        .setLocale('ru')
        .toFormat('d MMMM');
      daysOptions.push({
        value: {
          start: now.minus({ days: i }).startOf('day'),
          finish: now.minus({ days: i }).endOf('day'),
          mode: Mode.DAY,
          display: displayDayValue,
        },
        display: displayDayValue,
      });
    }
    this.optionsForDaysSelect = daysOptions;
  }

  private initWeekOptions(): void {
    const now = DateTime.now();
    const thisWeekStart = now.startOf('week');
    const firstWeekOption: SelectOption<DateFrame> = {
      value: {
        start: thisWeekStart,
        finish: DateTime.now().endOf('week'),
        mode: Mode.WEEK,
        display: DateFilterService.initialWeekFrameLabel,
      },
      display: DateFilterService.initialWeekFrameLabel,
    };
    const weeksOptions: SelectOption<DateFrame>[] = [firstWeekOption];
    for (let i = 1; i < 5; i++) {
      const displayWeekValue =
        thisWeekStart.minus({ weeks: i }).setLocale('ru').toFormat('d MMMM') +
        ' - ' +
        thisWeekStart
          .minus({ weeks: i })
          .endOf('week')
          .setLocale('ru')
          .toFormat('d MMMM');
      weeksOptions.push({
        value: {
          start: thisWeekStart.minus({ weeks: i }),
          finish: thisWeekStart.minus({ weeks: i }).endOf('week'),
          mode: Mode.WEEK,
          display: displayWeekValue,
        },
        display: displayWeekValue,
      });
    }
    this.optionsForWeeksSelect = weeksOptions;
  }

  private initMonthOptions(): void {
    const now = DateTime.now();
    const thisMonthStart = now.startOf('month');
    const firstMonthOption: SelectOption<DateFrame> = {
      value: {
        start: thisMonthStart,
        finish: DateTime.now().endOf('month'),
        mode: Mode.MONTH,
        display: DateFilterService.initialMonthFrameLabel,
      },
      display: DateFilterService.initialMonthFrameLabel,
    };
    const monthsOptions: SelectOption<DateFrame>[] = [firstMonthOption];
    for (let i = 1; i < 12; i++) {
      const displayMonthValue = thisMonthStart
        .minus({ months: i })
        .setLocale('ru')
        .toFormat('LLLL');
      monthsOptions.push({
        value: {
          start: thisMonthStart.minus({ months: i }),
          finish: thisMonthStart.minus({ months: i }).endOf('month'),
          mode: Mode.MONTH,
          display: displayMonthValue,
        },
        display: displayMonthValue,
      });
    }
    this.optionsForMonthsSelect = monthsOptions;
  }

  private initYearOptions(): void {
    const now = DateTime.now();
    const thisYearStart = now.startOf('year');
    const firstYearOption: SelectOption<DateFrame> = {
      value: {
        start: thisYearStart,
        finish: DateTime.now().endOf('year'),
        mode: Mode.YEAR,
        display: DateFilterService.initialYearFrameLabel,
      },
      display: DateFilterService.initialYearFrameLabel,
    };
    const yearsOptions: SelectOption<DateFrame>[] = [firstYearOption];
    for (let i = 1; i < 5; i++) {
      const displayYearValue = thisYearStart
        .minus({ years: i })
        .setLocale('ru')
        .toFormat('yyyy');
      yearsOptions.push({
        value: {
          start: thisYearStart.minus({ years: i }),
          finish: thisYearStart.minus({ years: i }).endOf('year'),
          mode: Mode.YEAR,
          display: displayYearValue,
        },
        display: displayYearValue,
      });
    }
    this.optionsForYearsSelect = yearsOptions;
  }
}
