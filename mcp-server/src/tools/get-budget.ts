import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { noInputSchema, noInputShape } from '../domain/schemas.js';
import { resolveBudget } from '../domain/summaries.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

export function registerGetBudgetTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.tool(
    'get_budget',
    'Return the current budget settings for the authenticated Firebase user.',
    noInputShape,
    async input => {
      noInputSchema.parse(input ?? {});
      return executeTool(deps, 'get_budget', async () => {
        const storedBudget = await deps.settingsRepository.getBudget();

        return jsonResult({
          budget: resolveBudget(storedBudget),
          usesDefaultBudget: storedBudget === null,
        });
      });
    }
  );
}