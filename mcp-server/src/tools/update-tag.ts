import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { updateTagResultSchema } from '../domain/output-schemas.js';
import { updateTagSchema } from '../domain/schemas.js';
import type { ToolDependencies } from './shared.js';
import { createMutationAnnotations, executeTool, jsonResult } from './shared.js';

export function registerUpdateTagTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.registerTool(
    'update_tag',
    {
      description:
        'Update an existing expense tag, including its name and star flag.',
      inputSchema: updateTagSchema,
      outputSchema: updateTagResultSchema,
      annotations: createMutationAnnotations('Tags: Update', {
        destructiveHint: false,
        idempotentHint: true,
      }),
    },
    async input => {
      return executeTool(deps, 'update_tag', async () => {
        const tag = await deps.tagsRepository.update(input);
        return jsonResult({ status: 'updated', id: tag.id, tag });
      });
    }
  );
}
