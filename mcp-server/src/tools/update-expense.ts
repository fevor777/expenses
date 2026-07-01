import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { updateExpenseResultSchema } from '../domain/output-schemas.js';
import { updateExpenseSchema } from '../domain/schemas.js';
import type { ToolDependencies } from './shared.js';
import {
  assertAtLeastOneDefinedField,
  executeTool,
  jsonResult,
} from './shared.js';

export function registerUpdateExpenseTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.registerTool(
    'update_expense',
    {
      description:
        'Update one existing expense record for the authenticated user. Required input: id plus at least one mutable field. Mutable fields: amount, category, currency, date, description, tagIds, and includeInBalance.',
      inputSchema: updateExpenseSchema,
      outputSchema: updateExpenseResultSchema,
    },
    async input => {
      return executeTool(deps, 'update_expense', async () => {
        assertAtLeastOneDefinedField(
          input,
          ['amount', 'category', 'currency', 'date', 'description', 'tagIds', 'includeInBalance'],
          'At least one mutable field must be provided'
        );

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