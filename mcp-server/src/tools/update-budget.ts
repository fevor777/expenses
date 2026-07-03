import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { updateBudgetResultSchema } from '../domain/output-schemas.js';
import { updateBudgetSchema } from '../domain/schemas.js';
import type { ToolDependencies } from './shared.js';
import {
  assertAtLeastOneDefinedField,
  executeTool,
  jsonResult,
} from './shared.js';

export function registerUpdateBudgetTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.registerTool(
    'update_budget',
    {
      description:
        'Update the authenticated user\'s budget settings. Provide at least one of: value, period, periodStartTs, timezone, or minDayLimit.',
      inputSchema: updateBudgetSchema,
      outputSchema: updateBudgetResultSchema,
    },
    async input => {
      return executeTool(deps, 'update_budget', async () => {
        assertAtLeastOneDefinedField(
          input,
          ['value', 'period', 'periodStartTs', 'timezone', 'minDayLimit'],
          'At least one budget field must be provided'
        );

        const budget = await deps.settingsRepository.updateBudget(input);

        return jsonResult({
          status: 'updated',
          budget,
        });
      });
    }
  );
}
