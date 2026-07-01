import { updateBudgetResultSchema } from '../domain/output-schemas.js';
import { updateBudgetSchema } from '../domain/schemas.js';
import { executeTool, jsonResult } from './shared.js';
export function registerUpdateBudgetTool(server, deps) {
    server.registerTool('update_budget', {
        description: 'Update one or more budget settings for the authenticated Firebase user.',
        inputSchema: updateBudgetSchema,
        outputSchema: updateBudgetResultSchema,
    }, async (input) => {
        return executeTool(deps, 'update_budget', async () => {
            const budget = await deps.settingsRepository.updateBudget(input);
            return jsonResult({
                status: 'updated',
                budget,
            });
        });
    });
}
