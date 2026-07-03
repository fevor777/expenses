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
