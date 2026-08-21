export const CATEGORY_DEFINITIONS = [
  {
    id: 'subscriptions',
    name: 'Подписка',
    icon: 'fas fa-newspaper',
    color: '#FFC107',
    includeInBalance: false,
  },
  {
    id: 'entertainments',
    name: 'Развлечение',
    icon: 'fas fa-film',
    color: '#795548',
    includeInBalance: true,
  },
  {
    id: 'nicotine',
    name: 'Сигареты',
    icon: 'fas fa-smoking',
    color: '#FF5722',
    includeInBalance: true,
  },
  {
    id: 'travel',
    name: 'Путешествие',
    icon: 'fas fa-plane',
    color: '#009688',
    includeInBalance: true,
  },
  {
    id: 'home',
    name: 'Для дома',
    icon: 'fas fa-home',
    color: '#9C27B0',
    includeInBalance: true,
  },
  {
    id: 'alcohol',
    name: 'Выпивка',
    icon: 'fas fa-wine-bottle',
    color: '#FF5722',
    includeInBalance: true,
  },
  {
    id: 'meal',
    name: 'Питание',
    icon: 'fa-solid fa-bell-concierge',
    color: '#474747',
    includeInBalance: true,
  },
  {
    id: 'bus',
    name: 'Общ. транспорт',
    icon: 'fas fa-bus',
    color: '#3F51B5',
    includeInBalance: true,
  },
  {
    id: 'utility-bills',
    name: 'Коммуналка',
    icon: 'fas fa-water',
    color: '#2196F3',
    includeInBalance: false,
  },
  {
    id: 'pharmacy',
    name: 'Медицина',
    icon: 'fas fa-prescription-bottle-alt',
    color: '#2196F3',
    includeInBalance: true,
  },
  {
    id: 'barbershop',
    name: 'Парикмахерская',
    icon: 'fas fa-cut',
    color: '#FFC107',
    includeInBalance: true,
  },
  {
    id: 'electronics',
    name: 'Электроника',
    icon: 'fas fa-tablet-alt',
    color: '#9E9E9E',
    includeInBalance: true,
  },
  {
    id: 'clothes',
    name: 'Одежда',
    icon: 'fas fa-tshirt',
    color: '#a99e00',
    includeInBalance: true,
  },
  {
    id: 'another',
    name: 'Разное',
    icon: 'fas fa-random',
    color: '#FF5722',
    includeInBalance: true,
  },
  {
    id: 'sport',
    name: 'Спорт',
    icon: 'fas fa-dumbbell',
    color: '#607D8B',
    includeInBalance: false,
  },
  {
    id: 'rental-payment',
    name: 'Аренда жилья',
    icon: 'fas fa-building',
    color: '#673AB7',
    includeInBalance: false,
  },
] as const;

export type BuiltInCategoryId = (typeof CATEGORY_DEFINITIONS)[number]['id'];
export type CategoryId = string;

export type CategoryOverrideDocument = {
  id: string;
  source: 'default-override' | 'custom';
  baseCategoryId?: string;
  name?: string;
  icon?: string;
  color?: string;
  includeInBalance?: boolean;
  isDeleted?: boolean;
  normalizedName?: string;
  createdAt: number;
  updatedAt: number;
};

export type ResolvedCategory = {
  id: string;
  name: string;
  icon: string;
  color: string;
  includeInBalance: boolean;
  source: 'default' | 'default-override' | 'custom';
};

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

export function normalizeDescription(description?: string): string | undefined {
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
  return (
    expense.includeInBalance ?? getDefaultIncludeInBalance(expense.category)
  );
}
