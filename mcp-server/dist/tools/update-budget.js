import { updateBudgetResultSchema } from '../domain/output-schemas.js';
import { updateBudgetSchema } from '../domain/schemas.js';
import { assertAtLeastOneDefinedField, executeTool, jsonResult, } from './shared.js';
export function registerUpdateBudgetTool(server, deps) {
    server.registerTool('update_budget', {
        description: 'Update the authenticated user\'s budget settings. Provide at least one of: value, period, periodStartTs, timezone, minDayLimit, or limits.',
        inputSchema: updateBudgetSchema,
        outputSchema: updateBudgetResultSchema,
    }, async (input) => {
        return executeTool(deps, 'update_budget', async () => {
            assertAtLeastOneDefinedField(input, ['value', 'period', 'periodStartTs', 'timezone', 'minDayLimit', 'limits'], 'At least one budget field must be provided');
            const budget = await deps.settingsRepository.updateBudget(input);
            return jsonResult({
                status: 'updated',
                budget,
            });
        });
    });
}
