import { ResolvedCategory } from '../model/category.model';
import { DateFrame } from '../component/filter/date/dateFrame.model';
import { Budget } from '../model/budget.model';
import { Expense } from '../model/expense.model';
import { Tag } from '../model/tag.model';
import { buildBudgetLimitSummaries } from './budget-limit-summary.service';
import { DateTime, Settings } from 'luxon';

describe('buildBudgetLimitSummaries', () => {
  const categories: ResolvedCategory[] = [
    {
      id: 'meal',
      name: 'Питание',
      icon: 'fa-solid fa-bell-concierge',
      color: '#474747',
      includeInBalance: true,
      source: 'default',
      sortOrder: 0,
    },
    {
      id: 'hidden-cat',
      name: 'Скрытая',
      icon: 'fas fa-home',
      color: '#000000',
      includeInBalance: true,
      source: 'custom',
      hidden: true,
      sortOrder: 1,
    },
  ];

  const tags: Tag[] = [
    { id: 'coffee', name: 'coffee', normalizedName: 'coffee' },
    { id: 'fun', name: 'fun', normalizedName: 'fun' },
  ];
  const dateFrame: DateFrame = {
    start: DateTime.fromISO('2026-08-10T00:00:00', { zone: 'Europe/Sofia' }),
    finish: DateTime.fromISO('2026-08-14T23:59:59.999', {
      zone: 'Europe/Sofia',
    }),
  };
  const nowMillis = DateTime.fromISO('2026-08-12T09:30:00', {
    zone: 'Europe/Sofia',
  }).toMillis();

  beforeEach(() => {
    Settings.now = () => nowMillis;
  });

  afterEach(() => {
    Settings.now = () => Date.now();
  });

  it('uses only includeInBalance expenses and counts repeated tag matches independently', () => {
    const budget: Budget = {
      value: 600,
      period: 30,
      limits: [
        { id: 'category:meal', type: 'category', targetId: 'meal', value: 100 },
        { id: 'tag:coffee', type: 'tag', targetId: 'coffee', value: 50 },
      ],
    };
    const expenses: Expense[] = [
      {
        amount: 20,
        category: 'meal',
        currency: 'EUR',
        date: 1,
        includeInBalance: true,
        tagIds: ['coffee'],
      },
      {
        amount: 15,
        category: 'meal',
        currency: 'EUR',
        date: 2,
        includeInBalance: true,
        tagIds: ['coffee', 'fun'],
      },
      {
        amount: 70,
        category: 'meal',
        currency: 'EUR',
        date: 3,
        includeInBalance: false,
        tagIds: ['coffee'],
      },
    ];

    const result = buildBudgetLimitSummaries(
      budget,
      expenses,
      categories,
      tags,
      dateFrame
    );

    expect(result).toEqual([
      jasmine.objectContaining({
        id: 'category:meal',
        spent: 35,
        remaining: 65,
        rawRemaining: 65,
        percentUsed: 35,
        periodProgress: 60,
        expenseCount: 2,
        exceeded: false,
        orphaned: false,
        targetLabel: 'Питание',
      }),
      jasmine.objectContaining({
        id: 'tag:coffee',
        spent: 35,
        remaining: 15,
        rawRemaining: 15,
        percentUsed: 70,
        periodProgress: 60,
        expenseCount: 2,
        exceeded: false,
        orphaned: false,
        targetLabel: 'coffee',
      }),
    ]);
  });

  it('marks hidden categories and deleted tags as orphaned', () => {
    const budget: Budget = {
      value: 600,
      period: 30,
      limits: [
        {
          id: 'category:hidden-cat',
          type: 'category',
          targetId: 'hidden-cat',
          value: 0,
        },
        { id: 'tag:gone', type: 'tag', targetId: 'gone', value: 0 },
      ],
    };
    const expenses: Expense[] = [
      {
        amount: 5,
        category: 'hidden-cat',
        currency: 'EUR',
        date: 1,
        includeInBalance: true,
        tagIds: ['gone'],
      },
    ];

    const result = buildBudgetLimitSummaries(
      budget,
      expenses,
      categories,
      tags,
      dateFrame
    );

    expect(result).toEqual([
      jasmine.objectContaining({
        id: 'category:hidden-cat',
        orphaned: true,
        targetLabel: 'Скрытая',
        percentUsed: 100,
        periodProgress: 60,
        exceeded: true,
      }),
      jasmine.objectContaining({
        id: 'tag:gone',
        orphaned: true,
        targetLabel: 'Deleted tag (gone)',
        percentUsed: 100,
        periodProgress: 60,
        exceeded: true,
      }),
    ]);
  });
});
