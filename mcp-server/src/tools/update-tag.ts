import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { updateTagSchema, updateTagShape } from '../domain/schemas.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerUpdateTagTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.tool('update_tag', 'Update an existing expense tag, including its name and star flag.', updateTagShape, async input => {
    const args = updateTagSchema.parse(input);
    return executeTool(deps, 'update_tag', async () => {
      const tag = await deps.tagsRepository.update(args);
      return jsonResult({ status: 'updated', id: tag.id, tag });
    });
  });
}