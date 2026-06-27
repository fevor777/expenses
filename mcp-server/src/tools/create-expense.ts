import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createExpenseSchema, createExpenseShape } from '../domain/schemas.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerCreateExpenseTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.tool(
    'create_expense',
    'Create a new expense for the authenticated Firebase user.',
    createExpenseShape,
    async input => {
      const args = createExpenseSchema.parse(input);
      return executeTool(deps, 'create_expense', async () => {
        const expense = await deps.expensesRepository.create({
          amount: args.amount,
          category: args.category,
          currency: args.currency ?? 'EUR',
          date: args.date,
          ...(args.description !== undefined ? { description: args.description } : {}),
          ...(args.includeInBalance !== undefined
            ? { includeInBalance: args.includeInBalance }
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