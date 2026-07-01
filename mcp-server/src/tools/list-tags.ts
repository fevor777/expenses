import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { tagCollectionResultSchema } from '../domain/output-schemas.js';
import type { ToolDependencies } from './shared.js';
import { createReadOnlyAnnotations, executeTool, jsonResult } from './shared.js';

export function registerListTagsTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.registerTool(
    'list_tags',
    {
      description: 'List available expense tags.',
      outputSchema: tagCollectionResultSchema,
      annotations: createReadOnlyAnnotations('Tags: List'),
    },
    async () => {
      return executeTool(deps, 'list_tags', async () => {
        const tags = await deps.tagsRepository.list();
        return jsonResult({ count: tags.length, tags });
      });
    }
  );
}
