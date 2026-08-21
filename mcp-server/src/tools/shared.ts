import type { Logger } from 'pino';
import type { AppConfig } from '../config.js';
import type { ToolAnnotations } from '@modelcontextprotocol/sdk/types.js';
import type { ExpensesRepository } from '../firestore/expenses.repository.js';
import type { SettingsRepository } from '../firestore/settings.repository.js';
import type { TagsRepository } from '../firestore/tags.repository.js';
import type { ResolvedCategoriesProvider } from '../domain/categories.js';

export type ToolDependencies = {
  config: AppConfig;
  logger: Logger;
  expensesRepository: ExpensesRepository;
  categoriesProvider: ResolvedCategoriesProvider;
  settingsRepository: SettingsRepository;
  tagsRepository: TagsRepository;
};

type ToolErrorPayload = {
  error: {
    code: 'not_found' | 'invalid_input';
    message: string;
  };
};

type TextToolContent = {
  type: 'text';
  text: string;
};

type JsonResourceContent = {
  type: 'resource';
  resource:
    | {
        uri: string;
        text: string;
        mimeType?: string;
        _meta?: Record<string, unknown>;
      }
    | {
        uri: string;
        blob: string;
        mimeType?: string;
        _meta?: Record<string, unknown>;
      };
};

type ToolContent = TextToolContent | JsonResourceContent;

type ToolResult<T extends Record<string, unknown>> = {
  content: Array<ToolContent>;
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
  const text = serializeJsonPayload(payload);

  return {
    content: [
      {
        type: 'text' as const,
        text,
      },
    ],
    structuredContent: payload,
  };
}

export function jsonResourceResult<
  TPayload extends Record<string, unknown>,
  TStructured extends Record<string, unknown> = TPayload,
>(
  payload: TPayload,
  options: {
    uri: string;
    message?: string;
    structuredContent?: TStructured;
  }
): ToolResult<TStructured> {
  const text = serializeJsonPayload(payload);

  return {
    content: [
      {
        type: 'text' as const,
        text: options.message ?? 'JSON resource attached.',
      },
      {
        type: 'resource' as const,
        resource: {
          uri: options.uri,
          mimeType: 'application/json',
          text,
        },
      },
    ],
    structuredContent: (options.structuredContent ?? payload) as TStructured,
  };
}

export function toolErrorResult(
  payload: ToolErrorPayload
): ToolResult<ToolErrorPayload> {
  return {
    content: [
      {
        type: 'text',
        text: serializeJsonPayload(payload),
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

export function assertAtLeastOneDefinedField<T extends Record<string, unknown>>(
  input: T,
  fields: Array<keyof T>,
  message: string
): void {
  if (fields.some(field => input[field] !== undefined)) {
    return;
  }

  throw new Error(message);
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
    message.startsWith('Invalid resolve_date_range input: ') ||
    message === 'Tag name is required' ||
    message === 'startDate must be less than or equal to endDate' ||
    message === 'At least one mutable field must be provided' ||
    message === 'At least one tag field must be provided' ||
    message === 'At least one budget field must be provided' ||
    message.startsWith('Unknown or inactive category id: ') ||
    message.startsWith('Invalid timezone: ')
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

function serializeJsonPayload(payload: Record<string, unknown>): string {
  return JSON.stringify(payload, null, 2);
}
