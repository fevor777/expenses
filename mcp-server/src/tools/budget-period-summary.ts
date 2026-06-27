import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  budgetPeriodSummarySchema,
  budgetPeriodSummaryShape,
} from '../domain/schemas.js';
import {
  buildBudgetPeriodFrame,
  summarizeExpensesForFrame,
} from '../domain/summaries.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerBudgetPeriodSummaryTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.tool(
    'budget_period_summary',
    'Return a budget summary for a shifted budget period. Use periodOffset 0 for the current period, -1 for the previous period. Remaining budget uses only expenses where includeInBalance is true, and period boundaries are shifted copies of the configured budget start date and duration.',
    budgetPeriodSummaryShape,
    async input => {
      const args = budgetPeriodSummarySchema.parse(input);
      return executeTool(deps, 'budget_period_summary', async () => {
        const periodOffset = args.periodOffset ?? 0;
        const budget = await deps.settingsRepository.getBudget();
        const savings = await deps.settingsRepository.getSavings();
        const frame = buildBudgetPeriodFrame(budget, periodOffset);
        const expenses = await deps.expensesRepository.listInRange(
          frame.start,
          frame.finish
        );
        const summary = summarizeExpensesForFrame(
          expenses,
          budget,
          savings,
          frame,
          args.includeCategoryBreakdown ?? false
        );

        return jsonResult({
          periodOffset,
          summary,
        });
      });
    }
  );
}