import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { updateBudgetSchema, updateBudgetShape } from '../domain/schemas.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerUpdateBudgetTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.tool(
    'update_budget',
    'Update one or more budget settings for the authenticated Firebase user.',
    updateBudgetShape,
    async input => {
      const args = updateBudgetSchema.parse(input);
      return executeTool(deps, 'update_budget', async () => {
        const budget = await deps.settingsRepository.updateBudget(args);

        return jsonResult({
          status: 'updated',
          budget,
        });
      });
    }
  );
}