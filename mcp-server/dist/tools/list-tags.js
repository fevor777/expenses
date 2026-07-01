import { tagCollectionResultSchema } from '../domain/output-schemas.js';
import { createReadOnlyAnnotations, executeTool, jsonResult } from './shared.js';
export function registerListTagsTool(server, deps) {
    server.registerTool('list_tags', {
        description: 'List available expense tags.',
        outputSchema: tagCollectionResultSchema,
        annotations: createReadOnlyAnnotations('Tags: List'),
    }, async () => {
        return executeTool(deps, 'list_tags', async () => {
            const tags = await deps.tagsRepository.list();
            return jsonResult({ count: tags.length, tags });
        });
    });
}
