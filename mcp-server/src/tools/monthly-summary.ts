import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { monthSummaryResultSchema } from '../domain/output-schemas.js';
import {
  monthlySummarySchema,
} from '../domain/schemas.js';
import {
  buildCurrentMonthFrame,
  summarizeMonthlyExpenses,
} from '../domain/summaries.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerMonthlySummaryTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.registerTool(
    'monthly_summary',
    {
      description:
        'Return an aggregated summary for the current calendar month. This tool is calendar-month-based, not budget-based. It includes all expenses in the current month-to-date window. Optional input: includeCategoryBreakdown.',
      inputSchema: monthlySummarySchema,
      outputSchema: monthSummaryResultSchema,
    },
    async input => {
      return executeTool(deps, 'monthly_summary', async () => {
        const frame = buildCurrentMonthFrame();
        const expenses = await deps.expensesRepository.listInRange(
          frame.start,
          frame.finish
        );
        const summary = summarizeMonthlyExpenses(
          expenses,
          frame,
          input.includeCategoryBreakdown ?? false
        );

        return jsonResult({ summary });
      });
    }
  );
}