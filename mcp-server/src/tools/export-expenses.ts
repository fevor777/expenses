import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { exportExpensesResultSchema } from '../domain/output-schemas.js';
import { exportExpensesSchema } from '../domain/schemas.js';
import { normalizeExpenseFilter } from '../domain/filters.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerExportExpensesTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.registerTool(
    'export_expenses',
    {
      description:
        'Export expenses as JSON, optionally including budget and savings snapshots.',
      inputSchema: exportExpensesSchema,
      outputSchema: exportExpensesResultSchema,
    },
    async input => {
      return executeTool(deps, 'export_expenses', async () => {
        const filter = normalizeExpenseFilter(input, deps.config.maxResultLimit);
        const expenses = await deps.expensesRepository.list(filter);
        const payload: Record<string, unknown> = {
          format: input.format ?? 'json',
          exportedAt: new Date().toISOString(),
          filter,
          count: expenses.length,
          expenses,
        };

        if (input.includeBudget) {
          payload.budget = await deps.settingsRepository.getBudget();
        }

        if (input.includeSavings) {
          payload.savings = await deps.settingsRepository.getSavings();
        }

        return jsonResult(payload);
      });
    }
  );
}