import { updateTagResultSchema } from '../domain/output-schemas.js';
import { updateTagSchema } from '../domain/schemas.js';
import { createMutationAnnotations, executeTool, jsonResult } from './shared.js';
export function registerUpdateTagTool(server, deps) {
    server.registerTool('update_tag', {
        description: 'Update an existing expense tag, including its name and star flag.',
        inputSchema: updateTagSchema,
        outputSchema: updateTagResultSchema,
        annotations: createMutationAnnotations('Tags: Update', {
            destructiveHint: false,
            idempotentHint: true,
        }),
    }, async (input) => {
        return executeTool(deps, 'update_tag', async () => {
            const tag = await deps.tagsRepository.update(input);
            return jsonResult({ status: 'updated', id: tag.id, tag });
        });
    });
}
