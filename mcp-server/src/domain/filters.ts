import type { CategoryId, ExpenseDocument } from './models.js';

export type ExpenseFilterInput = {
  startDate?: number;
  endDate?: number;
  categories?: CategoryId[];
  description?: string;
  tagIds?: string[];
  limit?: number;
  sort?: 'asc' | 'desc';
};

export type NormalizedExpenseFilter = {
  startDate?: number;
  endDate?: number;
  categories: CategoryId[];
  description?: string;
  tagIds: string[];
  limit: number;
  sort: 'asc' | 'desc';
};

export function normalizeExpenseFilter(
  input: ExpenseFilterInput,
  maxResultLimit: number
): NormalizedExpenseFilter {
  if (
    input.startDate !== undefined &&
    input.endDate !== undefined &&
    input.startDate > input.endDate
  ) {
    throw new Error('startDate must be less than or equal to endDate');
  }

  const categories = Array.from(new Set(input.categories ?? []));
  const description = input.description?.trim().toLowerCase() || undefined;
  const tagIds = Array.from(
    new Set(
      (input.tagIds ?? [])
        .filter((tagId): tagId is string => typeof tagId === 'string')
        .map(tagId => tagId.trim())
        .filter(Boolean)
    )
  );
  const limit = Math.min(
    Math.max(1, input.limit ?? Math.min(maxResultLimit, 100)),
    maxResultLimit
  );

  return {
    startDate: input.startDate,
    endDate: input.endDate,
    categories,
    description,
    tagIds,
    limit,
    sort: input.sort ?? 'desc',
  };
}

export function applyDescriptionFilter(
  expenses: ExpenseDocument[],
  description?: string
): ExpenseDocument[] {
  if (!description) {
    return expenses;
  }

  return expenses.filter(expense =>
    (expense.description || '').toLowerCase().includes(description)
  );
}

export function applyTagIdsFilter(
  expenses: ExpenseDocument[],
  tagIds: string[]
): ExpenseDocument[] {
  if (!tagIds.length) {
    return expenses;
  }

  return expenses.filter(expense =>
    (expense.tagIds || []).some(tagId => tagIds.includes(tagId))
  );
}