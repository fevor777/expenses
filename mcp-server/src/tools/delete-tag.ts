import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { tagIdSchema, tagIdShape } from '../domain/schemas.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerDeleteTagTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.tool('delete_tag', 'Delete an expense tag by id.', tagIdShape, async input => {
    const args = tagIdSchema.parse(input);
    return executeTool(deps, 'delete_tag', async () => {
      const id = await deps.tagsRepository.delete(args.id);
      return jsonResult({ status: 'deleted', id });
    });
  });
}