import { z } from 'zod';
import { budgetSummaryWithExpensesForPeriodResultSchema } from '../domain/output-schemas.js';
import { listExpensesForPeriod } from '../domain/list-expenses-for-period.js';
import { buildRollingBudgetFrame, summarizeExpensesForFrame, } from '../domain/summaries.js';
import { listExpensesForPeriodSchema } from '../domain/schemas.js';
import { executeTool, jsonResult } from './shared.js';
const budgetSummaryWithExpensesForPeriodInputSchema = listExpensesForPeriodSchema.extend({
    includeCategoryBreakdown: z
        .boolean()
        .optional()
        .describe('Optional flag. Include category breakdown in the budget summary.'),
});
export function registerBudgetSummaryWithExpensesForPeriodTool(server, deps) {
    server.registerTool('budget_summary_with_expenses_for_period', {
        description: 'Return the current active budget summary together with raw expenses for a relative or calendar-based period in one call. Use this when you need both the budget snapshot and the detailed expense list without making two separate MCP tool calls. The budget summary always uses the current active budget period. The expense list uses the requested period. Remaining budget uses only expenses where includeInBalance is true. Optional input: includeCategoryBreakdown.',
        inputSchema: budgetSummaryWithExpensesForPeriodInputSchema,
        outputSchema: budgetSummaryWithExpensesForPeriodResultSchema,
    }, async (input) => {
        return executeTool(deps, 'budget_summary_with_expenses_for_period', async () => {
            const budget = await deps.settingsRepository.getBudget();
            const savings = await deps.settingsRepository.getSavings();
            const nowMs = Date.now();
            const frame = buildRollingBudgetFrame(budget, nowMs);
            const expensesForPeriod = await listExpensesForPeriod(input, deps.expensesRepository, deps.config.maxResultLimit);
            const budgetSummary = summarizeExpensesForFrame(await deps.expensesRepository.listInRange(frame.start, frame.finish), budget, savings, frame, input.includeCategoryBreakdown ?? false, nowMs);
            return jsonResult({
                budgetSummary,
                ...expensesForPeriod,
            });
        });
    });
}
