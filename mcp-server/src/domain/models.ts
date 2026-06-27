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
  includeInBalance?: boolean;
};

export type UpdateBudgetInput = {
  value?: number;
  period?: number;
  periodStartTs?: number;
  minDayLimit?: number;
};

export type BudgetDocument = {
  uid?: string;
  value: number;
  period: number;
  periodStartTs?: number;
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

export function canonicalizeExpense(
  expense: ExpenseDocument | (CreateExpenseInput & { id: string; uid: string })
): ExpenseDocument {
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
    includeInBalance:
      expense.includeInBalance ?? getDefaultIncludeInBalance(expense.category),
  };
}

export function canonicalizeBudget(budget: BudgetDocument): BudgetDocument {
  return {
    ...(budget.uid ? { uid: budget.uid } : {}),
    value: roundCurrency(budget.value),
    period: Math.trunc(budget.period),
    ...(budget.periodStartTs !== undefined
      ? { periodStartTs: Math.trunc(budget.periodStartTs) }
      : {}),
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