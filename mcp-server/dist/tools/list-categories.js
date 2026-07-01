import { listCategoriesResultSchema } from '../domain/output-schemas.js';
import { CATEGORY_DEFINITIONS } from '../domain/models.js';
import { executeTool, jsonResult } from './shared.js';
export function registerListCategoriesTool(server, deps) {
    server.registerTool('list_categories', {
        description: 'List valid expense categories and their default includeInBalance behavior.',
        outputSchema: listCategoriesResultSchema,
    }, async () => {
        return executeTool(deps, 'list_categories', async () => {
            return jsonResult({
                count: CATEGORY_DEFINITIONS.length,
                categories: CATEGORY_DEFINITIONS,
            });
        });
    });
}
