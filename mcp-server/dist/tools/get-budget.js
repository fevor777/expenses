import { getBudgetResultSchema } from '../domain/output-schemas.js';
import { resolveBudget } from '../domain/summaries.js';
import { executeTool, jsonResult } from './shared.js';
export function registerGetBudgetTool(server, deps) {
    server.registerTool('get_budget', {
        description: 'Return the current budget settings for the authenticated Firebase user.',
        outputSchema: getBudgetResultSchema,
    }, async () => {
        return executeTool(deps, 'get_budget', async () => {
            const storedBudget = await deps.settingsRepository.getBudget();
            return jsonResult({
                budget: resolveBudget(storedBudget),
                usesDefaultBudget: storedBudget === null,
            });
        });
    });
}
