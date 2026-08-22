import assert from 'node:assert/strict';
import test from 'node:test';
import { canonicalizeBudget } from '../dist/domain/models.js';
import { updateBudgetSchema } from '../dist/domain/schemas.js';
import { summarizeExpensesForFrame } from '../dist/domain/summaries.js';
import { SettingsRepository } from '../dist/firestore/settings.repository.js';
import { registerBudgetPeriodSummaryTool } from '../dist/tools/budget-period-summary.js';
import { registerBudgetSummaryTool } from '../dist/tools/budget-summary.js';
import { registerGetBudgetTool } from '../dist/tools/get-budget.js';
import { registerUpdateBudgetTool } from '../dist/tools/update-budget.js';

test('canonicalizeBudget normalizes, deduplicates, and sorts budget limits', () => {
  const budget = canonicalizeBudget({
    value: 600,
    period: 30,
    limits: [
      { id: ' ', type: 'tag', targetId: ' trip ', value: 10.129 },
      { id: 'duplicate', type: 'tag', targetId: 'trip', value: 999 },
      { id: ' meal-limit ', type: 'category', targetId: ' meal ', value: 0 },
      { id: 'invalid-type', type: 'invalid', targetId: 'x', value: 1 },
      { id: 'invalid-value', type: 'tag', targetId: 'bad', value: -1 },
      { id: 'missing-target', type: 'tag', targetId: ' ', value: 1 },
    ],
  });

  assert.deepEqual(budget.limits, [
    {
      id: 'meal-limit',
      type: 'category',
      targetId: 'meal',
      value: 0,
    },
    {
      id: 'tag:trip',
      type: 'tag',
      targetId: 'trip',
      value: 10.13,
    },
  ]);
});

test('updateBudgetSchema rejects invalid budget limit payloads', () => {
  assert.throws(
    () =>
      updateBudgetSchema.parse({
        limits: [{ id: 'tag:oops', type: 'invalid', targetId: 'oops', value: 1 }],
      }),
    /Invalid enum value/u
  );
  assert.throws(
    () =>
      updateBudgetSchema.parse({
        limits: [{ id: 'tag:oops', type: 'tag', targetId: 'oops', value: -1 }],
      }),
    /Number must be greater than or equal to 0/u
  );
});

test('SettingsRepository reads, writes, and clears budget limits', async () => {
  const state = createFirestoreState({
    irregularBudget: {
      value: 750,
      period: 30,
      limits: [
        { id: 'tag:trip', type: 'tag', targetId: ' trip ', value: 50.555 },
        { id: 'duplicate', type: 'tag', targetId: 'trip', value: 1 },
      ],
    },
  });
  const repository = new SettingsRepository(state.firestore, 'user-1');

  const stored = await repository.getBudget();
  assert.deepEqual(stored?.limits, [
    {
      id: 'tag:trip',
      type: 'tag',
      targetId: 'trip',
      value: 50.56,
    },
  ]);

  const updated = await repository.updateBudget({
    limits: [
      { id: 'category:meal', type: 'category', targetId: 'meal', value: 120 },
    ],
  });
  assert.deepEqual(updated.limits, [
    {
      id: 'category:meal',
      type: 'category',
      targetId: 'meal',
      value: 120,
    },
  ]);
  assert.deepEqual(state.getBudgetDoc().limits, updated.limits);

  const cleared = await repository.updateBudget({ limits: [] });
  assert.equal(cleared.limits, undefined);
  assert.equal('limits' in state.getBudgetDoc(), false);
});

test('budget_summary and budget_period_summary include limitSummaries', async () => {
  const budget = {
    value: 600,
    period: 30,
    periodStartTs: new Date(2026, 7, 1, 0, 0, 0, 0).getTime(),
    limits: [
      { id: 'category:meal', type: 'category', targetId: 'meal', value: 30 },
      { id: 'tag:trip', type: 'tag', targetId: 'tag-trip', value: 20 },
      { id: 'tag:missing', type: 'tag', targetId: 'tag-missing', value: 0 },
    ],
  };
  const expenses = [
    {
      id: 'expense-1',
      uid: 'user-1',
      amount: 12,
      category: 'meal',
      currency: 'EUR',
      date: new Date(2026, 7, 2).getTime(),
      tagIds: ['tag-trip'],
      includeInBalance: true,
    },
    {
      id: 'expense-2',
      uid: 'user-1',
      amount: 8,
      category: 'meal',
      currency: 'EUR',
      date: new Date(2026, 7, 3).getTime(),
      includeInBalance: false,
    },
    {
      id: 'expense-3',
      uid: 'user-1',
      amount: 25,
      category: 'travel',
      currency: 'EUR',
      date: new Date(2026, 7, 4).getTime(),
      tagIds: ['tag-trip', 'tag-missing'],
      includeInBalance: true,
    },
  ];

  const restoreDateNow = mockDateNow(new Date(2026, 7, 22, 12, 0, 0, 0).getTime());
  try {
    const summaryHandler = captureToolHandler(registerBudgetSummaryTool, {
      settingsRepository: {
        async getBudget() {
          return budget;
        },
        async getSavings() {
          return 0;
        },
      },
      categoriesProvider: {
        async list() {
          return [
            {
              id: 'meal',
              name: 'Food',
              icon: 'icon',
              color: '#111111',
              includeInBalance: true,
              source: 'default',
            },
          ];
        },
      },
      tagsRepository: {
        async list() {
          return [
            {
              id: 'tag-trip',
              uid: 'user-1',
              name: 'Trip',
              normalizedName: 'trip',
              star: false,
            },
          ];
        },
      },
      expensesRepository: {
        async listInRange() {
          return expenses;
        },
      },
    });

    const budgetSummaryResult = await summaryHandler({});
    assert.deepEqual(budgetSummaryResult.structuredContent.summary.limitSummaries, [
      {
        id: 'category:meal',
        type: 'category',
        targetId: 'meal',
        targetLabel: 'Food',
        orphaned: false,
        budget: 30,
        spent: 12,
        remaining: 18,
        percentUsed: 40,
        expenseCount: 1,
        exceeded: false,
      },
      {
        id: 'tag:missing',
        type: 'tag',
        targetId: 'tag-missing',
        targetLabel: 'Deleted tag (tag-missing)',
        orphaned: true,
        budget: 0,
        spent: 25,
        remaining: 0,
        percentUsed: 100,
        expenseCount: 1,
        exceeded: true,
      },
      {
        id: 'tag:trip',
        type: 'tag',
        targetId: 'tag-trip',
        targetLabel: 'Trip',
        orphaned: false,
        budget: 20,
        spent: 37,
        remaining: 0,
        percentUsed: 100,
        expenseCount: 2,
        exceeded: true,
      },
    ]);

    const periodHandler = captureToolHandler(registerBudgetPeriodSummaryTool, {
      settingsRepository: {
        async getBudget() {
          return budget;
        },
        async getSavings() {
          return 0;
        },
      },
      categoriesProvider: {
        async list() {
          return [
            {
              id: 'meal',
              name: 'Food',
              icon: 'icon',
              color: '#111111',
              includeInBalance: true,
              source: 'default',
            },
          ];
        },
      },
      tagsRepository: {
        async list() {
          return [
            {
              id: 'tag-trip',
              uid: 'user-1',
              name: 'Trip',
              normalizedName: 'trip',
              star: false,
            },
          ];
        },
      },
      expensesRepository: {
        async listInRange() {
          return expenses;
        },
      },
    });

    const periodResult = await periodHandler({ periodOffset: -1 });
    assert.equal(periodResult.structuredContent.periodOffset, -1);
    assert.deepEqual(
      periodResult.structuredContent.summary.limitSummaries,
      budgetSummaryResult.structuredContent.summary.limitSummaries
    );
  } finally {
    restoreDateNow();
  }
});

test('get_budget returns stored limits and update_budget accepts limits-only input', async () => {
  const updateCalls = [];
  const getBudgetHandler = captureToolHandler(registerGetBudgetTool, {
    settingsRepository: {
      async getBudget() {
        return {
          value: 600,
          period: 30,
          limits: [
            { id: 'tag:trip', type: 'tag', targetId: 'tag-trip', value: 50 },
          ],
        };
      },
    },
  });
  const updateBudgetHandler = captureToolHandler(registerUpdateBudgetTool, {
    settingsRepository: {
      async updateBudget(input) {
        updateCalls.push(input);
        return {
          value: 600,
          period: 30,
          limits: input.limits,
        };
      },
    },
  });

  const getBudgetResult = await getBudgetHandler();
  assert.deepEqual(getBudgetResult.structuredContent.budget.limits, [
    { id: 'tag:trip', type: 'tag', targetId: 'tag-trip', value: 50 },
  ]);

  const updateBudgetResult = await updateBudgetHandler({
    limits: [{ id: 'category:meal', type: 'category', targetId: 'meal', value: 40 }],
  });
  assert.deepEqual(updateCalls, [
    {
      limits: [
        { id: 'category:meal', type: 'category', targetId: 'meal', value: 40 },
      ],
    },
  ]);
  assert.deepEqual(updateBudgetResult.structuredContent.budget.limits, [
    { id: 'category:meal', type: 'category', targetId: 'meal', value: 40 },
  ]);
});

test('summarizeExpensesForFrame computes orphaned and includeInBalance-aware limit totals', () => {
  const summary = summarizeExpensesForFrame(
    [
      {
        id: 'expense-1',
        uid: 'user-1',
        amount: 10,
        category: 'meal',
        currency: 'EUR',
        date: 1,
        tagIds: ['tag-trip'],
        includeInBalance: true,
      },
      {
        id: 'expense-2',
        uid: 'user-1',
        amount: 5,
        category: 'meal',
        currency: 'EUR',
        date: 2,
        tagIds: ['tag-trip'],
        includeInBalance: false,
      },
    ],
    {
      value: 100,
      period: 30,
      limits: [
        { id: 'category:meal', type: 'category', targetId: 'meal', value: 12 },
        { id: 'tag:orphan', type: 'tag', targetId: 'tag-orphan', value: 0 },
      ],
    },
    0,
    {
      start: 1,
      finish: 2,
      periodDays: 30,
      display: 'frame',
    },
    false,
    2,
    {
      categories: [
        {
          id: 'meal',
          name: 'Food',
          icon: 'icon',
          color: '#111111',
          includeInBalance: true,
          source: 'default',
        },
      ],
      tags: [],
    }
  );

  assert.deepEqual(summary.limitSummaries, [
    {
      id: 'category:meal',
      type: 'category',
      targetId: 'meal',
      targetLabel: 'Food',
      orphaned: false,
      budget: 12,
      spent: 10,
      remaining: 2,
      percentUsed: 83.33,
      expenseCount: 1,
      exceeded: false,
    },
    {
      id: 'tag:orphan',
      type: 'tag',
      targetId: 'tag-orphan',
      targetLabel: 'Deleted tag (tag-orphan)',
      orphaned: true,
      budget: 0,
      spent: 0,
      remaining: 0,
      percentUsed: 0,
      expenseCount: 0,
      exceeded: false,
    },
  ]);
});

function createFirestoreState(initialState) {
  const state = {
    irregularBudget: initialState.irregularBudget ?? null,
    savings: initialState.savings ?? null,
  };

  return {
    firestore: {
      collection(name) {
        return {
          doc() {
            return {
              async get() {
                const data = state[name];
                return {
                  exists: data !== null,
                  data: () => data,
                };
              },
              async set(value) {
                state[name] = structuredClone(value);
              },
            };
          },
        };
      },
    },
    getBudgetDoc() {
      return state.irregularBudget;
    },
  };
}

function captureToolHandler(registerTool, dependencyOverrides) {
  let handler;
  const server = {
    registerTool(_name, _definition, registeredHandler) {
      handler = registeredHandler;
    },
  };
  const logger = {
    info() {},
    warn() {},
    error() {},
  };

  registerTool(server, {
    config: { maxResultLimit: 500 },
    logger,
    settingsRepository: {},
    tagsRepository: {},
    categoriesProvider: {},
    expensesRepository: {},
    ...dependencyOverrides,
  });

  assert.equal(typeof handler, 'function');
  return handler;
}

function mockDateNow(nowMs) {
  const original = Date.now;
  Date.now = () => nowMs;
  return () => {
    Date.now = original;
  };
}
