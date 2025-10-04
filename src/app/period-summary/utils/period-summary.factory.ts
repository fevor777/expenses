import { DateTime } from 'luxon';
import { Expense } from '../../common/model/expense.model';
import { buildPeriodMetrics } from './period-summary.classifier';
import {
  PeriodFrameMeta,
  PeriodFrameKey,
  PeriodMetricsSnapshot,
} from './period-summary.types';

export interface BuildPeriodOptions {
  now?: DateTime;
}

export function buildFrame(
  key: PeriodFrameKey,
  now: DateTime
): PeriodFrameMeta {
  switch (key) {
    case 'today': {
      const start = now.startOf('day');
      return {
        key,
        title: 'Сегодня',
        start: start.toMillis(),
        finish: now.endOf('day').toMillis(),
        mode: 'day',
      };
    }
    case 'yesterday': {
      const d = now.minus({ days: 1 });
      return {
        key,
        title: 'Вчера',
        start: d.startOf('day').toMillis(),
        finish: d.endOf('day').toMillis(),
        mode: 'day',
      };
    }
    case 'week': {
      const start = now.startOf('week');
      const finish = now.endOf('day');
      const elapsedDays =
        Math.floor(
          finish.startOf('day').diff(start.startOf('day'), 'days').days
        ) + 1;
      return {
        key,
        title: 'Эта неделя',
        start: start.toMillis(),
        finish: finish.toMillis(),
        mode: 'week',
        elapsedDays,
      };
    }
    case 'month': {
      const start = now.startOf('month');
      const finish = now.endOf('day');
      const elapsedDays =
        Math.floor(
          finish.startOf('day').diff(start.startOf('day'), 'days').days
        ) + 1;
      return {
        key,
        title: 'Этот месяц',
        start: start.toMillis(),
        finish: finish.toMillis(),
        mode: 'month',
        elapsedDays,
      };
    }
    case 'lastMonth': {
      const lastMonthDate = now.minus({ months: 1 });
      const start = lastMonthDate.startOf('month');
      const finish = lastMonthDate.endOf('month');
      const elapsedDays = finish.startOf('day').diff(start.startOf('day'), 'days').days + 1;
      return {
        key,
        title: 'Прошлый месяц',
        start: start.toMillis(),
        finish: finish.toMillis(),
        mode: 'month',
        elapsedDays,
      };
    }
  }
}

export function createPeriodSnapshot(
  frame: PeriodFrameMeta,
  expenses: Expense[]
): PeriodMetricsSnapshot {
  return buildPeriodMetrics(frame, expenses);
}
