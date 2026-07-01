import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { updateExpenseResultSchema } from '../domain/output-schemas.js';
import { updateExpenseSchema } from '../domain/schemas.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerUpdateExpenseTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.registerTool(
    'update_expense',
    {
      description:
        'Update mutable fields of an existing expense owned by the authenticated Firebase user.',
      inputSchema: updateExpenseSchema,
      outputSchema: updateExpenseResultSchema,
    },
    async input => {
      return executeTool(deps, 'update_expense', async () => {
        const expense = await deps.expensesRepository.update(input);

        return jsonResult({
          status: 'updated',
          id: expense.id,
          expense,
        });
      });
    }
  );
}