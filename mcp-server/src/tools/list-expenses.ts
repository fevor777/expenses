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
        'List expenses using the same date, category, description, and tag semantics as the Angular application.',
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