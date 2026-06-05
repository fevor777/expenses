import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  monthlySummarySchema,
  monthlySummaryShape,
} from '../domain/schemas.js';
import {
  buildRollingBudgetFrame,
  summarizeExpenses,
} from '../domain/summaries.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerMonthlySummaryTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.tool(
    'monthly_summary',
    'Return the current rolling budget-frame summary, including irregular spend and remaining budget.',
    monthlySummaryShape,
    async input => {
      const args = monthlySummarySchema.parse(input);
      return executeTool(deps, 'monthly_summary', async () => {
        const budget = await deps.settingsRepository.getBudget();
        const savings = await deps.settingsRepository.getSavings();
        const frame = buildRollingBudgetFrame(budget);
        const expenses = await deps.expensesRepository.listInRange(
          frame.start,
          frame.finish
        );
        const summary = summarizeExpenses(
          expenses,
          budget,
          savings,
          args.includeCategoryBreakdown ?? false
        );

        return jsonResult({ summary });
      });
    }
  );
}