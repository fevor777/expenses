import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { expenseCollectionResultShape } from '../domain/output-schemas.js';
import { expenseFilterSchema } from '../domain/schemas.js';
import { normalizeExpenseFilter } from '../domain/filters.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerListExpensesTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.registerTool(
    'list_expenses',
    {
      description:
        'Return raw expense records for the authenticated user for a custom time window. Use this tool when startDate and endDate timestamps are already known. For relative or calendar-based periods such as today, yesterday, this_week, or last_month, prefer list_expenses_for_period instead. Use this tool for daily, weekly, or custom period analysis when you need individual expenses, not an aggregated summary. Optional filters: categories, description, tagIds, limit, and sort.',
      inputSchema: expenseFilterSchema,
      outputSchema: expenseCollectionResultShape,
    },
    async input => {
      return executeTool(deps, 'list_expenses', async () => {
        const filter = normalizeExpenseFilter(input, deps.config.maxResultLimit);
        const expenses = await deps.expensesRepository.list(filter);

        return jsonResult({
          filter,
          count: expenses.length,
          expenses,
        });
      });
    }
  );
}