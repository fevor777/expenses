import { tagIdSchema, tagIdShape } from '../domain/schemas.js';
import { createMutationAnnotations, executeTool, jsonResult } from './shared.js';
export function registerDeleteTagTool(server, deps) {
    server.tool('delete_tag', 'Delete an expense tag by id.', tagIdShape, createMutationAnnotations('Tags: Delete', {
        destructiveHint: true,
        idempotentHint: true,
    }), async (input) => {
        const args = tagIdSchema.parse(input);
        return executeTool(deps, 'delete_tag', async () => {
            const id = await deps.tagsRepository.delete(args.id);
            return jsonResult({ status: 'deleted', id });
        });
    });
}
