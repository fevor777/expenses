import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ResolvedCategoriesProvider,
  resolveCategories,
} from '../dist/domain/categories.js';
import { CATEGORY_DEFINITIONS } from '../dist/domain/models.js';
import {
  createExpenseSchema,
  expenseFilterSchema,
} from '../dist/domain/schemas.js';
import { expenseDocumentSchema } from '../dist/domain/output-schemas.js';
import { CategoriesRepository } from '../dist/firestore/categories.repository.js';
import { registerCreateExpenseTool } from '../dist/tools/create-expense.js';
import { registerUpdateExpenseTool } from '../dist/tools/update-expense.js';

function override(value) {
  return {
    createdAt: 1,
    updatedAt: 1,
    ...value,
  };
}

test('resolveCategories merges overrides, hides defaults, and adds custom categories', () => {
  const categories = resolveCategories([
    override({
      id: 'meal',
      source: 'default-override',
      name: 'Кафе',
      icon: 'fas fa-mug-hot',
      color: '#123456',
      includeInBalance: false,
      normalizedName: 'кафе',
    }),
    override({
      id: 'subscriptions',
      source: 'default-override',
      isDeleted: true,
    }),
    override({
      id: 'custom_gifts',
      source: 'custom',
      name: 'Подарки',
      icon: 'fas fa-gift',
      color: '#abcdef',
      includeInBalance: true,
      normalizedName: 'подарки',
    }),
  ]);

  assert.equal(categories.length, CATEGORY_DEFINITIONS.length);
  assert.equal(
    categories.some(category => category.id === 'subscriptions'),
    false
  );
  assert.deepEqual(
    categories.find(category => category.id === 'meal'),
    {
      id: 'meal',
      name: 'Кафе',
      icon: 'fas fa-mug-hot',
      color: '#123456',
      includeInBalance: false,
      source: 'default-override',
    }
  );
  assert.deepEqual(
    categories.find(category => category.id === 'custom_gifts'),
    {
      id: 'custom_gifts',
      name: 'Подарки',
      icon: 'fas fa-gift',
      color: '#abcdef',
      includeInBalance: true,
      source: 'custom',
    }
  );

  const names = categories.map(category => category.name);
  assert.deepEqual(
    names,
    [...names].sort((left, right) => left.localeCompare(right, 'ru'))
  );
});

test('resolveCategories keeps built-in ids authoritative', () => {
  const categories = resolveCategories([
    override({
      id: 'meal',
      source: 'custom',
      name: 'Collision',
      includeInBalance: false,
    }),
  ]);

  assert.equal(categories.filter(category => category.id === 'meal').length, 1);
  assert.equal(
    categories.find(category => category.id === 'meal')?.source,
    'default'
  );
});

test('resolveCategories skips incomplete custom documents like the client merge', () => {
  const categories = resolveCategories([
    override({
      id: 'custom_incomplete',
      source: 'custom',
      name: 'Incomplete',
      includeInBalance: true,
    }),
  ]);

  assert.equal(
    categories.some(category => category.id === 'custom_incomplete'),
    false
  );
});

test('ResolvedCategoriesProvider rejects unknown and inactive ids', async () => {
  const provider = new ResolvedCategoriesProvider({
    async list() {
      return [
        override({
          id: 'meal',
          source: 'default-override',
          isDeleted: true,
        }),
      ];
    },
  });

  await assert.rejects(
    provider.requireById('meal'),
    /Unknown or inactive category id: meal/u
  );
  await assert.rejects(
    provider.requireById('custom_missing'),
    /Unknown or inactive category id: custom_missing/u
  );
});

test('category schemas accept custom ids for inputs, filters, and stored expenses', () => {
  assert.equal(
    createExpenseSchema.parse({
      amount: 12.5,
      category: 'custom_gifts',
      date: 1,
    }).category,
    'custom_gifts'
  );
  assert.deepEqual(
    expenseFilterSchema.parse({ categories: ['custom_gifts'] }).categories,
    ['custom_gifts']
  );
  assert.equal(
    expenseDocumentSchema.parse({
      id: 'expense-1',
      uid: 'user-1',
      amount: 12.5,
      category: 'custom_gifts',
      currency: 'EUR',
      date: 1,
      includeInBalance: true,
    }).category,
    'custom_gifts'
  );
});

test('CategoriesRepository reads only the current user subcollection', async () => {
  const calls = [];
  const firestore = {
    collection(collectionName) {
      calls.push(['collection', collectionName]);
      return {
        doc(documentId) {
          calls.push(['doc', documentId]);
          return {
            collection(subcollectionName) {
              calls.push(['subcollection', subcollectionName]);
              return {
                async get() {
                  return {
                    docs: [
                      {
                        id: 'custom_gifts',
                        data: () => ({
                          id: 'ignored-embedded-id',
                          source: 'custom',
                          name: 'Подарки',
                          includeInBalance: true,
                          createdAt: { toMillis: () => 10.9 },
                          updatedAt: 20.9,
                        }),
                      },
                      {
                        id: 'invalid',
                        data: () => ({ source: 'unsupported' }),
                      },
                    ],
                  };
                },
              };
            },
          };
        },
      };
    },
  };

  const repository = new CategoriesRepository(firestore, 'user-1');
  const documents = await repository.list();

  assert.deepEqual(calls, [
    ['collection', 'users'],
    ['doc', 'user-1'],
    ['subcollection', 'category-overrides'],
  ]);
  assert.deepEqual(documents, [
    {
      id: 'custom_gifts',
      source: 'custom',
      name: 'Подарки',
      includeInBalance: true,
      createdAt: 10,
      updatedAt: 20,
    },
  ]);
});

test('create_expense snapshots resolved includeInBalance unless explicitly overridden', async () => {
  const createdInputs = [];
  const handler = captureToolHandler(registerCreateExpenseTool, {
    categoriesProvider: {
      async requireById(id) {
        assert.equal(id, 'custom_gifts');
        return { includeInBalance: false };
      },
    },
    expensesRepository: {
      async create(input) {
        createdInputs.push(input);
        return { id: 'expense-1', uid: 'user-1', ...input };
      },
    },
  });

  await handler({ amount: 10, category: 'custom_gifts', date: 1 });
  await handler({
    amount: 20,
    category: 'custom_gifts',
    date: 2,
    includeInBalance: true,
  });

  assert.equal(createdInputs[0].includeInBalance, false);
  assert.equal(createdInputs[1].includeInBalance, true);
});

test('update_expense refreshes includeInBalance only when category changes', async () => {
  const updatedInputs = [];
  const handler = captureToolHandler(registerUpdateExpenseTool, {
    categoriesProvider: {
      async requireById(id) {
        assert.equal(id, 'custom_gifts');
        return { includeInBalance: false };
      },
    },
    expensesRepository: {
      async update(input) {
        updatedInputs.push(input);
        return {
          id: input.id,
          uid: 'user-1',
          amount: input.amount ?? 1,
          category: input.category ?? 'meal',
          currency: 'EUR',
          date: 1,
          includeInBalance: input.includeInBalance ?? true,
        };
      },
    },
  });

  await handler({ id: 'expense-1', category: 'custom_gifts' });
  await handler({
    id: 'expense-2',
    category: 'custom_gifts',
    includeInBalance: true,
  });
  await handler({ id: 'expense-3', amount: 30 });

  assert.equal(updatedInputs[0].includeInBalance, false);
  assert.equal(updatedInputs[1].includeInBalance, true);
  assert.equal('includeInBalance' in updatedInputs[2], false);
});

test('create_expense returns a handled invalid_input error for inactive category ids', async () => {
  const provider = new ResolvedCategoriesProvider({
    async list() {
      return [];
    },
  });
  const handler = captureToolHandler(registerCreateExpenseTool, {
    categoriesProvider: provider,
    expensesRepository: {
      async create() {
        assert.fail('repository must not be called for an invalid category');
      },
    },
  });

  const result = await handler({
    amount: 10,
    category: 'custom_missing',
    date: 1,
  });

  assert.equal(result.isError, true);
  assert.equal(result.structuredContent.error.code, 'invalid_input');
});

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
    config: {},
    logger,
    settingsRepository: {},
    tagsRepository: {},
    ...dependencyOverrides,
  });

  assert.equal(typeof handler, 'function');
  return handler;
}
