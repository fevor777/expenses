import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { expenseCollectionResultShape } from '../domain/output-schemas.js';
import { expenseFilterSchema } from '../domain/schemas.js';
import { normalizeExpenseFilter } from '../domain/filters.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerSearchExpensesTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.registerTool(
    'search_expenses',
    {
      description:
        'Search expenses using the same filter contract as list_expenses, including tag filters.',
      inputSchema: expenseFilterSchema,
      outputSchema: expenseCollectionResultShape,
    },
    async input => {
      return executeTool(deps, 'search_expenses', async () => {
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