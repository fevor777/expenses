import { createTagResultSchema } from '../domain/output-schemas.js';
import { createTagSchema } from '../domain/schemas.js';
import { createMutationAnnotations, executeTool, jsonResult } from './shared.js';
export function registerCreateTagTool(server, deps) {
    server.registerTool('create_tag', {
        description: 'Create a new expense tag.',
        inputSchema: createTagSchema,
        outputSchema: createTagResultSchema,
        annotations: createMutationAnnotations('Tags: Create', {
            destructiveHint: false,
            idempotentHint: false,
        }),
    }, async (input) => {
        return executeTool(deps, 'create_tag', async () => {
            const tag = await deps.tagsRepository.create({
                name: input.name,
                ...(input.star !== undefined ? { star: input.star } : {}),
            });
            return jsonResult({ status: 'created', id: tag.id, tag });
        });
    });
}
