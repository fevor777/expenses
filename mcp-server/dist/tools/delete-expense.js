import { expenseIdSchema, expenseIdShape } from '../domain/schemas.js';
import { executeTool, jsonResult } from './shared.js';
export function registerDeleteExpenseTool(server, deps) {
    server.tool('delete_expense', 'Delete an existing expense by id for the authenticated Firebase user.', expenseIdShape, async (input) => {
        const args = expenseIdSchema.parse(input);
        return executeTool(deps, 'delete_expense', async () => {
            const id = await deps.expensesRepository.delete(args.id);
            return jsonResult({
                status: 'deleted',
                id,
            });
        });
    });
}
