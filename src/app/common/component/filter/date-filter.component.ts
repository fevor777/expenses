import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DateTime } from 'luxon';
import { DateFrame, Mode } from './dateFrame.model';
import { DateFilterService } from './date-filter.service';
import { CommonModule } from '@angular/common';
import { DateFilterDropDownComponent } from './dropdown/date-filter-drop-down.component';
import { SelectOption } from '../../model/select-option';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrl: './date-filter.component.scss',
  standalone: true,
  imports: [CommonModule, DateFilterDropDownComponent],
})
export class DateFilterComponent implements OnInit {
  @Output()
  changeDateFrameEvent: EventEmitter<null> = new EventEmitter();
  readonly Mode = Mode;

  currentMode: Mode = Mode.DAY;
  clickedMode: Mode;

  optionsForDaysSelect: SelectOption<DateFrame>[] = [];
  optionsForWeeksSelect: SelectOption<DateFrame>[] = [];
  optionsForMonthsSelect: SelectOption<DateFrame>[] = [];

  defaultValue: SelectOption<DateFrame>;

  firstDayOption: SelectOption<DateFrame> = {
    value: {
      start: DateTime.now().startOf('day'),
      finish: DateTime.now().endOf('day'),
      mode: Mode.DAY,
      display: 'сегодня',
    },
    display: 'сегодня',
  };

  firstWeekOption: SelectOption<DateFrame> = {
    value: {
      start: DateTime.now().startOf('week'),
      finish: DateTime.now().endOf('week'),
      mode: Mode.WEEK,
      display: 'эта неделя',
    },
    display: 'эта неделя',
  };

  firstMonthOption: SelectOption<DateFrame> = {
    value: {
      start: DateTime.now().startOf('month'),
      finish: DateTime.now().endOf('month'),
      mode: Mode.MONTH,
      display: 'этот месяц',
    },
    display: 'этот месяц',
  };

  constructor(private dateFilterService: DateFilterService) {}

  ngOnInit(): void {
    this.initOptions();
    const currentFrame = this.dateFilterService.getCurrentDateFrame();
    if (currentFrame) {
      this.defaultValue = {
        value: currentFrame,
        display: currentFrame?.display,
      };
      this.currentMode = currentFrame.mode;
    }
  }

  onValueChange(frame: DateFrame): void {
    this.dateFilterService.setDateFrame(frame);
    this.changeDateFrameEvent.emit();
  }

  onDropdownActive(mode: Mode): void {
    this.currentMode = mode;
    this.clickedMode = mode;
  }

  onDropdownToggleClick(mode: Mode): void {
    this.clickedMode = mode;
  }

  private initOptions(): void {
    this.initDayOptions();
    this.initWeekOptions();
    this.initMonthOptions();
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
    const weeksOptions: SelectOption<DateFrame>[] = [this.firstWeekOption];
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
    const monthsOptions: SelectOption<DateFrame>[] = [this.firstMonthOption];
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
}
