import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createExpenseResultSchema } from '../domain/output-schemas.js';
import { createExpenseSchema } from '../domain/schemas.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerCreateExpenseTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.registerTool(
    'create_expense',
    {
      description:
        'Create one expense record for the authenticated user. Required input: amount, category, and date. Optional input: currency, description, tagIds, and includeInBalance.',
      inputSchema: createExpenseSchema,
      outputSchema: createExpenseResultSchema,
    },
    async input => {
      return executeTool(deps, 'create_expense', async () => {
        const expense = await deps.expensesRepository.create({
          amount: input.amount,
          category: input.category,
          currency: input.currency ?? 'EUR',
          date: input.date,
          ...(input.description !== undefined ? { description: input.description } : {}),
          ...(input.tagIds !== undefined ? { tagIds: input.tagIds } : {}),
          ...(input.includeInBalance !== undefined
            ? { includeInBalance: input.includeInBalance }
            : {}),
        });

        return jsonResult({
          status: 'created',
          id: expense.id,
          expense,
        });
      });
    }
  );
}