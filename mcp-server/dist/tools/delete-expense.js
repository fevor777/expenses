import { deleteExpenseResultSchema } from '../domain/output-schemas.js';
import { expenseIdSchema } from '../domain/schemas.js';
import { executeTool, jsonResult } from './shared.js';
export function registerDeleteExpenseTool(server, deps) {
    server.registerTool('delete_expense', {
        description: 'Delete an existing expense by id for the authenticated Firebase user.',
        inputSchema: expenseIdSchema,
        outputSchema: deleteExpenseResultSchema,
    }, async (input) => {
        return executeTool(deps, 'delete_expense', async () => {
            const id = await deps.expensesRepository.delete(input.id);
            return jsonResult({
                status: 'deleted',
                id,
            });
        });
    });
}
