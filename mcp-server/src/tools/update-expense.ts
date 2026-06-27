import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { updateExpenseSchema, updateExpenseShape } from '../domain/schemas.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerUpdateExpenseTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.tool(
    'update_expense',
    'Update mutable fields of an existing expense owned by the authenticated Firebase user.',
    updateExpenseShape,
    async input => {
      const args = updateExpenseSchema.parse(input);
      return executeTool(deps, 'update_expense', async () => {
        const expense = await deps.expensesRepository.update(args);

        return jsonResult({
          status: 'updated',
          id: expense.id,
          expense,
        });
      });
    }
  );
}