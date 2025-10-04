import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { DateTime } from 'luxon';
import { PeriodSummary } from './period-summary.model';
import { DateFrame, Mode } from '../../common/component/filter/date/dateFrame.model';
import { ExpenseService } from '../../common/service/expense.service';
import { createPeriodSnapshot, buildFrame } from './period-summary.factory';
import { composeNarrative } from './period-summary.narrative';
import { PeriodMetricsSnapshot } from './period-summary.types';
import { DateFilterService } from '../../common/component/filter/date/date-filter.service';

/**
 * Service patterned after budget-summary.service.ts: exposes a single public method returning
 * an observable with snapshot data (here static narratives). Later this can be replaced with
 * dynamic computation over ExpenseService without changing the DetailsComponent contract.
 */
@Injectable({ providedIn: 'root' })
export class PeriodSummaryService {
  constructor(
    private expenseService: ExpenseService,
    private dateFilterService: DateFilterService
  ) {}

  /** Public API analogous to other *Summary services (now factory-driven). */
  getCurrentSummaries(): Observable<PeriodSummary[]> {
    const now = DateTime.now();
    // Build frames once
     // Build all needed frames first
     const frameToday = buildFrame('today', now);
     const frameYesterday = buildFrame('yesterday', now);
  const frameWeek = buildFrame('week', now); // week-to-date (may start in previous month!)
  const frameLastMonth = buildFrame('lastMonth', now); // full previous month
    const monthValue = this.dateFilterService.getInitialMonthValue(); // month start..month end (but we use today end for progression)
    const monthStart = monthValue.start.startOf('day');
    const todayEnd = now.endOf('day');
    const daysPassed = Math.floor(
      todayEnd.startOf('day').diff(monthStart, 'days').days
    ) + 1; // inclusive days from 1..N
    const frameMonth = {
      start: monthStart.toMillis(),
      finish: todayEnd.toMillis(), // limit to today, not full month end
      title: monthValue.display,
      key: 'month' as const,
      mode: 'month' as const,
      elapsedDays: daysPassed,
    };

     // IMPORTANT: Previous optimization fetched only month range. That truncates week values
     // when the week crosses into the previous month. Fix by expanding superset start to the
     // earliest needed frame start (week start vs month start).
  // Need superset covering last month start too for single fetch strategy
  const supersetStart = Math.min(frameWeek.start, frameMonth.start, frameLastMonth.start);
  const supersetFrame = { start: supersetStart, finish: frameMonth.finish };

     return this.fetch(supersetFrame).pipe(
      map(res => {
         const all = res.expenses || [];
         const monthExpenses = all.filter(e => e.date >= frameMonth.start && e.date <= frameMonth.finish);
         const lastMonthExpenses = all.filter(e => e.date >= frameLastMonth.start && e.date <= frameLastMonth.finish);
         const weekExpenses = all.filter(e => e.date >= frameWeek.start && e.date <= frameWeek.finish);
         const todayExpenses = all.filter(e => e.date >= frameToday.start && e.date <= frameToday.finish);
         const yesterdayExpenses = all.filter(e => e.date >= frameYesterday.start && e.date <= frameYesterday.finish);

         const todaySnap = createPeriodSnapshot(frameToday, todayExpenses);
         const yesterdaySnap = createPeriodSnapshot(frameYesterday, yesterdayExpenses);
         const weekSnap = createPeriodSnapshot(frameWeek, weekExpenses);
         const monthSnap = createPeriodSnapshot(frameMonth, monthExpenses);
         const lastMonthSnap = createPeriodSnapshot(frameLastMonth, lastMonthExpenses);

        const todayNarr = composeNarrative(todaySnap);
        const yesterdayNarr = composeNarrative(yesterdaySnap, todaySnap);
        const weekNarr = composeNarrative(weekSnap);
  const monthNarr = composeNarrative(monthSnap);
  const lastMonthNarr = composeNarrative(lastMonthSnap);
        const toDateFrame = (meta: { start: number; finish: number; title: string; mode: 'day'|'week'|'month' }): DateFrame => ({
          start: DateTime.fromMillis(meta.start),
          finish: DateTime.fromMillis(meta.finish),
          display: meta.title,
          mode: meta.mode as Mode
        });

        const summaries: PeriodSummary[] = [
          { key: 'today', title: todaySnap.frame.title, frame: toDateFrame(todaySnap.frame), paragraphs: todayNarr.paragraphs },
          { key: 'yesterday', title: yesterdaySnap.frame.title, frame: toDateFrame(yesterdaySnap.frame), paragraphs: yesterdayNarr.paragraphs },
          { key: 'week', title: weekSnap.frame.title, frame: toDateFrame(weekSnap.frame), paragraphs: weekNarr.paragraphs },
          { key: 'month', title: monthSnap.frame.title, frame: toDateFrame(monthSnap.frame), paragraphs: monthNarr.paragraphs },
          { key: 'lastMonth', title: lastMonthSnap.frame.title, frame: toDateFrame(lastMonthSnap.frame), paragraphs: lastMonthNarr.paragraphs },
        ];
        return summaries;
      })
    );
  }

  private fetch(frame: {
    start: number;
    finish: number;
  }): Observable<{ expenses: any[] }> {
    return this.expenseService
      .getExpenses(
        {
          start: DateTime.fromMillis(frame.start),
          finish: DateTime.fromMillis(frame.finish),
          display: '',
          mode: undefined,
        } as any,
        undefined,
        undefined,
        true
      )
      .pipe(
        first(),
        map(expenses => ({ expenses }))
      );
  }
}
