import { deleteTagResultSchema } from '../domain/output-schemas.js';
import { tagIdSchema } from '../domain/schemas.js';
import { createMutationAnnotations, executeTool, jsonResult } from './shared.js';
export function registerDeleteTagTool(server, deps) {
    server.registerTool('delete_tag', {
        description: 'Delete one expense tag for the authenticated user. Required input: id.',
        inputSchema: tagIdSchema,
        outputSchema: deleteTagResultSchema,
        annotations: createMutationAnnotations('Tags: Delete', {
            destructiveHint: true,
            idempotentHint: true,
        }),
    }, async (input) => {
        return executeTool(deps, 'delete_tag', async () => {
            const id = await deps.tagsRepository.delete(input.id);
            return jsonResult({ status: 'deleted', id });
        });
    });
}
