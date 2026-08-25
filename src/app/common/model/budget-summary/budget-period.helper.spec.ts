import {
  computeBudgetPeriodDaysLeft,
  computeBudgetPeriodProgress,
  formatBudgetPeriodLabel,
  getInclusivePeriodEndMs,
} from './budget-period.helper';
import { DateTime } from 'luxon';

describe('budget-period.helper', () => {
  it('builds an inclusive period end timestamp', () => {
    const start = 1_000;
    expect(getInclusivePeriodEndMs(start, 34)).toBe(
      start + 34 * 24 * 60 * 60 * 1000 - 1
    );
  });

  it('formats the inclusive end date in the requested timezone', () => {
    expect(
      formatBudgetPeriodLabel(1780606800000, 34, 'Europe/Sofia')
    ).toBe('June 5 - July 8');
  });

  it('counts the start day as elapsed progress', () => {
    const zone = 'Europe/Sofia';
    const progress = computeBudgetPeriodProgress(
      {
        start: DateTime.fromISO('2026-08-10T00:00:00', { zone }),
        finish: DateTime.fromISO('2026-08-14T23:59:59.999', { zone }),
      },
      DateTime.fromISO('2026-08-10T12:00:00', { zone })
    );

    expect(progress).toBe(20);
  });

  it('calculates progress for a middle day of the period', () => {
    const zone = 'Europe/Sofia';
    const progress = computeBudgetPeriodProgress(
      {
        start: DateTime.fromISO('2026-08-10T00:00:00', { zone }),
        finish: DateTime.fromISO('2026-08-14T23:59:59.999', { zone }),
      },
      DateTime.fromISO('2026-08-12T09:30:00', { zone })
    );

    expect(progress).toBe(60);
  });

  it('returns 100 on the last day of the period', () => {
    const zone = 'Europe/Sofia';
    const progress = computeBudgetPeriodProgress(
      {
        start: DateTime.fromISO('2026-08-10T00:00:00', { zone }),
        finish: DateTime.fromISO('2026-08-14T23:59:59.999', { zone }),
      },
      DateTime.fromISO('2026-08-14T08:00:00', { zone })
    );

    expect(progress).toBe(100);
  });

  it('returns 0 for a future period', () => {
    const zone = 'Europe/Sofia';
    const progress = computeBudgetPeriodProgress(
      {
        start: DateTime.fromISO('2026-09-10T00:00:00', { zone }),
        finish: DateTime.fromISO('2026-09-14T23:59:59.999', { zone }),
      },
      DateTime.fromISO('2026-09-09T23:00:00', { zone })
    );

    expect(progress).toBe(0);
  });

  it('clamps progress to 100 for a completed period', () => {
    const zone = 'Europe/Sofia';
    const progress = computeBudgetPeriodProgress(
      {
        start: DateTime.fromISO('2026-08-10T00:00:00', { zone }),
        finish: DateTime.fromISO('2026-08-14T23:59:59.999', { zone }),
      },
      DateTime.fromISO('2026-08-20T10:00:00', { zone })
    );

    expect(progress).toBe(100);
  });

  it('returns full days remaining after today', () => {
    const zone = 'Europe/Sofia';
    const daysLeft = computeBudgetPeriodDaysLeft(
      {
        start: DateTime.fromISO('2026-08-10T00:00:00', { zone }),
        finish: DateTime.fromISO('2026-08-14T23:59:59.999', { zone }),
      },
      DateTime.fromISO('2026-08-12T09:30:00', { zone })
    );

    expect(daysLeft).toBe(2);
  });

  it('returns zero remaining days on the last day of the period', () => {
    const zone = 'Europe/Sofia';
    const daysLeft = computeBudgetPeriodDaysLeft(
      {
        start: DateTime.fromISO('2026-08-10T00:00:00', { zone }),
        finish: DateTime.fromISO('2026-08-14T23:59:59.999', { zone }),
      },
      DateTime.fromISO('2026-08-14T08:00:00', { zone })
    );

    expect(daysLeft).toBe(0);
  });
});
