import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { expenseFilterSchema, expenseFilterShape } from '../domain/schemas.js';
import { normalizeExpenseFilter } from '../domain/filters.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerSearchExpensesTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.tool(
    'search_expenses',
    'Search expenses using the same filter contract as list_expenses, including tag filters.',
    expenseFilterShape,
    async input => {
      const args = expenseFilterSchema.parse(input);
      return executeTool(deps, 'search_expenses', async () => {
        const filter = normalizeExpenseFilter(args, deps.config.maxResultLimit);
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