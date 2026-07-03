import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { expenseExportResultSchema } from '../domain/output-schemas.js';
import { expenseFilterSchema } from '../domain/schemas.js';
import { normalizeExpenseFilter } from '../domain/filters.js';
import type { ToolDependencies } from './shared.js';
import {
  createReadOnlyAnnotations,
  executeTool,
  jsonResourceResult,
} from './shared.js';

export function registerExportExpensesTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.registerTool(
    'export_expenses',
    {
      description:
        'Return raw expense records as a JSON resource for the authenticated user. Use this tool when you need a file-like export instead of inline text. For relative or calendar-based periods, prefer list_expenses_for_period when inline results are enough. If the client is unsure how to calculate timestamps or timezone boundaries, call resolve_date_range first and pass its startDate and endDate here.',
      inputSchema: expenseFilterSchema,
      outputSchema: expenseExportResultSchema,
      annotations: createReadOnlyAnnotations('Expenses: Export'),
    },
    async input => {
      return executeTool(deps, 'export_expenses', async () => {
        const filter = normalizeExpenseFilter(input, deps.config.maxResultLimit);
        const expenses = await deps.expensesRepository.list(filter);
        const uri = `expenses://exports/export-expenses-${new Date()
          .toISOString()
          .replace(/[:.]/g, '-')}.json`;
        const payload = {
          filter,
          count: expenses.length,
          expenses,
        };

        return jsonResourceResult(payload, {
          uri,
          message: `Export completed. ${expenses.length} expenses exported.`,
          structuredContent: {
            status: 'exported',
            count: expenses.length,
            uri,
          },
        });
      });
    }
  );
}
