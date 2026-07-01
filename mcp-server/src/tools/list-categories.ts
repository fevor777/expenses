import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { listCategoriesResultSchema } from '../domain/output-schemas.js';
import { CATEGORY_DEFINITIONS } from '../domain/models.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerListCategoriesTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.registerTool(
    'list_categories',
    {
      description:
        'Return all valid expense categories and each category\'s default includeInBalance value. This tool takes no input arguments.',
      outputSchema: listCategoriesResultSchema,
    },
    async () => {
      return executeTool(deps, 'list_categories', async () => {
        return jsonResult({
          count: CATEGORY_DEFINITIONS.length,
          categories: CATEGORY_DEFINITIONS,
        });
      });
    }
  );
}