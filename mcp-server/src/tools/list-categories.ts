import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CATEGORY_DEFINITIONS } from '../domain/models.js';
import { noInputSchema, noInputShape } from '../domain/schemas.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerListCategoriesTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.tool(
    'list_categories',
    'List valid expense categories and their default includeInBalance behavior.',
    noInputShape,
    async input => {
      noInputSchema.parse(input ?? {});
      return executeTool(deps, 'list_categories', async () => {
        return jsonResult({
          count: CATEGORY_DEFINITIONS.length,
          categories: CATEGORY_DEFINITIONS,
        });
      });
    }
  );
}