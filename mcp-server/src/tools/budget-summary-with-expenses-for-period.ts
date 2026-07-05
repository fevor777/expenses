import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { budgetSummaryWithExpensesForPeriodResultSchema } from '../domain/output-schemas.js';
import { listExpensesForPeriod } from '../domain/list-expenses-for-period.js';
import {
  buildRollingBudgetFrame,
  summarizeExpensesForFrame,
} from '../domain/summaries.js';
import { listExpensesForPeriodSchema } from '../domain/schemas.js';
import type { ToolDependencies } from './shared.js';
import { executeTool, jsonResult } from './shared.js';

const budgetSummaryWithExpensesForPeriodInputSchema =
  listExpensesForPeriodSchema.extend({
    includeCategoryBreakdown: z
      .boolean()
      .optional()
      .describe('Optional flag. Include category breakdown in the budget summary.'),
  });

export function registerBudgetSummaryWithExpensesForPeriodTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.registerTool(
    'budget_summary_with_expenses_for_period',
    {
      description:
        'Return the current active budget summary together with raw expenses for a relative or calendar-based period in one call. Use this when you need both the budget snapshot and the detailed expense list without making two separate MCP tool calls. The budget summary always uses the current active budget period. The expense list uses the requested period and includes tag names instead of tag ids. Remaining budget uses only expenses where includeInBalance is true. Optional input: includeCategoryBreakdown.',
      inputSchema: budgetSummaryWithExpensesForPeriodInputSchema,
      outputSchema: budgetSummaryWithExpensesForPeriodResultSchema,
    },
    async input => {
      return executeTool(
        deps,
        'budget_summary_with_expenses_for_period',
        async () => {
          const [budget, savings, tags, expensesForPeriod] = await Promise.all([
            deps.settingsRepository.getBudget(),
            deps.settingsRepository.getSavings(),
            deps.tagsRepository.list(),
            listExpensesForPeriod(
              input,
              deps.expensesRepository,
              deps.config.maxResultLimit
            ),
          ]);
          const nowMs = Date.now();
          const frame = buildRollingBudgetFrame(budget, nowMs);
          const budgetSummary = summarizeExpensesForFrame(
            await deps.expensesRepository.listInRange(frame.start, frame.finish),
            budget,
            savings,
            frame,
            input.includeCategoryBreakdown ?? false,
            nowMs
          );
          const tagNamesById = new Map<string, string>(
            tags.map(tag => [tag.id, tag.name] as const)
          );
          const expenses = expensesForPeriod.expenses.map(expense => {
            const { tagIds: _tagIds, ...rest } = expense;
            return {
              ...rest,
              tagNames: expense.tagIds
                ?.map(tagId => tagNamesById.get(tagId))
                .filter((tagName): tagName is string => Boolean(tagName)) ?? [],
            };
          });

          return jsonResult({
            budgetSummary,
            ...expensesForPeriod,
            expenses,
          });
        }
      );
    }
  );
}
