import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { expenseIdSchema, expenseIdShape } from '../domain/schemas.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerGetExpenseTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.tool(
    'get_expense',
    'Fetch a single expense by id for the configured owner.',
    expenseIdShape,
    async input => {
      const args = expenseIdSchema.parse(input);
      return executeTool(deps, 'get_expense', async () => {
        const expense = await deps.expensesRepository.getById(args.id);

        if (!expense) {
          throw new Error(`Expense ${args.id} not found`);
        }

        return jsonResult({ expense });
      });
    }
  );
}