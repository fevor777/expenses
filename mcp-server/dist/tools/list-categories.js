import { listCategoriesResultSchema } from '../domain/output-schemas.js';
import { executeTool, jsonResult } from './shared.js';
export function registerListCategoriesTool(server, deps) {
    server.registerTool('list_categories', {
        description: "Return the authenticated user's active resolved expense categories, including default overrides and custom categories. This tool takes no input arguments.",
        outputSchema: listCategoriesResultSchema,
    }, async () => {
        return executeTool(deps, 'list_categories', async () => {
            const categories = await deps.categoriesProvider.list();
            return jsonResult({
                count: categories.length,
                categories,
            });
        });
    });
}
