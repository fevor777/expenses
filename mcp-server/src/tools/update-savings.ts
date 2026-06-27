import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { savingsValueSchema, savingsValueShape } from '../domain/schemas.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerUpdateSavingsTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.tool(
    'update_savings',
    'Update the savings value for the authenticated Firebase user.',
    savingsValueShape,
    async input => {
      const args = savingsValueSchema.parse(input);
      return executeTool(deps, 'update_savings', async () => {
        const savings = await deps.settingsRepository.updateSavings(args.value);

        return jsonResult({
          status: 'updated',
          savings,
        });
      });
    }
  );
}