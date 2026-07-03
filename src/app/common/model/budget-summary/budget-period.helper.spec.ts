import {
  formatBudgetPeriodLabel,
  getInclusivePeriodEndMs,
} from './budget-period.helper';

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
});
