import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { noInputSchema, noInputShape } from '../domain/schemas.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerGetSavingsTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.tool(
    'get_savings',
    'Return the current savings value for the authenticated Firebase user.',
    noInputShape,
    async input => {
      noInputSchema.parse(input ?? {});
      return executeTool(deps, 'get_savings', async () => {
        const savings = await deps.settingsRepository.getSavings();

        return jsonResult({ savings });
      });
    }
  );
}