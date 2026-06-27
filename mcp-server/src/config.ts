import { z } from 'zod';

const booleanEnvSchema = z.preprocess(coerceBooleanEnvValue, z.boolean().default(false));

const configSchema = z
  .object({
    PORT: z.coerce.number().int().positive().default(8080),
    AUTH_MODE: z.enum(['bearer', 'oauth', 'both']).default('bearer'),
    AUTH_BROKER_MODE: z.enum(['disabled', 'google']).default('disabled'),
    LOG_LEVEL: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
      .default('info'),
    FIREBASE_PROJECT_ID: z.string().trim().min(1).optional(),
    EXPENSES_OWNER_UID: z.string().trim().min(1).optional(),
    MCP_BEARER_TOKEN: z.string().trim().min(16).optional(),
    AUTH_ISSUER: z.string().trim().url().optional(),
    AUTH_AUDIENCE: z.string().trim().min(1).optional(),
    AUTH_AUTHORIZATION_SERVER: z.string().trim().url().optional(),
    AUTH_JWKS_URI: z.string().trim().url().optional(),
    AUTH_BROKER_CLIENT_ID: z.string().trim().min(1).optional(),
    AUTH_BROKER_CLIENT_SECRET: z.string().trim().min(1).optional(),
    AUTH_BROKER_ALLOWED_REDIRECT_URIS: z.string().trim().min(1).optional(),
    AUTH_BROKER_ALLOWED_REDIRECT_SCHEMES: z.string().trim().min(1).optional(),
    AUTH_BROKER_BOOTSTRAP_CLIENTS: z.string().trim().min(1).optional(),
    AUTH_BROKER_ENABLE_DCR: booleanEnvSchema,
    AUTH_BROKER_JWT_PRIVATE_KEY: z.string().trim().min(1).optional(),
    AUTH_BROKER_JWT_KEY_ID: z.string().trim().min(1).default('mcp-broker-key-1'),
    AUTH_BROKER_GOOGLE_CLIENT_ID: z.string().trim().min(1).optional(),
    AUTH_BROKER_GOOGLE_CLIENT_SECRET: z.string().trim().min(1).optional(),
    AUTH_BROKER_GOOGLE_HD: z.string().trim().min(1).optional(),
    AUTH_BROKER_GOOGLE_SCOPES: z.string().trim().min(1).default('openid email profile'),
    AUTH_ALLOWED_EMAIL: z.string().trim().min(1).optional(),
    AUTH_ALLOWED_SUB: z.string().trim().min(1).optional(),
    AUTH_RESOLVE_FIREBASE_BY_EMAIL: booleanEnvSchema,
    MAX_RESULT_LIMIT: z.coerce.number().int().min(1).max(500).default(200),
    REQUESTS_PER_MINUTE: z.coerce.number().int().min(10).max(1000).default(180),
  })
  .superRefine((value, ctx) => {
    if ((value.AUTH_MODE === 'bearer' || value.AUTH_MODE === 'both') && !value.EXPENSES_OWNER_UID) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['EXPENSES_OWNER_UID'],
        message: 'EXPENSES_OWNER_UID is required when AUTH_MODE is bearer or both',
      });
    }

    if ((value.AUTH_MODE === 'bearer' || value.AUTH_MODE === 'both') && !value.MCP_BEARER_TOKEN) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['MCP_BEARER_TOKEN'],
        message: 'MCP_BEARER_TOKEN is required when AUTH_MODE is bearer or both',
      });
    }

    if (value.AUTH_MODE === 'oauth' || value.AUTH_MODE === 'both') {
      if (!value.AUTH_ISSUER) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['AUTH_ISSUER'],
          message: 'AUTH_ISSUER is required when AUTH_MODE is oauth or both',
        });
      }

      if (!value.AUTH_AUDIENCE) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['AUTH_AUDIENCE'],
          message: 'AUTH_AUDIENCE is required when AUTH_MODE is oauth or both',
        });
      }
    }

    if (value.AUTH_BROKER_MODE === 'google') {
      if (value.AUTH_MODE === 'bearer') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['AUTH_BROKER_MODE'],
          message: 'AUTH_BROKER_MODE=google requires AUTH_MODE oauth or both',
        });
      }

      for (const [path, currentValue] of [
        ['AUTH_BROKER_JWT_PRIVATE_KEY', value.AUTH_BROKER_JWT_PRIVATE_KEY],
        ['AUTH_BROKER_GOOGLE_CLIENT_ID', value.AUTH_BROKER_GOOGLE_CLIENT_ID],
        ['AUTH_BROKER_GOOGLE_CLIENT_SECRET', value.AUTH_BROKER_GOOGLE_CLIENT_SECRET],
      ] as const) {
        if (!currentValue) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [path],
            message: `${path} is required when AUTH_BROKER_MODE is google`,
          });
        }
      }

      if (
        value.AUTH_BROKER_GOOGLE_CLIENT_ID &&
        !isGoogleOAuthClientId(value.AUTH_BROKER_GOOGLE_CLIENT_ID)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['AUTH_BROKER_GOOGLE_CLIENT_ID'],
          message:
            'AUTH_BROKER_GOOGLE_CLIENT_ID must be a real Google OAuth client ID, not a placeholder value',
        });
      }

      const hasAnyBootstrapClientSetting = [
        value.AUTH_BROKER_CLIENT_ID,
        value.AUTH_BROKER_CLIENT_SECRET,
        value.AUTH_BROKER_ALLOWED_REDIRECT_URIS,
      ].some(Boolean);

      if (
        hasAnyBootstrapClientSetting &&
        (!value.AUTH_BROKER_CLIENT_ID ||
          !value.AUTH_BROKER_CLIENT_SECRET ||
          !value.AUTH_BROKER_ALLOWED_REDIRECT_URIS)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['AUTH_BROKER_CLIENT_ID'],
          message:
            'AUTH_BROKER_CLIENT_ID, AUTH_BROKER_CLIENT_SECRET, and AUTH_BROKER_ALLOWED_REDIRECT_URIS must all be set together when using a bootstrap OAuth client',
        });
      }

      let parsedBootstrapClients: OAuthBrokerBootstrapClient[] = [];
      if (value.AUTH_BROKER_BOOTSTRAP_CLIENTS) {
        try {
          parsedBootstrapClients = parseBootstrapClients(value.AUTH_BROKER_BOOTSTRAP_CLIENTS);
        } catch (error) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['AUTH_BROKER_BOOTSTRAP_CLIENTS'],
            message:
              error instanceof Error
                ? error.message
                : 'AUTH_BROKER_BOOTSTRAP_CLIENTS must be valid JSON',
          });
        }
      }

      const bootstrapClientIds = new Set<string>();
      for (const client of parsedBootstrapClients) {
        if (bootstrapClientIds.has(client.clientId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['AUTH_BROKER_BOOTSTRAP_CLIENTS'],
            message: `Duplicate bootstrap OAuth client_id: ${client.clientId}`,
          });
        }

        bootstrapClientIds.add(client.clientId);
      }

      if (value.AUTH_BROKER_CLIENT_ID && bootstrapClientIds.has(value.AUTH_BROKER_CLIENT_ID)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['AUTH_BROKER_CLIENT_ID'],
          message:
            'AUTH_BROKER_CLIENT_ID duplicates a client_id already present in AUTH_BROKER_BOOTSTRAP_CLIENTS',
        });
      }

      if (
        value.AUTH_AUTHORIZATION_SERVER &&
        value.AUTH_ISSUER &&
        normalizeIssuer(value.AUTH_AUTHORIZATION_SERVER) !== normalizeIssuer(value.AUTH_ISSUER)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['AUTH_AUTHORIZATION_SERVER'],
          message:
            'AUTH_AUTHORIZATION_SERVER must match AUTH_ISSUER when AUTH_BROKER_MODE is google',
        });
      }
    }
  });

export type AuthMode = 'bearer' | 'oauth' | 'both';

export type OAuthConfig = {
  issuer: string;
  audience: string;
  authorizationServer: string;
  jwksUri?: string;
  allowedEmail?: string;
  allowedSub?: string;
};

export type OAuthBrokerConfig = {
  mode: 'google';
  allowedRedirectSchemes: string[];
  enableDynamicClientRegistration: boolean;
  jwtPrivateKey: string;
  jwtKeyId: string;
  googleClientId: string;
  googleClientSecret: string;
  googleHostedDomain?: string;
  googleScopes: string[];
  bootstrapClients: OAuthBrokerBootstrapClient[];
};

export type OAuthBrokerBootstrapClient = {
  clientId: string;
  clientSecret?: string;
  redirectUris: string[];
  tokenEndpointAuthMethod: 'none' | 'client_secret_basic' | 'client_secret_post';
};

export type AppConfig = {
  port: number;
  authMode: AuthMode;
  logLevel: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
  firebaseProjectId?: string;
  ownerUid?: string;
  bearerToken?: string;
  oauth?: OAuthConfig;
  oauthBroker?: OAuthBrokerConfig;
  resolveFirebaseUserByEmail: boolean;
  maxResultLimit: number;
  requestsPerMinute: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = configSchema.parse({
    PORT: env.PORT,
    AUTH_MODE: env.AUTH_MODE,
    LOG_LEVEL: env.LOG_LEVEL,
    FIREBASE_PROJECT_ID: env.FIREBASE_PROJECT_ID ?? env.GOOGLE_CLOUD_PROJECT,
    EXPENSES_OWNER_UID: env.EXPENSES_OWNER_UID,
    MCP_BEARER_TOKEN: env.MCP_BEARER_TOKEN,
    AUTH_ISSUER: env.AUTH_ISSUER,
    AUTH_AUDIENCE: env.AUTH_AUDIENCE,
    AUTH_AUTHORIZATION_SERVER: env.AUTH_AUTHORIZATION_SERVER,
    AUTH_JWKS_URI: env.AUTH_JWKS_URI,
    AUTH_BROKER_MODE: env.AUTH_BROKER_MODE,
    AUTH_BROKER_CLIENT_ID: env.AUTH_BROKER_CLIENT_ID,
    AUTH_BROKER_CLIENT_SECRET: env.AUTH_BROKER_CLIENT_SECRET,
    AUTH_BROKER_ALLOWED_REDIRECT_URIS: env.AUTH_BROKER_ALLOWED_REDIRECT_URIS,
    AUTH_BROKER_ALLOWED_REDIRECT_SCHEMES: env.AUTH_BROKER_ALLOWED_REDIRECT_SCHEMES,
    AUTH_BROKER_BOOTSTRAP_CLIENTS: env.AUTH_BROKER_BOOTSTRAP_CLIENTS,
    AUTH_BROKER_ENABLE_DCR: env.AUTH_BROKER_ENABLE_DCR,
    AUTH_BROKER_JWT_PRIVATE_KEY: env.AUTH_BROKER_JWT_PRIVATE_KEY,
    AUTH_BROKER_JWT_KEY_ID: env.AUTH_BROKER_JWT_KEY_ID,
    AUTH_BROKER_GOOGLE_CLIENT_ID: env.AUTH_BROKER_GOOGLE_CLIENT_ID,
    AUTH_BROKER_GOOGLE_CLIENT_SECRET: env.AUTH_BROKER_GOOGLE_CLIENT_SECRET,
    AUTH_BROKER_GOOGLE_HD: env.AUTH_BROKER_GOOGLE_HD,
    AUTH_BROKER_GOOGLE_SCOPES: env.AUTH_BROKER_GOOGLE_SCOPES,
    AUTH_ALLOWED_EMAIL: env.AUTH_ALLOWED_EMAIL,
    AUTH_ALLOWED_SUB: env.AUTH_ALLOWED_SUB,
    AUTH_RESOLVE_FIREBASE_BY_EMAIL: env.AUTH_RESOLVE_FIREBASE_BY_EMAIL,
    MAX_RESULT_LIMIT: env.MAX_RESULT_LIMIT,
    REQUESTS_PER_MINUTE: env.REQUESTS_PER_MINUTE,
  });

  const bootstrapClients = [
    ...parseOptionalBootstrapClients(parsed.AUTH_BROKER_BOOTSTRAP_CLIENTS),
    ...buildLegacyBootstrapClients(parsed),
  ];

  return {
    port: parsed.PORT,
    authMode: parsed.AUTH_MODE,
    logLevel: parsed.LOG_LEVEL,
    firebaseProjectId: parsed.FIREBASE_PROJECT_ID,
    ownerUid: parsed.EXPENSES_OWNER_UID,
    bearerToken: parsed.MCP_BEARER_TOKEN,
    oauth:
      parsed.AUTH_ISSUER && parsed.AUTH_AUDIENCE
        ? {
            issuer: normalizeIssuer(parsed.AUTH_ISSUER),
            audience: parsed.AUTH_AUDIENCE,
            authorizationServer: normalizeIssuer(
              parsed.AUTH_AUTHORIZATION_SERVER ?? parsed.AUTH_ISSUER
            ),
            jwksUri: parsed.AUTH_JWKS_URI,
            allowedEmail: parsed.AUTH_ALLOWED_EMAIL,
            allowedSub: parsed.AUTH_ALLOWED_SUB,
          }
        : undefined,
    oauthBroker:
      parsed.AUTH_BROKER_MODE === 'google'
        ? {
            allowedRedirectSchemes: splitCommaSeparated(
              parsed.AUTH_BROKER_ALLOWED_REDIRECT_SCHEMES ?? ''
            ),
            mode: 'google',
            enableDynamicClientRegistration: parsed.AUTH_BROKER_ENABLE_DCR,
            jwtPrivateKey: normalizePrivateKey(parsed.AUTH_BROKER_JWT_PRIVATE_KEY!),
            jwtKeyId: parsed.AUTH_BROKER_JWT_KEY_ID,
            googleClientId: parsed.AUTH_BROKER_GOOGLE_CLIENT_ID!,
            googleClientSecret: parsed.AUTH_BROKER_GOOGLE_CLIENT_SECRET!,
            googleHostedDomain: parsed.AUTH_BROKER_GOOGLE_HD,
            googleScopes: splitWhitespaceSeparated(parsed.AUTH_BROKER_GOOGLE_SCOPES),
            bootstrapClients,
          }
        : undefined,
    resolveFirebaseUserByEmail: parsed.AUTH_RESOLVE_FIREBASE_BY_EMAIL,
    maxResultLimit: parsed.MAX_RESULT_LIMIT,
    requestsPerMinute: parsed.REQUESTS_PER_MINUTE,
  };
}

function normalizeIssuer(issuer: string): string {
  return issuer.endsWith('/') ? issuer : `${issuer}/`;
}

function normalizePrivateKey(value: string): string {
  return value.replace(/\\n/g, '\n');
}

function coerceBooleanEnvValue(value: unknown): unknown {
  if (typeof value === 'boolean' || value === undefined) {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();

    if (['1', 'true', 'yes', 'on'].includes(normalized)) {
      return true;
    }

    if (['0', 'false', 'no', 'off', ''].includes(normalized)) {
      return false;
    }
  }

  return value;
}

function isGoogleOAuthClientId(value: string): boolean {
  return /^[0-9]+-[a-z0-9]+\.apps\.googleusercontent\.com$/i.test(value);
}

function splitCommaSeparated(value: string): string[] {
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

function splitWhitespaceSeparated(value: string): string[] {
  return value
    .split(/\s+/)
    .map(item => item.trim())
    .filter(Boolean);
}

function parseOptionalBootstrapClients(value?: string): OAuthBrokerBootstrapClient[] {
  return value ? parseBootstrapClients(value) : [];
}

function buildLegacyBootstrapClients(parsed: {
  AUTH_BROKER_CLIENT_ID?: string;
  AUTH_BROKER_CLIENT_SECRET?: string;
  AUTH_BROKER_ALLOWED_REDIRECT_URIS?: string;
}): OAuthBrokerBootstrapClient[] {
  if (
    !parsed.AUTH_BROKER_CLIENT_ID ||
    !parsed.AUTH_BROKER_CLIENT_SECRET ||
    !parsed.AUTH_BROKER_ALLOWED_REDIRECT_URIS
  ) {
    return [];
  }

  return [
    {
      clientId: parsed.AUTH_BROKER_CLIENT_ID,
      clientSecret: parsed.AUTH_BROKER_CLIENT_SECRET,
      redirectUris: splitCommaSeparated(parsed.AUTH_BROKER_ALLOWED_REDIRECT_URIS),
      tokenEndpointAuthMethod: 'client_secret_post',
    },
  ];
}

function parseBootstrapClients(value: string): OAuthBrokerBootstrapClient[] {
  const parsedValue = JSON.parse(value) as unknown;
  const schema = z
    .array(
      z
        .object({
          clientId: z.string().trim().min(1),
          clientSecret: z.string().trim().min(1).optional(),
          redirectUris: z.array(z.string().trim().url()).min(1),
          tokenEndpointAuthMethod: z
            .enum(['none', 'client_secret_basic', 'client_secret_post'])
            .default('client_secret_post'),
        })
        .superRefine((client, ctx) => {
          if (client.tokenEndpointAuthMethod === 'none' && client.clientSecret) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['clientSecret'],
              message: 'clientSecret must be omitted when tokenEndpointAuthMethod is none',
            });
          }

          if (client.tokenEndpointAuthMethod !== 'none' && !client.clientSecret) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['clientSecret'],
              message:
                'clientSecret is required when tokenEndpointAuthMethod is client_secret_basic or client_secret_post',
            });
          }
        })
    )
    .min(1, 'AUTH_BROKER_BOOTSTRAP_CLIENTS must contain at least one client');

  return schema.parse(parsedValue);
}