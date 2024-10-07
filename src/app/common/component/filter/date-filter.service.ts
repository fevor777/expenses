import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { DateFrame, Mode } from "./dateFrame.model";
import { DateTime } from "luxon";

@Injectable()
export class DateFilterService {
  private initialValue: DateFrame = {
    start: DateTime.now().startOf('day'),
    finish: DateTime.now().endOf('day'),
    display: 'сегодня',
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