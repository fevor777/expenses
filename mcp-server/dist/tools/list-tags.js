import { listTagsShape, listTagsSchema } from '../domain/schemas.js';
import { executeTool, jsonResult } from './shared.js';
export function registerListTagsTool(server, deps) {
    server.tool('list_tags', 'List available expense tags.', listTagsShape, async (input) => {
        listTagsSchema.parse(input);
        return executeTool(deps, 'list_tags', async () => {
            const tags = await deps.tagsRepository.list();
            return jsonResult({ count: tags.length, tags });
        });
    });
}
