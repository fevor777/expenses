import { monthlySummarySchema, monthlySummaryShape, } from '../domain/schemas.js';
import { buildRollingBudgetFrame, summarizeExpensesForFrame, } from '../domain/summaries.js';
import { executeTool, jsonResult } from './shared.js';
export function registerBudgetSummaryTool(server, deps) {
    server.tool('budget_summary', 'Return the current rolling budget summary for the active budget period. Remaining budget uses only expenses where includeInBalance is true, and the active frame is derived from the configured budget start date and duration.', monthlySummaryShape, async (input) => {
        const args = monthlySummarySchema.parse(input);
        return executeTool(deps, 'budget_summary', async () => {
            const budget = await deps.settingsRepository.getBudget();
            const savings = await deps.settingsRepository.getSavings();
            const frame = buildRollingBudgetFrame(budget);
            const expenses = await deps.expensesRepository.listInRange(frame.start, frame.finish);
            const summary = summarizeExpensesForFrame(expenses, budget, savings, frame, args.includeCategoryBreakdown ?? false);
            return jsonResult({ summary });
        });
    });
}
