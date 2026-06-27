import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  monthPeriodSummarySchema,
  monthPeriodSummaryShape,
} from '../domain/schemas.js';
import {
  buildCalendarMonthFrame,
  summarizeMonthlyExpenses,
} from '../domain/summaries.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerMonthPeriodSummaryTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.tool(
    'month_period_summary',
    'Return a summary for a specific calendar month identified by year and month. This tool is not budget-based and includes all expenses in that full month.',
    monthPeriodSummaryShape,
    async input => {
      const args = monthPeriodSummarySchema.parse(input);
      return executeTool(deps, 'month_period_summary', async () => {
        const frame = buildCalendarMonthFrame(args.year, args.month);
        const expenses = await deps.expensesRepository.listInRange(
          frame.start,
          frame.finish
        );
        const summary = summarizeMonthlyExpenses(
          expenses,
          frame,
          args.includeCategoryBreakdown ?? false
        );

        return jsonResult({
          year: args.year,
          month: args.month,
          summary,
        });
      });
    }
  );
}