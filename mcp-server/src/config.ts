import { z } from 'zod';

const configSchema = z.object({
  PORT: z.coerce.number().int().positive().default(8080),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),
  FIREBASE_PROJECT_ID: z.string().trim().min(1).optional(),
  EXPENSES_OWNER_UID: z.string().trim().min(1),
  MCP_BEARER_TOKEN: z.string().trim().min(16),
  MAX_RESULT_LIMIT: z.coerce.number().int().min(1).max(500).default(200),
  REQUESTS_PER_MINUTE: z.coerce.number().int().min(10).max(1000).default(180),
});

export type AppConfig = {
  port: number;
  logLevel: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
  firebaseProjectId?: string;
  ownerUid: string;
  bearerToken: string;
  maxResultLimit: number;
  requestsPerMinute: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = configSchema.parse({
    PORT: env.PORT,
    LOG_LEVEL: env.LOG_LEVEL,
    FIREBASE_PROJECT_ID: env.FIREBASE_PROJECT_ID ?? env.GOOGLE_CLOUD_PROJECT,
    EXPENSES_OWNER_UID: env.EXPENSES_OWNER_UID,
    MCP_BEARER_TOKEN: env.MCP_BEARER_TOKEN,
    MAX_RESULT_LIMIT: env.MAX_RESULT_LIMIT,
    REQUESTS_PER_MINUTE: env.REQUESTS_PER_MINUTE,
  });

  return {
    port: parsed.PORT,
    logLevel: parsed.LOG_LEVEL,
    firebaseProjectId: parsed.FIREBASE_PROJECT_ID,
    ownerUid: parsed.EXPENSES_OWNER_UID,
    bearerToken: parsed.MCP_BEARER_TOKEN,
    maxResultLimit: parsed.MAX_RESULT_LIMIT,
    requestsPerMinute: parsed.REQUESTS_PER_MINUTE,
  };
}