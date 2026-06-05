import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { exportExpensesSchema, exportExpensesShape } from '../domain/schemas.js';
import { normalizeExpenseFilter } from '../domain/filters.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerExportExpensesTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.tool(
    'export_expenses',
    'Export expenses as JSON, optionally including budget and savings snapshots.',
    exportExpensesShape,
    async input => {
      const args = exportExpensesSchema.parse(input);
      return executeTool(deps, 'export_expenses', async () => {
        const filter = normalizeExpenseFilter(args, deps.config.maxResultLimit);
        const expenses = await deps.expensesRepository.list(filter);
        const payload: Record<string, unknown> = {
          format: args.format ?? 'json',
          exportedAt: new Date().toISOString(),
          filter,
          count: expenses.length,
          expenses,
        };

        if (args.includeBudget) {
          payload.budget = await deps.settingsRepository.getBudget();
        }

        if (args.includeSavings) {
          payload.savings = await deps.settingsRepository.getSavings();
        }

        return jsonResult(payload);
      });
    }
  );
}