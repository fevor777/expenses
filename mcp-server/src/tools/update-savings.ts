import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { updateSavingsResultSchema } from '../domain/output-schemas.js';
import { savingsValueSchema } from '../domain/schemas.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerUpdateSavingsTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.registerTool(
    'update_savings',
    {
      description:
        'Update the savings value for the authenticated Firebase user.',
      inputSchema: savingsValueSchema,
      outputSchema: updateSavingsResultSchema,
    },
    async input => {
      return executeTool(deps, 'update_savings', async () => {
        const savings = await deps.settingsRepository.updateSavings(input.value);

        return jsonResult({
          status: 'updated',
          savings,
        });
      });
    }
  );
}