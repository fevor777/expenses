import { resolveDateRange, } from './date-range.js';
import { normalizeExpenseFilter, } from './filters.js';
export async function listExpensesForPeriod(input, expensesRepository, maxResultLimit) {
    const dateRange = resolveDateRange(input);
    const filter = normalizeExpenseFilter({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        categories: input.categories,
        description: input.description,
        tagIds: input.tagIds,
        limit: input.limit,
        sort: input.sort,
    }, maxResultLimit);
    const expenses = await expensesRepository.list(filter);
    return {
        dateRange,
        filter,
        count: expenses.length,
        expenses,
    };
}
