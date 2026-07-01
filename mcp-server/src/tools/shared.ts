import type { Logger } from 'pino';
import type { AppConfig } from '../config.js';
import type { ToolAnnotations } from '@modelcontextprotocol/sdk/types.js';
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

type ToolErrorPayload = {
  error: {
    code: 'not_found' | 'invalid_input';
    message: string;
  };
};

type ToolResult<T extends Record<string, unknown>> = {
  content: Array<{ type: 'text'; text: string }>;
  structuredContent: T;
  isError?: boolean;
};

export async function executeTool<T extends Record<string, unknown>>(
  deps: ToolDependencies,
  toolName: string,
  operation: () => Promise<ToolResult<T>>
): Promise<ToolResult<T | ToolErrorPayload>> {
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
    const toolErrorPayload = classifyToolError(error);
    if (toolErrorPayload) {
      deps.logger.warn(
        {
          tool: toolName,
          outcome: 'error',
          durationMs: Date.now() - startedAt,
          error: toolErrorPayload.error.message,
          errorCode: toolErrorPayload.error.code,
        },
        'MCP tool returned a handled error result'
      );

      return toolErrorResult(toolErrorPayload);
    }

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

export function jsonResult<T extends Record<string, unknown>>(payload: T) {
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

export function toolErrorResult(payload: ToolErrorPayload): ToolResult<ToolErrorPayload> {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(payload, null, 2),
      },
    ],
    structuredContent: payload,
    isError: true,
  };
}

export function createReadOnlyAnnotations(title: string): ToolAnnotations {
  return {
    title,
    readOnlyHint: true,
    openWorldHint: false,
  };
}

export function createMutationAnnotations(
  title: string,
  options?: {
    destructiveHint?: boolean;
    idempotentHint?: boolean;
  }
): ToolAnnotations {
  return {
    title,
    readOnlyHint: false,
    destructiveHint: options?.destructiveHint ?? false,
    idempotentHint: options?.idempotentHint ?? false,
    openWorldHint: false,
  };
}

function classifyToolError(error: unknown): ToolErrorPayload | null {
  const message = error instanceof Error ? error.message : String(error);

  if (/^(Expense|Tag) .+ not found$/u.test(message)) {
    return {
      error: {
        code: 'not_found',
        message,
      },
    };
  }

  if (
    message === 'Tag name is required' ||
    message === 'startDate must be less than or equal to endDate'
  ) {
    return {
      error: {
        code: 'invalid_input',
        message,
      },
    };
  }

  return null;
}
