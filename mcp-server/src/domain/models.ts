export const CATEGORY_DEFINITIONS = [
  { id: 'subscriptions', name: 'Подписка', includeInBalance: false },
  { id: 'entertainments', name: 'Развлечение', includeInBalance: true },
  { id: 'nicotine', name: 'Сигареты', includeInBalance: true },
  { id: 'travel', name: 'Путешествие', includeInBalance: true },
  { id: 'home', name: 'Для дома', includeInBalance: true },
  { id: 'alcohol', name: 'Выпивка', includeInBalance: true },
  { id: 'meal', name: 'Питание', includeInBalance: true },
  { id: 'bus', name: 'Общ. транспорт', includeInBalance: true },
  { id: 'utility-bills', name: 'Коммуналка', includeInBalance: false },
  { id: 'pharmacy', name: 'Медицина', includeInBalance: true },
  { id: 'barbershop', name: 'Парикмахерская', includeInBalance: true },
  { id: 'electronics', name: 'Электроника', includeInBalance: true },
  { id: 'clothes', name: 'Одежда', includeInBalance: true },
  { id: 'another', name: 'Разное', includeInBalance: true },
  { id: 'sport', name: 'Спорт', includeInBalance: false },
  { id: 'rental-payment', name: 'Аренда жилья', includeInBalance: false },
] as const;

export type CategoryId = (typeof CATEGORY_DEFINITIONS)[number]['id'];

export type ExpenseDocument = {
  id: string;
  uid: string;
  amount: number;
  category: CategoryId;
  currency: string;
  date: number;
  description?: string;
  tagIds?: string[];
  includeInBalance?: boolean;
};

export type CreateExpenseInput = Omit<ExpenseDocument, 'id' | 'uid'>;

export type UpdateExpenseInput = {
  id: string;
  amount?: number;
  category?: CategoryId;
  currency?: string;
  date?: number;
  description?: string;
  tagIds?: string[];
  includeInBalance?: boolean;
};

export type TagDocument = {
  id: string;
  uid: string;
  name: string;
  normalizedName: string;
  star?: boolean;
};

export type CreateTagInput = Omit<TagDocument, 'id' | 'uid' | 'normalizedName'>;

export type UpdateTagInput = {
  id: string;
  name?: string;
  star?: boolean;
};

export type UpdateBudgetInput = {
  value?: number;
  period?: number;
  periodStartTs?: number;
  timezone?: string;
  minDayLimit?: number;
};

export type BudgetDocument = {
  uid?: string;
  value: number;
  period: number;
  periodStartTs?: number;
  timezone?: string;
  minDayLimit?: number;
};

export const DEFAULT_BUDGET: BudgetDocument = {
  value: 600,
  period: 30,
};

export function getCategoryDefinition(categoryId: CategoryId) {
  return CATEGORY_DEFINITIONS.find(category => category.id === categoryId);
}

export function getDefaultIncludeInBalance(categoryId: CategoryId): boolean {
  return getCategoryDefinition(categoryId)?.includeInBalance ?? false;
}

export function normalizeDescription(
  description?: string
): string | undefined {
  const value = description?.trim();
  return value ? value : undefined;
}

export function normalizeTagName(name?: string): string | undefined {
  const value = name?.replace(/\s+/g, ' ').trim().toLowerCase();
  return value ? value : undefined;
}

export function normalizeTagIds(tagIds?: string[]): string[] | undefined {
  if (!Array.isArray(tagIds) || tagIds.length === 0) {
    return undefined;
  }

  const normalized = Array.from(
    new Set(
      tagIds
        .filter((tagId): tagId is string => typeof tagId === 'string')
        .map(tagId => tagId.trim())
        .filter(Boolean)
    )
  ).sort((left, right) => left.localeCompare(right));

  return normalized.length > 0 ? normalized : undefined;
}

export function canonicalizeExpense(
  expense: ExpenseDocument | (CreateExpenseInput & { id: string; uid: string })
): ExpenseDocument {
  const tagIds = normalizeTagIds(expense.tagIds);
  return {
    id: expense.id,
    uid: expense.uid,
    amount: roundCurrency(expense.amount),
    category: expense.category,
    currency: expense.currency?.trim() || 'EUR',
    date: Math.trunc(expense.date),
    ...(normalizeDescription(expense.description)
      ? { description: normalizeDescription(expense.description) }
      : {}),
    ...(tagIds ? { tagIds } : {}),
    includeInBalance:
      expense.includeInBalance ?? getDefaultIncludeInBalance(expense.category),
  };
}

export function canonicalizeTag(
  tag: TagDocument | (CreateTagInput & { id: string; uid: string })
): TagDocument {
  const normalizedName = normalizeTagName(tag.name);
  if (!normalizedName) {
    throw new Error('Tag name is required');
  }

  return {
    id: tag.id,
    uid: tag.uid,
    name: tag.name.replace(/\s+/g, ' ').trim(),
    normalizedName,
    star: tag.star === true,
  };
}

export function canonicalizeBudget(budget: BudgetDocument): BudgetDocument {
  const timezone = budget.timezone?.trim();
  return {
    ...(budget.uid ? { uid: budget.uid } : {}),
    value: roundCurrency(budget.value),
    period: Math.trunc(budget.period),
    ...(budget.periodStartTs !== undefined
      ? { periodStartTs: Math.trunc(budget.periodStartTs) }
      : {}),
    ...(timezone ? { timezone } : {}),
    ...(budget.minDayLimit !== undefined
      ? { minDayLimit: roundCurrency(budget.minDayLimit) }
      : {}),
  };
}

export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function isExpenseIncludedInBalance(expense: ExpenseDocument): boolean {
  return expense.includeInBalance ?? getDefaultIncludeInBalance(expense.category);
}
