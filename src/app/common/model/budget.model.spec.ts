import {
  buildBudgetLimitId,
  canonicalizeBudget,
  normalizeBudgetLimits,
} from './budget.model';

describe('budget.model', () => {
  it('normalizes, deduplicates, and sorts budget limits', () => {
    expect(
      normalizeBudgetLimits([
        { type: 'tag', targetId: ' tag-b ', value: 14.556, id: 'ignored' },
        { type: 'category', targetId: 'meal', value: 0 },
        { type: 'tag', targetId: 'tag-b', value: 99 },
        { type: 'category', targetId: ' ', value: 10 },
        { type: 'tag', targetId: 'tag-a', value: -1 },
      ])
    ).toEqual([
      {
        id: buildBudgetLimitId('category', 'meal'),
        type: 'category',
        targetId: 'meal',
        value: 0,
      },
      {
        id: buildBudgetLimitId('tag', 'tag-b'),
        type: 'tag',
        targetId: 'tag-b',
        value: 14.56,
      },
    ]);
  });

  it('canonicalizes budget and keeps normalized limits', () => {
    expect(
      canonicalizeBudget(
        {
          uid: 'user-1',
          value: 801.239,
          period: 45.8,
          timezone: ' Europe/Sofia ',
          minDayLimit: 12.345,
          limits: [
            { type: 'tag', targetId: 'coffee', value: 35 },
            { type: 'category', targetId: 'meal', value: 120.999 },
          ],
        },
        'UTC'
      )
    ).toEqual({
      uid: 'user-1',
      value: 801.24,
      period: 45,
      timezone: 'Europe/Sofia',
      minDayLimit: 12.35,
      limits: [
        {
          id: buildBudgetLimitId('category', 'meal'),
          type: 'category',
          targetId: 'meal',
          value: 121,
        },
        {
          id: buildBudgetLimitId('tag', 'coffee'),
          type: 'tag',
          targetId: 'coffee',
          value: 35,
        },
      ],
    });
  });
});
