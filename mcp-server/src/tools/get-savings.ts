import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getSavingsResultSchema } from '../domain/output-schemas.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerGetSavingsTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.registerTool(
    'get_savings',
    {
      description:
        'Return the current savings value for the authenticated user. This tool takes no input arguments.',
      outputSchema: getSavingsResultSchema,
    },
    async () => {
      return executeTool(deps, 'get_savings', async () => {
        const savings = await deps.settingsRepository.getSavings();

        return jsonResult({ savings });
      });
    }
  );
}