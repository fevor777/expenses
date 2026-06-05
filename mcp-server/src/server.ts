import express, { type Express, type Request, type Response } from 'express';
import { createHash } from 'node:crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { Logger } from 'pino';
import type { AppConfig } from './config.js';
import { createBearerAuth, buildCallerFingerprint } from './auth.js';
import { getFirestoreClient } from './firestore/client.js';
import { ExpensesRepository } from './firestore/expenses.repository.js';
import { SettingsRepository } from './firestore/settings.repository.js';
import { registerCreateExpenseTool } from './tools/create-expense.js';
import { registerExportExpensesTool } from './tools/export-expenses.js';
import { registerGetExpenseTool } from './tools/get-expense.js';
import { registerListExpensesTool } from './tools/list-expenses.js';
import { registerMonthlySummaryTool } from './tools/monthly-summary.js';
import { registerSearchExpensesTool } from './tools/search-expenses.js';
import { type ToolDependencies } from './tools/shared.js';
import { registerUpdateExpenseTool } from './tools/update-expense.js';

export function createHttpApp(config: AppConfig, logger: Logger): Express {
  const firestore = getFirestoreClient(config);
  const toolDependencies: ToolDependencies = {
    config,
    logger,
    expensesRepository: new ExpensesRepository(firestore, config.ownerUid),
    settingsRepository: new SettingsRepository(firestore, config.ownerUid),
  };

  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '256kb' }));
  app.use(createRequestLogger(logger));
  app.get('/healthz', (_req, res) => {
    res.status(200).json({ ok: true });
  });

  const auth = createBearerAuth(config.bearerToken);
  const rateLimiter = createRateLimitMiddleware(config.requestsPerMinute);

  app.all('/mcp', auth, rateLimiter, async (req, res, next) => {
    const server = buildMcpServer(toolDependencies);
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
    logger.error({ error: message }, 'Unhandled request error');
    if (!res.headersSent) {
      res.status(500).json({ error: message });
    }
  });

  return app;
}

function buildMcpServer(deps: ToolDependencies): McpServer {
  const server = new McpServer({
    name: 'expenses-mcp',
    version: '0.1.0',
  });

  registerListExpensesTool(server, deps);
  registerSearchExpensesTool(server, deps);
  registerGetExpenseTool(server, deps);
  registerMonthlySummaryTool(server, deps);
  registerExportExpensesTool(server, deps);
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