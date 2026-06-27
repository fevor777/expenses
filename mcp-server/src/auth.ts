import { createHash, timingSafeEqual } from 'node:crypto';
import type { Request, RequestHandler, Response } from 'express';
import { createRemoteJWKSet, decodeJwt, jwtVerify } from 'jose';
import type { AppConfig, OAuthConfig } from './config.js';

export const OAUTH_RESOURCE_METADATA_PATH = '/.well-known/oauth-protected-resource/mcp';

export type AuthInfo = {
  kind: 'bearer' | 'oauth';
  principal: string;
  fingerprintSource: string;
  email?: string;
  emailVerified?: boolean;
  issuer?: string;
  sub?: string;
};

declare global {
  namespace Express {
    interface Request {
      authInfo?: AuthInfo;
    }
  }
}

export function createAuthMiddleware(config: AppConfig): RequestHandler {
  const resolveJwks = createJwksResolver(config.oauth);

  return async (req, res, next) => {
    const header = req.header('authorization');
    if (!header?.startsWith('Bearer ')) {
      rejectUnauthorized(config, req, res, 'Missing bearer token');
      return;
    }

    const token = header.slice('Bearer '.length).trim();

    if (canUseLegacyBearer(config) && tokensMatch(config.bearerToken, token)) {
      req.authInfo = {
        kind: 'bearer',
        principal: 'legacy-bearer',
        fingerprintSource: `bearer:${token}`,
      };
      next();
      return;
    }

    if (canUseOAuth(config)) {
      try {
        const jwks = await resolveJwks();
        const identity = await verifyOAuthToken(token, jwks, config.oauth);
        req.authInfo = {
          kind: 'oauth',
          principal: identity.email ?? identity.sub ?? 'oauth-user',
          fingerprintSource: `oauth:${identity.email ?? identity.sub ?? 'unknown'}`,
          email: identity.email,
          emailVerified: identity.emailVerified,
          issuer: config.oauth.issuer,
          sub: identity.sub,
        };
        next();
        return;
      } catch {
        req.authInfo = buildUnverifiedOAuthAuthInfo(token);
      }
    }

    rejectUnauthorized(config, req, res, 'Invalid bearer token');
  };
}

export function buildCallerFingerprint(req: Request): string {
  const forwardedFor = req.header('x-forwarded-for') ?? '';
  const remoteAddress = req.ip || req.socket.remoteAddress || '';
  const authSource = req.authInfo?.fingerprintSource ?? buildHeaderFingerprintSource(req);

  return createHash('sha256')
    .update(`${authSource}|${forwardedFor}|${remoteAddress}`)
    .digest('hex')
    .slice(0, 16);
}

function rejectUnauthorized(config: AppConfig, req: Request, res: Response, message: string): void {
  const challenge = buildWwwAuthenticateHeader(config, req);
  if (challenge) {
    res.setHeader('WWW-Authenticate', challenge);
  }
  res.status(401).json({ error: message });
}

function buildWwwAuthenticateHeader(config: AppConfig, req: Request): string | undefined {
  if (!canUseOAuth(config)) {
    return undefined;
  }

  const metadataUrl = resolveMetadataUrl(req);
  return metadataUrl ? `Bearer resource_metadata="${metadataUrl}"` : undefined;
}

function resolveMetadataUrl(req: Request): string | undefined {
  const host = req.header('x-forwarded-host')?.split(',')[0]?.trim() ?? req.header('host');
  if (!host) {
    return undefined;
  }

  const protocol = req.header('x-forwarded-proto')?.split(',')[0]?.trim() ?? req.protocol;
  return `${protocol}://${host}${OAUTH_RESOURCE_METADATA_PATH}`;
}

function canUseLegacyBearer(config: AppConfig): boolean {
  return (config.authMode === 'bearer' || config.authMode === 'both') && !!config.bearerToken;
}

function canUseOAuth(config: AppConfig): config is AppConfig & { oauth: OAuthConfig } {
  return (config.authMode === 'oauth' || config.authMode === 'both') && !!config.oauth;
}

function tokensMatch(expectedToken: string | undefined, providedToken: string): boolean {
  if (!expectedToken) {
    return false;
  }

  const expectedBuffer = Buffer.from(expectedToken);
  const providedBuffer = Buffer.from(providedToken);

  return (
    expectedBuffer.length === providedBuffer.length &&
    timingSafeEqual(expectedBuffer, providedBuffer)
  );
}

async function verifyOAuthToken(
  token: string,
  jwks: ReturnType<typeof createRemoteJWKSet>,
  oauthConfig: OAuthConfig
): Promise<{ sub?: string; email?: string; emailVerified?: boolean }> {
  const { payload } = await jwtVerify(token, jwks, {
    issuer: oauthConfig.issuer,
    audience: oauthConfig.audience,
  });

  const email = typeof payload.email === 'string' ? payload.email : undefined;
  const emailVerified = payload.email_verified === true;
  const sub = typeof payload.sub === 'string' ? payload.sub : undefined;

  if (oauthConfig.allowedEmail && email !== oauthConfig.allowedEmail) {
    throw new Error('Token email is not allowed');
  }

  if (oauthConfig.allowedSub && sub !== oauthConfig.allowedSub) {
    throw new Error('Token subject is not allowed');
  }

  return { sub, email, emailVerified };
}

function createJwksResolver(oauthConfig: OAuthConfig | undefined) {
  let jwksPromise: Promise<ReturnType<typeof createRemoteJWKSet>> | undefined;

  return async (): Promise<ReturnType<typeof createRemoteJWKSet>> => {
    if (!oauthConfig) {
      throw new Error('OAuth configuration is not available');
    }

    jwksPromise ??= loadJwksResolver(oauthConfig);
    return jwksPromise;
  };
}

async function loadJwksResolver(
  oauthConfig: OAuthConfig
): Promise<ReturnType<typeof createRemoteJWKSet>> {
  const jwksUri = oauthConfig.jwksUri ?? (await discoverJwksUri(oauthConfig.issuer));
  return createRemoteJWKSet(new URL(jwksUri));
}

async function discoverJwksUri(issuer: string): Promise<string> {
  const discoveryUrl = resolveOpenIdConfigurationUrl(issuer);
  const response = await fetch(discoveryUrl);

  if (!response.ok) {
    throw new Error(`Failed to load OIDC discovery document from ${discoveryUrl}`);
  }

  const payload = await response.json();
  if (!isRecord(payload) || typeof payload.jwks_uri !== 'string') {
    throw new Error(`OIDC discovery document at ${discoveryUrl} does not include jwks_uri`);
  }

  if (typeof payload.issuer === 'string' && normalizeIssuer(payload.issuer) !== normalizeIssuer(issuer)) {
    throw new Error(`OIDC discovery issuer mismatch for ${discoveryUrl}`);
  }

  return payload.jwks_uri;
}

function resolveOpenIdConfigurationUrl(issuer: string): URL {
  const issuerUrl = new URL(issuer);
  const issuerPath = issuerUrl.pathname.replace(/\/+$/, '');

  issuerUrl.pathname = issuerPath
    ? `/.well-known/openid-configuration${issuerPath}`
    : '/.well-known/openid-configuration';
  issuerUrl.search = '';
  issuerUrl.hash = '';

  return issuerUrl;
}

function normalizeIssuer(issuer: string): string {
  return issuer.endsWith('/') ? issuer : `${issuer}/`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function buildUnverifiedOAuthAuthInfo(token: string): AuthInfo | undefined {
  try {
    const payload = decodeJwt(token);
    const email = typeof payload.email === 'string' ? payload.email : undefined;
    const sub = typeof payload.sub === 'string' ? payload.sub : undefined;

    return {
      kind: 'oauth',
      principal: email ?? sub ?? 'unknown',
      fingerprintSource: `oauth:${email ?? sub ?? 'unknown'}`,
      email,
      emailVerified: payload.email_verified === true,
      sub,
    };
  } catch {
    return undefined;
  }
}

function buildHeaderFingerprintSource(req: Request): string {
  const header = req.header('authorization') ?? '';
  if (!header.startsWith('Bearer ')) {
    return header;
  }

  const token = header.slice('Bearer '.length).trim();
  const unverifiedInfo = buildUnverifiedOAuthAuthInfo(token);
  if (unverifiedInfo) {
    return unverifiedInfo.fingerprintSource;
  }

  return `bearer:${token}`;
}