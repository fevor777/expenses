import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { deleteTagResultSchema } from '../domain/output-schemas.js';
import { tagIdSchema } from '../domain/schemas.js';
import type { ToolDependencies } from './shared.js';
import { createMutationAnnotations, executeTool, jsonResult } from './shared.js';

export function registerDeleteTagTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.registerTool(
    'delete_tag',
    {
      description: 'Delete an expense tag by id.',
      inputSchema: tagIdSchema,
      outputSchema: deleteTagResultSchema,
      annotations: createMutationAnnotations('Tags: Delete', {
        destructiveHint: true,
        idempotentHint: true,
      }),
    },
    async input => {
      return executeTool(deps, 'delete_tag', async () => {
        const id = await deps.tagsRepository.delete(input.id);
        return jsonResult({ status: 'deleted', id });
      });
    }
  );
}
