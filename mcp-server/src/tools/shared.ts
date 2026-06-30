import type { Logger } from 'pino';
import type { AppConfig } from '../config.js';
import type { ExpensesRepository } from '../firestore/expenses.repository.js';
import type { SettingsRepository } from '../firestore/settings.repository.js';
import type { TagsRepository } from '../firestore/tags.repository.js';

export type ToolDependencies = {
  config: AppConfig;
  logger: Logger;
  expensesRepository: ExpensesRepository;
  settingsRepository: SettingsRepository;
  tagsRepository: TagsRepository;
};

export async function executeTool<T>(
  deps: ToolDependencies,
  toolName: string,
  operation: () => Promise<T>
): Promise<T> {
  const startedAt = Date.now();

  try {
    const result = await operation();
    deps.logger.info(
      {
        tool: toolName,
        outcome: 'success',
        durationMs: Date.now() - startedAt,
      },
      'MCP tool completed'
    );
    return result;
  } catch (error) {
    deps.logger.error(
      {
        tool: toolName,
        outcome: 'error',
        durationMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : String(error),
      },
      'MCP tool failed'
    );
    throw error;
  }
}

export function jsonResult(payload: Record<string, unknown>) {
  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(payload, null, 2),
      },
    ],
    structuredContent: payload,
  };
}