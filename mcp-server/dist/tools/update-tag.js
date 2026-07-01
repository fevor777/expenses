import { updateTagResultSchema } from '../domain/output-schemas.js';
import { updateTagSchema } from '../domain/schemas.js';
import { assertAtLeastOneDefinedField, createMutationAnnotations, executeTool, jsonResult, } from './shared.js';
export function registerUpdateTagTool(server, deps) {
    server.registerTool('update_tag', {
        description: 'Update one existing expense tag for the authenticated user. Required input: id plus at least one field to change. Mutable fields: name and star.',
        inputSchema: updateTagSchema,
        outputSchema: updateTagResultSchema,
        annotations: createMutationAnnotations('Tags: Update', {
            destructiveHint: false,
            idempotentHint: true,
        }),
    }, async (input) => {
        return executeTool(deps, 'update_tag', async () => {
            assertAtLeastOneDefinedField(input, ['name', 'star'], 'At least one tag field must be provided');
            const tag = await deps.tagsRepository.update(input);
            return jsonResult({ status: 'updated', id: tag.id, tag });
        });
    });
}
