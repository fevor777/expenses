import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { expenseResultSchema } from '../domain/output-schemas.js';
import { expenseIdSchema } from '../domain/schemas.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerGetExpenseTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.registerTool(
    'get_expense',
    {
      description:
        'Fetch a single expense by id for the authenticated Firebase user.',
      inputSchema: expenseIdSchema,
      outputSchema: expenseResultSchema,
    },
    async input => {
      return executeTool(deps, 'get_expense', async () => {
        const expense = await deps.expensesRepository.getById(input.id);

        if (!expense) {
          throw new Error(`Expense ${input.id} not found`);
        }

        return jsonResult({ expense });
      });
    }
  );
}