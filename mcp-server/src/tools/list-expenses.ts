import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { expenseFilterSchema, expenseFilterShape } from '../domain/schemas.js';
import { normalizeExpenseFilter } from '../domain/filters.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerListExpensesTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.tool(
    'list_expenses',
    'List expenses using the same date, category, and description semantics as the Angular application.',
    expenseFilterShape,
    async input => {
      const args = expenseFilterSchema.parse(input);
      return executeTool(deps, 'list_expenses', async () => {
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