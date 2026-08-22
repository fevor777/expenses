import { firstValueFrom } from 'rxjs';

import { IrregularBudgetStoreService } from './irregular-budget-store.service';

describe('IrregularBudgetStoreService', () => {
  let service: IrregularBudgetStoreService;

  beforeEach(() => {
    localStorage.clear();
    service = new IrregularBudgetStoreService();
  });

  it('persists normalized limits in local storage', async () => {
    await firstValueFrom(
      service.addValueObs({
        uid: 'user-1',
        value: 700,
        period: 30,
        limits: [
          { id: 'custom', type: 'tag', targetId: ' coffee ', value: 12.555 },
          { id: 'duplicate', type: 'tag', targetId: 'coffee', value: 99 },
        ],
      })
    );

    expect(JSON.parse(localStorage.getItem('irregularBudget') || '{}')).toEqual(
      jasmine.objectContaining({
        uid: 'user-1',
        value: 700,
        period: 30,
        limits: [
          {
            id: 'tag:coffee',
            type: 'tag',
            targetId: 'coffee',
            value: 12.56,
          },
        ],
      })
    );
  });

  it('rehydrates legacy budget and keeps limits during migration', async () => {
    localStorage.setItem(
      'irregularBudget',
      JSON.stringify({
        value: 600,
        period: 30,
        periodStart: 5,
        limits: [{ type: 'category', targetId: 'meal', value: 90 }],
      })
    );

    const budget = await firstValueFrom(service.getValueObs());

    expect(budget.periodStartTs).toEqual(jasmine.any(Number));
    expect(budget.timezone).toEqual(jasmine.any(String));
    expect(budget.limits).toEqual([
      {
        id: 'category:meal',
        type: 'category',
        targetId: 'meal',
        value: 90,
      },
    ]);
  });
});
