import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { budgetSummaryResultSchema } from '../domain/output-schemas.js';
import {
  monthlySummarySchema,
} from '../domain/schemas.js';
import {
  buildRollingBudgetFrame,
  summarizeExpensesForFrame,
} from '../domain/summaries.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerBudgetSummaryTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.registerTool(
    'budget_summary',
    {
      description:
        'Return the current rolling budget summary for the active budget period. Remaining budget uses only expenses where includeInBalance is true, and the active frame is derived from the configured budget start date and duration.',
      inputSchema: monthlySummarySchema,
      outputSchema: budgetSummaryResultSchema,
    },
    async input => {
      return executeTool(deps, 'budget_summary', async () => {
        const budget = await deps.settingsRepository.getBudget();
        const savings = await deps.settingsRepository.getSavings();
        const frame = buildRollingBudgetFrame(budget);
        const expenses = await deps.expensesRepository.listInRange(
          frame.start,
          frame.finish
        );
        const summary = summarizeExpensesForFrame(
          expenses,
          budget,
          savings,
          frame,
          input.includeCategoryBreakdown ?? false
        );

        return jsonResult({ summary });
      });
    }
  );
}