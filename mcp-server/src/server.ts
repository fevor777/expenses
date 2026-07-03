import express, { type Express, type Request, type Response } from 'express';
import { createHash } from 'node:crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { Logger } from 'pino';
import type { AppConfig } from './config.js';
import {
  buildCallerFingerprint,
  createAuthMiddleware,
  OAUTH_RESOURCE_METADATA_PATH,
} from './auth.js';
import { resolveRequestOwnerUid } from './firebase-user-resolver.js';
import { getFirestoreClient } from './firestore/client.js';
import { registerExpenseAnalysisPrompts } from './prompts/expense-analysis.js';
import { ExpensesRepository } from './firestore/expenses.repository.js';
import { SettingsRepository } from './firestore/settings.repository.js';
import { TagsRepository } from './firestore/tags.repository.js';
import { registerOAuthBrokerRoutes } from './oauth-broker.js';
import { registerCreateExpenseTool } from './tools/create-expense.js';
import { registerCreateTagTool } from './tools/create-tag.js';
import { registerExportExpensesTool } from './tools/export-expenses.js';
import { registerBudgetPeriodSummaryTool } from './tools/budget-period-summary.js';
import { registerBudgetSummaryTool } from './tools/budget-summary.js';
import { registerBudgetSummaryWithExpensesForPeriodTool } from './tools/budget-summary-with-expenses-for-period.js';
import { registerGetCurrentTimeTool } from './tools/get-current-time.js';
import { registerDeleteTagTool } from './tools/delete-tag.js';
import { registerDeleteExpenseTool } from './tools/delete-expense.js';
import { registerGetBudgetTool } from './tools/get-budget.js';
import { registerGetExpenseTool } from './tools/get-expense.js';
import { registerGetSavingsTool } from './tools/get-savings.js';
import { registerListCategoriesTool } from './tools/list-categories.js';
import { registerListExpensesTool } from './tools/list-expenses.js';
import { registerListExpensesForPeriodTool } from './tools/list-expenses-for-period.js';
import { registerListTagsTool } from './tools/list-tags.js';
import { registerMonthPeriodSummaryTool } from './tools/month-period-summary.js';
import { registerMonthlySummaryTool } from './tools/monthly-summary.js';
import { registerResolveDateRangeTool } from './tools/resolve-date-range.js';
import { type ToolDependencies } from './tools/shared.js';
import { registerUpdateTagTool } from './tools/update-tag.js';
import { registerUpdateBudgetTool } from './tools/update-budget.js';
import { registerUpdateExpenseTool } from './tools/update-expense.js';
import { registerUpdateSavingsTool } from './tools/update-savings.js';

export function createHttpApp(config: AppConfig, logger: Logger): Express {
  const firestore = getFirestoreClient(config);

  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', true);
  app.use(express.json({ limit: '256kb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(createRequestLogger(logger));
  app.get('/healthz', (_req, res) => {
    res.status(200).json({ ok: true });
  });
  registerOAuthBrokerRoutes(app, config, logger);

  const oauthConfig = config.oauth;
  if (oauthConfig) {
    app.get(OAUTH_RESOURCE_METADATA_PATH, (_req, res) => {
      res.status(200).json({
        resource: oauthConfig.audience,
        authorization_servers: [oauthConfig.authorizationServer],
        bearer_methods_supported: ['header'],
        scopes_supported: ['expenses.read', 'expenses.write'],
        resource_name: 'Expenses MCP',
      });
    });
  }

  const auth = createAuthMiddleware(config);
  const rateLimiter = createRateLimitMiddleware(config.requestsPerMinute);

  app.all('/mcp', auth, rateLimiter, async (req, res, next) => {
    const ownerUid = await resolveRequestOwnerUid(req, config, logger);
    const server = buildMcpServer(
      createToolDependencies(config, logger, firestore, ownerUid)
    );
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      next(error);
    } finally {
      await transport.close();
      await server.close();
    }
  });

  app.use((error: unknown, _req: Request, res: Response, _next: express.NextFunction) => {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    const statusCode = getErrorStatusCode(error);
    logger.error({ error: message, statusCode }, 'Unhandled request error');
    if (!res.headersSent) {
      res.status(statusCode).json({ error: message });
    }
  });

  return app;
}

function createToolDependencies(
  config: AppConfig,
  logger: Logger,
  firestore: ReturnType<typeof getFirestoreClient>,
  ownerUid: string
): ToolDependencies {
  return {
    config,
    logger,
    expensesRepository: new ExpensesRepository(firestore, ownerUid),
    settingsRepository: new SettingsRepository(firestore, ownerUid),
    tagsRepository: new TagsRepository(firestore, ownerUid),
  };
}

function buildMcpServer(deps: ToolDependencies): McpServer {
  const server = new McpServer({
    name: 'expenses-mcp',
    version: '0.1.0',
  });

  registerExpenseAnalysisPrompts(server);

  registerListExpensesTool(server, deps);
  registerListExpensesForPeriodTool(server, deps);
  registerExportExpensesTool(server, deps);
  registerGetCurrentTimeTool(server, deps);
  registerResolveDateRangeTool(server, deps);
  registerGetExpenseTool(server, deps);
  registerDeleteExpenseTool(server, deps);
  registerBudgetSummaryTool(server, deps);
  registerBudgetSummaryWithExpensesForPeriodTool(server, deps);
  registerBudgetPeriodSummaryTool(server, deps);
  registerMonthlySummaryTool(server, deps);
  registerMonthPeriodSummaryTool(server, deps);
  registerListCategoriesTool(server, deps);
  registerListTagsTool(server, deps);
  registerGetBudgetTool(server, deps);
  registerUpdateBudgetTool(server, deps);
  registerGetSavingsTool(server, deps);
  registerUpdateSavingsTool(server, deps);
  registerCreateTagTool(server, deps);
  registerUpdateTagTool(server, deps);
  registerDeleteTagTool(server, deps);
  registerCreateExpenseTool(server, deps);
  registerUpdateExpenseTool(server, deps);

  return server;
}

function createRequestLogger(logger: Logger) {
  return (req: Request, res: Response, next: express.NextFunction) => {
    const startedAt = Date.now();
    res.on('finish', () => {
      logger.info(
        {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          durationMs: Date.now() - startedAt,
          callerFingerprint: buildCallerFingerprint(req),
          mcpMethod: getMcpMethod(req.body),
          toolName: getToolName(req.body),
        },
        'HTTP request completed'
      );
    });
    next();
  };
}

function getErrorStatusCode(error: unknown): number {
  if (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    typeof error.statusCode === 'number' &&
    error.statusCode >= 400 &&
    error.statusCode < 600
  ) {
    return error.statusCode;
  }

  return 500;
}

function createRateLimitMiddleware(requestsPerMinute: number) {
  const windowMs = 60_000;
  const buckets = new Map<string, { count: number; startedAt: number }>();

  return (req: Request, res: Response, next: express.NextFunction) => {
    const key = createHash('sha256')
      .update(req.ip || req.socket.remoteAddress || 'unknown')
      .digest('hex');
    const currentTime = Date.now();
    const currentBucket = buckets.get(key);

    if (!currentBucket || currentTime - currentBucket.startedAt >= windowMs) {
      buckets.set(key, { count: 1, startedAt: currentTime });
      next();
      return;
    }

    if (currentBucket.count >= requestsPerMinute) {
      res.status(429).json({ error: 'Rate limit exceeded' });
      return;
    }

    currentBucket.count += 1;
    next();
  };
}

function getMcpMethod(body: unknown): string | undefined {
  if (!isRecord(body)) {
    return undefined;
  }
  return typeof body.method === 'string' ? body.method : undefined;
}

function getToolName(body: unknown): string | undefined {
  if (!isRecord(body) || !isRecord(body.params)) {
    return undefined;
  }
  return typeof body.params.name === 'string' ? body.params.name : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
