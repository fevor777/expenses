import { listExpensesForPeriodWithTagNamesResultSchema, } from '../domain/output-schemas.js';
import { listExpensesForPeriod } from '../domain/list-expenses-for-period.js';
import { listExpensesForPeriodSchema } from '../domain/schemas.js';
import { createReadOnlyAnnotations, executeTool, jsonResult } from './shared.js';
export function registerListExpensesForPeriodTool(server, deps) {
    server.registerTool('list_expenses_for_period', {
        description: 'Return raw expense records for a relative or calendar-based period in one call. Resolves timezone-aware date boundaries, then lists matching expenses. The returned expenses include tag names instead of tag ids. Prefer this over calling resolve_date_range and list_expenses separately when querying by named periods such as today, yesterday, this_week, or last_month. Optional filters: categories, description, tagIds, limit, and sort.',
        inputSchema: listExpensesForPeriodSchema,
        outputSchema: listExpensesForPeriodWithTagNamesResultSchema,
        annotations: createReadOnlyAnnotations('Expenses: List Period'),
    }, async (input) => {
        return executeTool(deps, 'list_expenses_for_period', async () => {
            const [tags, result] = await Promise.all([
                deps.tagsRepository.list(),
                listExpensesForPeriod(input, deps.expensesRepository, deps.config.maxResultLimit),
            ]);
            const tagNamesById = new Map(tags.map(tag => [tag.id, tag.name]));
            const expenses = result.expenses.map(expense => {
                const { tagIds: _tagIds, ...rest } = expense;
                return {
                    ...rest,
                    tagNames: expense.tagIds
                        ?.map(tagId => tagNamesById.get(tagId))
                        .filter((tagName) => Boolean(tagName)) ?? [],
                };
            });
            return jsonResult({
                ...result,
                expenses,
            });
        });
    });
}
