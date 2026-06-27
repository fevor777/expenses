import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { expenseIdSchema, expenseIdShape } from '../domain/schemas.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerDeleteExpenseTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.tool(
    'delete_expense',
    'Delete an existing expense by id for the authenticated Firebase user.',
    expenseIdShape,
    async input => {
      const args = expenseIdSchema.parse(input);
      return executeTool(deps, 'delete_expense', async () => {
        const id = await deps.expensesRepository.delete(args.id);

        return jsonResult({
          status: 'deleted',
          id,
        });
      });
    }
  );
}