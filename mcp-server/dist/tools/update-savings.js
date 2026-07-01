import { updateSavingsResultSchema } from '../domain/output-schemas.js';
import { savingsValueSchema } from '../domain/schemas.js';
import { executeTool, jsonResult } from './shared.js';
export function registerUpdateSavingsTool(server, deps) {
    server.registerTool('update_savings', {
        description: 'Update the savings value for the authenticated Firebase user.',
        inputSchema: savingsValueSchema,
        outputSchema: updateSavingsResultSchema,
    }, async (input) => {
        return executeTool(deps, 'update_savings', async () => {
            const savings = await deps.settingsRepository.updateSavings(input.value);
            return jsonResult({
                status: 'updated',
                savings,
            });
        });
    });
}
