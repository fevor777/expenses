import { deleteExpenseResultSchema } from '../domain/output-schemas.js';
import { expenseIdSchema } from '../domain/schemas.js';
import { executeTool, jsonResult } from './shared.js';
export function registerDeleteExpenseTool(server, deps) {
    server.registerTool('delete_expense', {
        description: 'Delete one expense record for the authenticated user. Required input: id.',
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
