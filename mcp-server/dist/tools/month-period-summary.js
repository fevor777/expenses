import { monthPeriodSummaryResultSchema } from '../domain/output-schemas.js';
import { monthPeriodSummarySchema, } from '../domain/schemas.js';
import { buildCalendarMonthFrame, summarizeMonthlyExpenses, } from '../domain/summaries.js';
import { executeTool, jsonResult } from './shared.js';
export function registerMonthPeriodSummaryTool(server, deps) {
    server.registerTool('month_period_summary', {
        description: 'Return an aggregated summary for one specific calendar month identified by year and month. This tool is calendar-month-based, not budget-based. It includes all expenses in that full month. Optional input: includeCategoryBreakdown.',
        inputSchema: monthPeriodSummarySchema,
        outputSchema: monthPeriodSummaryResultSchema,
    }, async (input) => {
        return executeTool(deps, 'month_period_summary', async () => {
            const frame = buildCalendarMonthFrame(input.year, input.month);
            const expenses = await deps.expensesRepository.listInRange(frame.start, frame.finish);
            const summary = summarizeMonthlyExpenses(expenses, frame, input.includeCategoryBreakdown ?? false);
            return jsonResult({
                year: input.year,
                month: input.month,
                summary,
            });
        });
    });
}
