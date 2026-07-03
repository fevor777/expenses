import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { resolveDateRangeResultSchema } from '../domain/output-schemas.js';
import { resolveDateRange } from '../domain/date-range.js';
import { resolveDateRangeSchema } from '../domain/schemas.js';
import type { ToolDependencies } from './shared.js';
import { createReadOnlyAnnotations, executeTool, jsonResult } from './shared.js';

export function registerResolveDateRangeTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.registerTool(
    'resolve_date_range',
    {
      description:
        'Normalize a relative or calendar-based date request into inclusive startDate and endDate Unix timestamps in milliseconds. Use this tool when you only need resolved timestamps without fetching expenses. To fetch expenses for a relative or calendar-based period in one call, use list_expenses_for_period instead. Use this tool before list_expenses or export_expenses when the client already has timestamps to pass but needs help calculating them.',
      inputSchema: resolveDateRangeSchema,
      outputSchema: resolveDateRangeResultSchema,
      annotations: createReadOnlyAnnotations('Time: Resolve Range'),
    },
    async input => {
      return executeTool(deps, 'resolve_date_range', async () => {
        const resolvedRange = resolveDateRange(input);
        return jsonResult(resolvedRange);
      });
    }
  );
}