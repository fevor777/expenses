import type { ExpensesRepository } from '../firestore/expenses.repository.js';
import {
  type ResolvedDateRange,
  resolveDateRange,
  type ResolveDateRangeInput,
} from './date-range.js';
import {
  type ExpenseFilterInput,
  type NormalizedExpenseFilter,
  normalizeExpenseFilter,
} from './filters.js';
import type { ExpenseDocument } from './models.js';

export type ListExpensesForPeriodInput = ResolveDateRangeInput &
  Pick<
    ExpenseFilterInput,
    'categories' | 'description' | 'tagIds' | 'limit' | 'sort'
  >;

export type ListExpensesForPeriodResult = {
  dateRange: ResolvedDateRange;
  filter: NormalizedExpenseFilter;
  count: number;
  expenses: ExpenseDocument[];
};

export async function listExpensesForPeriod(
  input: ListExpensesForPeriodInput,
  expensesRepository: ExpensesRepository,
  maxResultLimit: number
): Promise<ListExpensesForPeriodResult> {
  const dateRange = resolveDateRange(input);
  const filter = normalizeExpenseFilter(
    {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      categories: input.categories,
      description: input.description,
      tagIds: input.tagIds,
      limit: input.limit,
      sort: input.sort,
    },
    maxResultLimit
  );
  const expenses = await expensesRepository.list(filter);

  return {
    dateRange,
    filter,
    count: expenses.length,
    expenses,
  };
}
