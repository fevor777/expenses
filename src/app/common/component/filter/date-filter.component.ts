import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DateTime } from 'luxon';

import { SelectOption } from '../../model/select-option';
import { DateFrame, Mode } from './dateFrame.model';
import {
  DateFilterDropDownChange,
  DateFilterDropDownComponent,
} from './dropdown/date-filter-drop-down.component';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrl: './date-filter.component.scss',
  standalone: true,
  imports: [CommonModule, DateFilterDropDownComponent],
})
export class DateFilterComponent implements OnInit, OnChanges {
  static readonly initialDayFrameLabel: string = 'сегодня';
  static readonly initialWeekFrameLabel: string = 'эта неделя';
  static readonly initialMonthFrameLabel: string = 'этот месяц';
  static readonly initialYearFrameLabel: string = 'этот год';
  static readonly initialValue: DateFrame = {
    start: DateTime.now().startOf('day'),
    finish: DateTime.now().endOf('day'),
    display: DateFilterComponent.initialDayFrameLabel,
    mode: Mode.DAY,
  };


  @Input() value: DateFrame;
  @Input() defaultValue: DateFrame;
  @Output() changeFilter: EventEmitter<DateFrame> = new EventEmitter();

  readonly Mode = Mode;

  clickedMode: Mode;

  optionsForDaysSelect: SelectOption<DateFrame>[] = [];
  optionsForWeeksSelect: SelectOption<DateFrame>[] = [];
  optionsForMonthsSelect: SelectOption<DateFrame>[] = [];
  optionsForYearsSelect: SelectOption<DateFrame>[] = [];

  currentFilter: SelectOption<DateFrame>;
  defaultLabel: string;


  firstDayOption: SelectOption<DateFrame> = {
    value: DateFilterComponent.initialValue,
    display: DateFilterComponent.initialDayFrameLabel,
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.setCurrentState(this.value);
    }
  }

  ngOnInit(): void {
    this.initOptions();
    this.defaultLabel = this.defaultValue?.display;
  }

  onRefresh(): void {
    this.setCurrentState(this.defaultValue);
    this.changeFilter.emit(this.currentFilter?.value);
  }

  onDateSelect(selectedValue: DateFilterDropDownChange<DateFrame, Mode>): void {
    this.clickedMode = selectedValue.name;
    this.setCurrentState(selectedValue.value);
    this.changeFilter.emit(this.currentFilter?.value);
  }

  onDropdownToggleClick(mode: Mode): void {
    this.clickedMode = mode;
  }

  private setCurrentState(value: DateFrame): void {
    if (value) {
      if (value?.display !== this.currentFilter?.display) {
        this.currentFilter = {
          value,
          display: value.display,
        };
      }
    } else {
      this.currentFilter = undefined;
    }
  }

  private initOptions(): void {
    this.initDayOptions();
    this.initWeekOptions();
    this.initMonthOptions();
    this.initYearOptions();
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
        display: DateFilterComponent.initialWeekFrameLabel,
      },
      display: DateFilterComponent.initialWeekFrameLabel,
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
        display: DateFilterComponent.initialMonthFrameLabel,
      },
      display: DateFilterComponent.initialMonthFrameLabel,
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
        display: DateFilterComponent.initialYearFrameLabel,
      },
      display: DateFilterComponent.initialYearFrameLabel,
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
