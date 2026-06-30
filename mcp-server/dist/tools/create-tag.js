import { createTagSchema, createTagShape } from '../domain/schemas.js';
import { executeTool, jsonResult } from './shared.js';
export function registerCreateTagTool(server, deps) {
    server.tool('create_tag', 'Create a new expense tag.', createTagShape, async (input) => {
        const args = createTagSchema.parse(input);
        return executeTool(deps, 'create_tag', async () => {
            const tag = await deps.tagsRepository.create({ name: args.name });
            return jsonResult({ status: 'created', id: tag.id, tag });
        });
    });
}
