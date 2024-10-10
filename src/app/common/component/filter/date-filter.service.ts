import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { DateFrame, Mode } from "./dateFrame.model";
import { DateTime } from "luxon";

@Injectable()
export class DateFilterService {
  readonly initialDayFrameLabel: string = 'сегодня';
  readonly initialWeekFrameLabel: string = 'эта неделя';
  readonly initialMonthFrameLabel: string = 'этот месяц';

  initialValue: DateFrame = {
    start: DateTime.now().startOf('day'),
    finish: DateTime.now().endOf('day'),
    display: this.initialDayFrameLabel,
    mode: Mode.DAY,
  };
  private dateFrameSubject: BehaviorSubject<DateFrame> = new BehaviorSubject<DateFrame>(this.initialValue);
  dateFrame$: Observable<DateFrame | null> = this.dateFrameSubject.asObservable();

  setDateFrame(dateFrame: DateFrame): void {
    this.dateFrameSubject.next(dateFrame);
  }

  getCurrentDateFrame(): DateFrame {
    return this.dateFrameSubject.value;
  }

  refreshDateFrame(): void {
    this.dateFrameSubject.next(this.initialValue);
  }
}