import { DateTime } from 'luxon';

import { DateFrame } from '../../component/filter/date/dateFrame.model';

const DAY_MS = 24 * 60 * 60 * 1000;

export function normalizePeriodDays(periodDays: number): number {
  const normalized = Math.floor(periodDays || 0);
  return normalized > 0 ? normalized : 1;
}

export function getInclusivePeriodEndMs(
  startMs: number,
  periodDays: number
): number {
  return startMs + normalizePeriodDays(periodDays) * DAY_MS - 1;
}

export function formatBudgetPeriodLabel(
  startMs: number,
  periodDays: number,
  timeZone?: string
): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    ...(timeZone ? { timeZone } : {}),
  });
  const endMs = getInclusivePeriodEndMs(startMs, periodDays);
  return `${formatter.format(new Date(startMs))} - ${formatter.format(
    new Date(endMs)
  )}`;
}

export function countInclusiveCalendarDays(
  startMs: number,
  finishMs: number
): number {
  const start = new Date(startMs);
  const finish = new Date(finishMs);
  const startUtc = Date.UTC(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );
  const finishUtc = Date.UTC(
    finish.getFullYear(),
    finish.getMonth(),
    finish.getDate()
  );
  return Math.max(1, Math.floor((finishUtc - startUtc) / DAY_MS) + 1);
}

export function countInclusiveDaysPassed(
  startMs: number,
  nowMs: number
): number {
  if (nowMs < startMs) return 0;

  const start = new Date(startMs);
  const now = new Date(nowMs);
  const startUtc = Date.UTC(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );
  const nowUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.floor((nowUtc - startUtc) / DAY_MS) + 1);
}

export function computeBudgetPeriodProgress(
  dateFrame: DateFrame,
  now: DateTime = DateTime.now()
): number {
  const start = dateFrame.start.startOf('day');
  const finish = dateFrame.finish.endOf('day');

  if (!start.isValid || !finish.isValid || finish < start) {
    return 0;
  }

  const nowInPeriodZone = now.setZone(start.zoneName);
  if (nowInPeriodZone < start) {
    return 0;
  }

  const totalDays = Math.max(
    1,
    Math.floor(finish.startOf('day').diff(start, 'days').days) + 1
  );
  const daysPassed = Math.max(
    0,
    Math.floor(nowInPeriodZone.startOf('day').diff(start, 'days').days) + 1
  );

  return roundProgress(clamp((daysPassed / totalDays) * 100, 0, 100));
}

export function computeBudgetPeriodDaysLeft(
  dateFrame: DateFrame,
  now: DateTime = DateTime.now()
): number {
  const finish = dateFrame.finish.endOf('day');

  if (!finish.isValid) {
    return 0;
  }

  const nowInPeriodZone = now.setZone(finish.zoneName).endOf('day');
  if (nowInPeriodZone >= finish) {
    return 0;
  }

  return Math.max(0, Math.ceil(finish.diff(nowInPeriodZone, 'days').days));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function roundProgress(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
