import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { DateTime } from "luxon";
import { DateFrame, Mode } from "./dateFrame.model";
import { DateFilterService } from "./date-filter.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrl: './date-filter.component.scss',
  standalone: true,
  imports: [CommonModule]
})
export class DateFilterComponent implements OnInit {
  @Output()
  changeDayEvent: EventEmitter<null> = new EventEmitter();
  readonly Mode = Mode;

  pastDays: DateFrame[] = [];
  pastWeeks: DateFrame[] = [];
  pastMonths: DateFrame[] = [];

  currentFrame: DateFrame = {
    start: DateTime.now().startOf('day'),
    finish: DateTime.now().endOf('day'),
    display: 'сегодня',
    mode: Mode.DAY,
  };

  constructor(
    private dateFilterService: DateFilterService,
  ) { }

  ngOnInit(): void {
    const now = DateTime.now();
    const thisWeekStart = now.startOf('week');
    const thisMonthStart = now.startOf('month');
    for (let i = 0; i < 31; i++) {
      this.pastDays.push({
        start: now.minus({ days: i }).startOf('day'),
        finish: now.minus({ days: i }).endOf('day'),
        display: now.minus({ days: i }).setLocale('ru').toFormat('d MMMM'),
        mode: Mode.DAY,
      })
    }
    for (let i = 0; i < 5; i++) {
      this.pastWeeks.push({
        start: thisWeekStart.minus({ weeks: i }),
        finish: thisWeekStart.minus({ weeks: i }).endOf('week'),
        display: thisWeekStart.minus({ weeks: i }).setLocale('ru').toFormat('d MMMM') + ' - ' + thisWeekStart.minus({ weeks: i }).endOf('week').setLocale('ru').toFormat('d MMMM'),
        mode: Mode.WEEK,
      })
    }
    for (let i = 0; i < 12; i++) {
      this.pastMonths.push({
        start: thisMonthStart.minus({ months: i }),
        finish: thisMonthStart.minus({ months: i }).endOf('month'),
        display: thisMonthStart.minus({ months: i }).setLocale('ru').toFormat('LLLL'),
        mode: Mode.MONTH,
      })
    }
  }

  updateDateFrameEvent(frame: DateFrame): void {
    this.currentFrame = frame;
    console.log('changeModeEvent', frame);

    this.dateFilterService.setDateFrame(this.currentFrame);
    this.changeDayEvent.emit();
  }
}