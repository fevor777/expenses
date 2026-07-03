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
        'Return an aggregated summary for the current active budget period. This tool is budget-based, not calendar-month-based. Remaining budget uses only expenses where includeInBalance is true. Optional input: includeCategoryBreakdown.',
      inputSchema: monthlySummarySchema,
      outputSchema: budgetSummaryResultSchema,
    },
    async input => {
      return executeTool(deps, 'budget_summary', async () => {
        const budget = await deps.settingsRepository.getBudget();
        const savings = await deps.settingsRepository.getSavings();
        const nowMs = Date.now();
        const frame = buildRollingBudgetFrame(budget, nowMs);
        const expenses = await deps.expensesRepository.listInRange(
          frame.start,
          frame.finish
        );
        const summary = summarizeExpensesForFrame(
          expenses,
          budget,
          savings,
          frame,
          input.includeCategoryBreakdown ?? false,
          nowMs
        );

        return jsonResult({ summary });
      });
    }
  );
}
