import { budgetPeriodSummaryResultSchema } from '../domain/output-schemas.js';
import { budgetPeriodSummarySchema, } from '../domain/schemas.js';
import { buildBudgetPeriodFrame, summarizeExpensesForFrame, } from '../domain/summaries.js';
import { executeTool, jsonResult } from './shared.js';
export function registerBudgetPeriodSummaryTool(server, deps) {
    server.registerTool('budget_period_summary', {
        description: 'Return an aggregated summary for one budget period selected by periodOffset. This tool is budget-based, not calendar-month-based. Use periodOffset 0 for the current period and -1 for the previous period. Remaining budget uses only expenses where includeInBalance is true. Optional input: includeCategoryBreakdown.',
        inputSchema: budgetPeriodSummarySchema,
        outputSchema: budgetPeriodSummaryResultSchema,
    }, async (input) => {
        return executeTool(deps, 'budget_period_summary', async () => {
            const periodOffset = input.periodOffset ?? 0;
            const budget = await deps.settingsRepository.getBudget();
            const savings = await deps.settingsRepository.getSavings();
            const nowMs = Date.now();
            const frame = buildBudgetPeriodFrame(budget, periodOffset, nowMs);
            const expenses = await deps.expensesRepository.listInRange(frame.start, frame.finish);
            const summary = summarizeExpensesForFrame(expenses, budget, savings, frame, input.includeCategoryBreakdown ?? false, nowMs);
            return jsonResult({
                periodOffset,
                summary,
            });
        });
    });
}
