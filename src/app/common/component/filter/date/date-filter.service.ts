import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';

import { DateFrame, Mode } from './dateFrame.model';

@Injectable({
  providedIn: 'root',
})
export class DateFilterService {
  static readonly initialDayFrameLabel: string = 'сегодня';
  static readonly initialWeekFrameLabel: string = 'эта неделя';
  static readonly initialMonthFrameLabel: string = 'этот месяц';
  static readonly initialYearFrameLabel: string = 'этот год';

  categories: string[];
  dateFilter: DateFrame;
  description?: string; // persisted description filter when navigating between pages
  tagIds?: string[];

  getInitialDayValue(): DateFrame {
    return {
      start: DateTime.now().startOf('day'),
      finish: DateTime.now().endOf('day'),
      display: DateFilterService.initialDayFrameLabel,
      mode: Mode.DAY,
    };
  }

  getInitialMonthValue(): DateFrame {
    return {
      start: DateTime.now().startOf('month'),
      finish: DateTime.now().endOf('month'),
      mode: Mode.MONTH,
      display: DateFilterService.initialMonthFrameLabel,
    };
  }
}
