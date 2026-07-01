import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { deleteExpenseResultSchema } from '../domain/output-schemas.js';
import { expenseIdSchema } from '../domain/schemas.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerDeleteExpenseTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.registerTool(
    'delete_expense',
    {
      description:
        'Delete one expense record for the authenticated user. Required input: id.',
      inputSchema: expenseIdSchema,
      outputSchema: deleteExpenseResultSchema,
    },
    async input => {
      return executeTool(deps, 'delete_expense', async () => {
        const id = await deps.expensesRepository.delete(input.id);

        return jsonResult({
          status: 'deleted',
          id,
        });
      });
    }
  );
}