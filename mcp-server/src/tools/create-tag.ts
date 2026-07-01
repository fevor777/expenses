import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createTagSchema, createTagShape } from '../domain/schemas.js';
import type { ToolDependencies } from './shared.js';
import { createMutationAnnotations, executeTool, jsonResult } from './shared.js';

export function registerCreateTagTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.tool(
    'create_tag',
    'Create a new expense tag.',
    createTagShape,
    createMutationAnnotations('Tags: Create', {
      destructiveHint: false,
      idempotentHint: false,
    }),
    async input => {
      const args = createTagSchema.parse(input);
      return executeTool(deps, 'create_tag', async () => {
        const tag = await deps.tagsRepository.create({
          name: args.name,
          ...(args.star !== undefined ? { star: args.star } : {}),
        });
        return jsonResult({ status: 'created', id: tag.id, tag });
      });
    }
  );
}
