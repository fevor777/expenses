import { updateTagSchema, updateTagShape } from '../domain/schemas.js';
import { executeTool, jsonResult } from './shared.js';
export function registerUpdateTagTool(server, deps) {
    server.tool('update_tag', 'Rename an existing expense tag.', updateTagShape, async (input) => {
        const args = updateTagSchema.parse(input);
        return executeTool(deps, 'update_tag', async () => {
            const tag = await deps.tagsRepository.update(args);
            return jsonResult({ status: 'updated', id: tag.id, tag });
        });
    });
}
