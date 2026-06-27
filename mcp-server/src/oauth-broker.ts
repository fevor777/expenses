import {
  createHash,
  createPrivateKey,
  createPublicKey,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';
import type { Express, Request, Response } from 'express';
import { exportJWK, importJWK, jwtVerify, SignJWT, type JWK } from 'jose';
import type { Logger } from 'pino';
import type { AppConfig, OAuthBrokerConfig, OAuthConfig } from './config.js';
import { getFirestoreClient } from './firestore/client.js';
import {
  OAuthClientsRepository,
  type OAuthClientRegistration,
  type OAuthClientTokenEndpointAuthMethod,
} from './firestore/oauth-clients.repository.js';

const AUTHORIZATION_SERVER_METADATA_PATH = '/.well-known/oauth-authorization-server';
const GOOGLE_ISSUERS = ['https://accounts.google.com', 'accounts.google.com'];
const GOOGLE_AUTHORIZATION_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_DISCOVERY_URL = 'https://accounts.google.com/.well-known/openid-configuration';
const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const OIDC_DISCOVERY_PATH = '/.well-known/openid-configuration';
const OAUTH_AUTHORIZE_PATH = '/oauth/authorize';
const OAUTH_CALLBACK_PATH = '/oauth/callback';
const OAUTH_JWKS_PATH = '/oauth/jwks.json';
const OAUTH_REGISTER_PATH = '/oauth/register';
const OAUTH_TOKEN_PATH = '/oauth/token';

type GoogleIdentity = {
  sub: string;
  email?: string;
  emailVerified: boolean;
  hostedDomain?: string;
};

type BrokerState = {
  clientId: string;
  redirectUri: string;
  state?: string;
  scope: string;
  codeChallenge: string;
  codeChallengeMethod: 'S256';
  nonce: string;
};

type AuthorizationCodePayload = {
  clientId: string;
  redirectUri: string;
  scope: string;
  codeChallenge: string;
  codeChallengeMethod: 'S256';
  sub: string;
  email?: string;
};

type RefreshTokenPayload = {
  clientId: string;
  scope: string;
  sub: string;
  email?: string;
};

class InvalidClientMetadataError extends Error {}

export function registerOAuthBrokerRoutes(
  app: Express,
  config: AppConfig,
  logger: Logger
): void {
  if (!config.oauth || !config.oauthBroker || config.oauthBroker.mode !== 'google') {
    return;
  }

  const broker = createGoogleBroker(
    config.oauth,
    config.oauthBroker,
    new OAuthClientsRepository(getFirestoreClient(config)),
    logger
  );

  app.get(AUTHORIZATION_SERVER_METADATA_PATH, async (_req, res, next) => {
    try {
      const metadata = await broker.getAuthorizationServerMetadata();
      res.status(200).json(metadata);
    } catch (error) {
      next(error);
    }
  });

  app.get(OIDC_DISCOVERY_PATH, async (_req, res, next) => {
    try {
      const metadata = await broker.getAuthorizationServerMetadata();
      res.status(200).json(metadata);
    } catch (error) {
      next(error);
    }
  });

  app.get(OAUTH_JWKS_PATH, async (_req, res, next) => {
    try {
      const jwks = await broker.getJwks();
      res.status(200).json(jwks);
    } catch (error) {
      next(error);
    }
  });

  if (config.oauthBroker.enableDynamicClientRegistration) {
    app.post(OAUTH_REGISTER_PATH, async (req, res, next) => {
      try {
        await broker.handleRegister(req, res);
      } catch (error) {
        if (error instanceof InvalidClientMetadataError) {
          res.status(400).json({
            error: 'invalid_client_metadata',
            error_description: error.message,
          });
          return;
        }

        next(error);
      }
    });
  }

  app.get(OAUTH_AUTHORIZE_PATH, async (req, res, next) => {
    try {
      await broker.handleAuthorize(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.get(OAUTH_CALLBACK_PATH, async (req, res, next) => {
    try {
      await broker.handleCallback(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.post(OAUTH_TOKEN_PATH, async (req, res, next) => {
    try {
      await broker.handleToken(req, res);
    } catch (error) {
      next(error);
    }
  });
}

function createGoogleBroker(
  oauthConfig: OAuthConfig,
  brokerConfig: OAuthBrokerConfig,
  oauthClientsRepository: OAuthClientsRepository,
  logger: Logger
) {
  const baseUrl = stripTrailingSlash(oauthConfig.authorizationServer);
  const callbackUrl = `${baseUrl}${OAUTH_CALLBACK_PATH}`;
  const keyPromise = loadSigningKeys(brokerConfig);
  const googleJwksPromise = createGoogleJwksResolver();

  return {
    async getAuthorizationServerMetadata() {
      return {
        issuer: oauthConfig.issuer,
        authorization_endpoint: `${baseUrl}${OAUTH_AUTHORIZE_PATH}`,
        token_endpoint: `${baseUrl}${OAUTH_TOKEN_PATH}`,
        ...(brokerConfig.enableDynamicClientRegistration
          ? { registration_endpoint: `${baseUrl}${OAUTH_REGISTER_PATH}` }
          : {}),
        jwks_uri: `${baseUrl}${OAUTH_JWKS_PATH}`,
        response_types_supported: ['code'],
        grant_types_supported: ['authorization_code', 'refresh_token'],
        token_endpoint_auth_methods_supported: [
          'none',
          'client_secret_basic',
          'client_secret_post',
        ],
        code_challenge_methods_supported: ['S256'],
        scopes_supported: ['openid', 'email', 'profile', 'expenses.read', 'expenses.write'],
        subject_types_supported: ['public'],
        id_token_signing_alg_values_supported: ['RS256'],
      };
    },

    async getJwks() {
      const { publicJwk } = await keyPromise;
      return { keys: [publicJwk] };
    },

    async handleRegister(req: Request, res: Response) {
      const redirectUris = readClientMetadata(() => readStringArrayBodyParam(req, 'redirect_uris'));
      readClientMetadata(() => validateRedirectUris(redirectUris, brokerConfig.allowedRedirectSchemes));

      const tokenEndpointAuthMethod = readClientMetadata(() => readTokenEndpointAuthMethod(req));
      const grantTypes = readClientMetadata(
        () => readOptionalStringArrayBodyParam(req, 'grant_types') ?? ['authorization_code']
      );
      const responseTypes = readClientMetadata(
        () => readOptionalStringArrayBodyParam(req, 'response_types') ?? ['code']
      );

      readClientMetadata(() => validateRegistrationGrantTypes(grantTypes, responseTypes));
      readClientMetadata(() => validateRefreshTokenSupport(grantTypes, tokenEndpointAuthMethod));

      const issuedAt = Math.floor(Date.now() / 1000);
      const clientId = `mcp_${randomBytes(12).toString('hex')}`;
      const clientSecret =
        tokenEndpointAuthMethod === 'none' ? undefined : randomBytes(24).toString('hex');
      const registration: OAuthClientRegistration = {
        clientId,
        clientSecretHash: clientSecret ? hashClientSecret(clientSecret) : undefined,
        redirectUris,
        grantTypes,
        responseTypes,
        tokenEndpointAuthMethod,
        clientName: readOptionalBodyString(req, 'client_name'),
        clientUri: readOptionalBodyString(req, 'client_uri'),
        logoUri: readOptionalBodyString(req, 'logo_uri'),
        scope: readOptionalBodyString(req, 'scope'),
        contacts: readOptionalStringArrayBodyParam(req, 'contacts') ?? undefined,
        clientIdIssuedAt: issuedAt,
        clientSecretExpiresAt: clientSecret ? 0 : undefined,
        createdAt: Date.now(),
      };

      await oauthClientsRepository.create(registration);

      res.status(201).json({
        client_id: registration.clientId,
        client_secret: clientSecret,
        client_id_issued_at: registration.clientIdIssuedAt,
        client_secret_expires_at: registration.clientSecretExpiresAt,
        redirect_uris: registration.redirectUris,
        grant_types: registration.grantTypes,
        response_types: registration.responseTypes,
        token_endpoint_auth_method: registration.tokenEndpointAuthMethod,
        client_name: registration.clientName,
        client_uri: registration.clientUri,
        logo_uri: registration.logoUri,
        scope: registration.scope,
        contacts: registration.contacts,
      });
    },

    async handleAuthorize(req: Request, res: Response) {
      const clientId = readSingleQueryParam(req, 'client_id');
      const redirectUri = readSingleQueryParam(req, 'redirect_uri');
      const responseType = readSingleQueryParam(req, 'response_type');
      const state = readOptionalQueryParam(req, 'state');
      const scope = readOptionalQueryParam(req, 'scope') ?? 'expenses.read expenses.write';
      const codeChallenge = readSingleQueryParam(req, 'code_challenge');
      const codeChallengeMethod = readOptionalQueryParam(req, 'code_challenge_method') ?? 'S256';

      if (responseType !== 'code') {
        throw new Error('Unsupported response_type');
      }

      const client = await requireRegisteredClient(
        brokerConfig,
        oauthClientsRepository,
        clientId
      );
      validateClientRequest(client, redirectUri);

      if (codeChallengeMethod !== 'S256') {
        throw new Error('Only S256 PKCE is supported');
      }

      const nonce = randomBytes(16).toString('hex');
      const brokerState = await signBrokerState(
        {
          clientId,
          redirectUri,
          state,
          scope,
          codeChallenge,
          codeChallengeMethod: 'S256',
          nonce,
        },
        oauthConfig,
        brokerConfig,
        keyPromise
      );

      const params = new URLSearchParams({
        client_id: brokerConfig.googleClientId,
        redirect_uri: callbackUrl,
        response_type: 'code',
        scope: brokerConfig.googleScopes.join(' '),
        state: brokerState,
        nonce,
      });

      if (brokerConfig.googleHostedDomain) {
        params.set('hd', brokerConfig.googleHostedDomain);
      }

      res.redirect(`${GOOGLE_AUTHORIZATION_ENDPOINT}?${params.toString()}`);
    },

    async handleCallback(req: Request, res: Response) {
      const code = readSingleQueryParam(req, 'code');
      const brokerStateToken = readSingleQueryParam(req, 'state');
      const downstreamState = await verifyBrokerState(
        brokerStateToken,
        oauthConfig,
        brokerConfig,
        keyPromise
      );
      const identity = await exchangeGoogleCode(
        code,
        callbackUrl,
        brokerConfig,
        googleJwksPromise,
        logger
      );

      enforceAllowedIdentity(oauthConfig, brokerConfig, identity);

      const authorizationCode = await signAuthorizationCode(
        {
          clientId: downstreamState.clientId,
          redirectUri: downstreamState.redirectUri,
          scope: downstreamState.scope,
          codeChallenge: downstreamState.codeChallenge,
          codeChallengeMethod: downstreamState.codeChallengeMethod,
          sub: identity.sub,
          email: identity.email,
        },
        oauthConfig,
        brokerConfig,
        keyPromise
      );

      const redirectUrl = new URL(downstreamState.redirectUri);
      redirectUrl.searchParams.set('code', authorizationCode);
      if (downstreamState.state) {
        redirectUrl.searchParams.set('state', downstreamState.state);
      }

      res.redirect(redirectUrl.toString());
    },

    async handleToken(req: Request, res: Response) {
      const grantType = readBodyParam(req, 'grant_type');

      const clientAuthentication = readTokenClientAuthentication(req);
      const client = await requireRegisteredClient(
        brokerConfig,
        oauthClientsRepository,
        clientAuthentication.clientId
      );

      if (!isClientAuthenticationValid(client, clientAuthentication)) {
        res.status(401).json({ error: 'invalid_client' });
        return;
      }

      if (grantType === 'refresh_token') {
        if (!client.grantTypes.includes('refresh_token')) {
          res.status(400).json({ error: 'unauthorized_client' });
          return;
        }

        const refreshToken = readBodyParam(req, 'refresh_token');
        const refreshTokenPayload = await verifyRefreshToken(refreshToken, oauthConfig, keyPromise);

        if (refreshTokenPayload.clientId !== client.clientId) {
          res.status(400).json({ error: 'invalid_grant' });
          return;
        }

        const accessToken = await signAccessToken(
          {
            clientId: refreshTokenPayload.clientId,
            redirectUri: '',
            scope: refreshTokenPayload.scope,
            codeChallenge: '',
            codeChallengeMethod: 'S256',
            sub: refreshTokenPayload.sub,
            email: refreshTokenPayload.email,
          },
          oauthConfig,
          brokerConfig,
          keyPromise
        );
        const nextRefreshToken = await signRefreshToken(
          refreshTokenPayload,
          oauthConfig,
          brokerConfig,
          keyPromise
        );

        res.status(200).json({
          access_token: accessToken,
          refresh_token: nextRefreshToken,
          token_type: 'Bearer',
          expires_in: 3600,
          scope: refreshTokenPayload.scope,
        });
        return;
      }

      if (grantType !== 'authorization_code') {
        throw new Error('Unsupported grant_type');
      }

      const code = readBodyParam(req, 'code');
      const redirectUri = readBodyParam(req, 'redirect_uri');
      const codeVerifier = readBodyParam(req, 'code_verifier');

      validateClientRequest(client, redirectUri);

      const authorizationCode = await verifyAuthorizationCode(code, oauthConfig, keyPromise);

      if (
        authorizationCode.clientId !== client.clientId ||
        authorizationCode.redirectUri !== redirectUri
      ) {
        res.status(400).json({ error: 'invalid_grant' });
        return;
      }

      const expectedChallenge = await createCodeChallenge(codeVerifier);
      if (expectedChallenge !== authorizationCode.codeChallenge) {
        res.status(400).json({ error: 'invalid_grant' });
        return;
      }

      const accessToken = await signAccessToken(
        authorizationCode,
        oauthConfig,
        brokerConfig,
        keyPromise
      );

      const refreshToken = client.grantTypes.includes('refresh_token')
        ? await signRefreshToken(
            {
              clientId: authorizationCode.clientId,
              scope: authorizationCode.scope,
              sub: authorizationCode.sub,
              email: authorizationCode.email,
            },
            oauthConfig,
            brokerConfig,
            keyPromise
          )
        : undefined;

      res.status(200).json({
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: 'Bearer',
        expires_in: 3600,
        scope: authorizationCode.scope,
      });
    },
  };
}

async function loadSigningKeys(brokerConfig: OAuthBrokerConfig) {
  const privateKey = createPrivateKey(brokerConfig.jwtPrivateKey);
  const publicKey = createPublicKey(privateKey);
  const publicJwk = await exportJWK(publicKey);

  publicJwk.use = 'sig';
  publicJwk.alg = 'RS256';
  publicJwk.kid = brokerConfig.jwtKeyId;

  const verificationKey = await importJWK(publicJwk, 'RS256');

  return {
    privateKey,
    verificationKey,
    publicJwk: publicJwk as JWK,
  };
}

async function createGoogleJwksResolver() {
  const discoveryResponse = await fetch(GOOGLE_DISCOVERY_URL);
  if (!discoveryResponse.ok) {
    throw new Error('Failed to fetch Google OIDC discovery document');
  }

  const discovery = await discoveryResponse.json();
  if (!isRecord(discovery) || typeof discovery.jwks_uri !== 'string') {
    throw new Error('Google OIDC discovery document does not include jwks_uri');
  }

  const { createRemoteJWKSet } = await import('jose');
  return createRemoteJWKSet(new URL(discovery.jwks_uri));
}

async function signBrokerState(
  state: BrokerState,
  oauthConfig: OAuthConfig,
  brokerConfig: OAuthBrokerConfig,
  keyPromise: ReturnType<typeof loadSigningKeys>
) {
  const keys = await keyPromise;

  return new SignJWT(state)
    .setProtectedHeader({ alg: 'RS256', kid: brokerConfig.jwtKeyId, typ: 'JWT' })
    .setIssuer(oauthConfig.issuer)
    .setAudience(oauthConfig.issuer)
    .setExpirationTime('10m')
    .setIssuedAt()
    .sign(keys.privateKey);
}

async function verifyBrokerState(
  token: string,
  oauthConfig: OAuthConfig,
  brokerConfig: OAuthBrokerConfig,
  keyPromise: ReturnType<typeof loadSigningKeys>
): Promise<BrokerState> {
  const keys = await keyPromise;
  const { payload } = await jwtVerify(token, keys.verificationKey, {
    issuer: oauthConfig.issuer,
    audience: oauthConfig.issuer,
  });

  if (!isRecord(payload)) {
    throw new Error('Invalid broker state payload');
  }

  const codeChallengeMethod = payload.codeChallengeMethod;
  if (codeChallengeMethod !== 'S256') {
    throw new Error('Unsupported PKCE challenge method in state');
  }

  return {
    clientId: requireString(payload.clientId, 'clientId'),
    redirectUri: requireString(payload.redirectUri, 'redirectUri'),
    state: optionalString(payload.state),
    scope: requireString(payload.scope, 'scope'),
    codeChallenge: requireString(payload.codeChallenge, 'codeChallenge'),
    codeChallengeMethod,
    nonce: requireString(payload.nonce, 'nonce'),
  };
}

async function signAuthorizationCode(
  payload: AuthorizationCodePayload,
  oauthConfig: OAuthConfig,
  brokerConfig: OAuthBrokerConfig,
  keyPromise: ReturnType<typeof loadSigningKeys>
) {
  const keys = await keyPromise;

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'RS256', kid: brokerConfig.jwtKeyId, typ: 'JWT' })
    .setIssuer(oauthConfig.issuer)
    .setAudience(oauthConfig.issuer)
    .setExpirationTime('5m')
    .setIssuedAt()
    .sign(keys.privateKey);
}

async function verifyAuthorizationCode(
  token: string,
  oauthConfig: OAuthConfig,
  keyPromise: ReturnType<typeof loadSigningKeys>
): Promise<AuthorizationCodePayload> {
  const keys = await keyPromise;
  const { payload } = await jwtVerify(token, keys.verificationKey, {
    issuer: oauthConfig.issuer,
    audience: oauthConfig.issuer,
  });

  if (!isRecord(payload)) {
    throw new Error('Invalid authorization code payload');
  }

  return {
    clientId: requireString(payload.clientId, 'clientId'),
    redirectUri: requireString(payload.redirectUri, 'redirectUri'),
    scope: requireString(payload.scope, 'scope'),
    codeChallenge: requireString(payload.codeChallenge, 'codeChallenge'),
    codeChallengeMethod: 'S256',
    sub: requireString(payload.sub, 'sub'),
    email: optionalString(payload.email),
  };
}

async function signAccessToken(
  payload: AuthorizationCodePayload,
  oauthConfig: OAuthConfig,
  brokerConfig: OAuthBrokerConfig,
  keyPromise: ReturnType<typeof loadSigningKeys>
) {
  const keys = await keyPromise;

  const token = new SignJWT({
    scope: payload.scope,
    email: payload.email,
  })
    .setProtectedHeader({ alg: 'RS256', kid: brokerConfig.jwtKeyId, typ: 'JWT' })
    .setIssuer(oauthConfig.issuer)
    .setAudience(oauthConfig.audience)
    .setSubject(payload.sub)
    .setExpirationTime('1h')
    .setIssuedAt();

  return token.sign(keys.privateKey);
}

async function signRefreshToken(
  payload: RefreshTokenPayload,
  oauthConfig: OAuthConfig,
  brokerConfig: OAuthBrokerConfig,
  keyPromise: ReturnType<typeof loadSigningKeys>
) {
  const keys = await keyPromise;

  return new SignJWT({
    scope: payload.scope,
    email: payload.email,
    client_id: payload.clientId,
  })
    .setProtectedHeader({ alg: 'RS256', kid: brokerConfig.jwtKeyId, typ: 'JWT' })
    .setIssuer(oauthConfig.issuer)
    .setAudience(oauthConfig.issuer)
    .setSubject(payload.sub)
    .setExpirationTime('30d')
    .setIssuedAt()
    .sign(keys.privateKey);
}

async function verifyRefreshToken(
  token: string,
  oauthConfig: OAuthConfig,
  keyPromise: ReturnType<typeof loadSigningKeys>
): Promise<RefreshTokenPayload> {
  const keys = await keyPromise;
  const { payload } = await jwtVerify(token, keys.verificationKey, {
    issuer: oauthConfig.issuer,
    audience: oauthConfig.issuer,
  });

  if (!isRecord(payload)) {
    throw new Error('Invalid refresh token payload');
  }

  return {
    clientId: requireString(payload.client_id, 'client_id'),
    scope: requireString(payload.scope, 'scope'),
    sub: requireString(payload.sub, 'sub'),
    email: optionalString(payload.email),
  };
}

async function exchangeGoogleCode(
  code: string,
  redirectUri: string,
  brokerConfig: OAuthBrokerConfig,
  googleJwksPromise: Promise<ReturnType<typeof import('jose').createRemoteJWKSet>>,
  logger: Logger
): Promise<GoogleIdentity> {
  const tokenResponse = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: brokerConfig.googleClientId,
      client_secret: brokerConfig.googleClientSecret,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenResponse.ok) {
    const errorBody = await tokenResponse.text();
    logger.warn(
      {
        status: tokenResponse.status,
        responseBody: errorBody,
      },
      'Google code exchange failed'
    );
    throw new Error(`Google code exchange failed (${tokenResponse.status})`);
  }

  const tokenPayload = await tokenResponse.json();
  if (!isRecord(tokenPayload) || typeof tokenPayload.id_token !== 'string') {
    throw new Error('Google token response did not include id_token');
  }

  const googleJwks = await googleJwksPromise;
  const { payload } = await jwtVerify(tokenPayload.id_token, googleJwks, {
    issuer: GOOGLE_ISSUERS,
    audience: brokerConfig.googleClientId,
  });

  return {
    sub: requireString(payload.sub, 'sub'),
    email: optionalString(payload.email),
    emailVerified: payload.email_verified === true,
    hostedDomain: optionalString(payload.hd),
  };
}

function enforceAllowedIdentity(
  oauthConfig: OAuthConfig,
  brokerConfig: OAuthBrokerConfig,
  identity: GoogleIdentity
) {
  if (brokerConfig.googleHostedDomain && identity.hostedDomain !== brokerConfig.googleHostedDomain) {
    throw new Error('Google account hosted domain is not allowed');
  }

  if (oauthConfig.allowedEmail && identity.email !== oauthConfig.allowedEmail) {
    throw new Error('Google account email is not allowed');
  }

  if (oauthConfig.allowedSub && identity.sub !== oauthConfig.allowedSub) {
    throw new Error('Google account subject is not allowed');
  }

  if (identity.email && !identity.emailVerified) {
    throw new Error('Google account email is not verified');
  }
}

async function requireRegisteredClient(
  brokerConfig: OAuthBrokerConfig,
  oauthClientsRepository: OAuthClientsRepository,
  clientId: string
): Promise<OAuthClientRegistration> {
  const bootstrapClient = brokerConfig.bootstrapClients.find(client => client.clientId === clientId);
  if (bootstrapClient) {
    return {
      clientId: bootstrapClient.clientId,
      clientSecretHash: bootstrapClient.clientSecret
        ? hashClientSecret(bootstrapClient.clientSecret)
        : undefined,
      redirectUris: bootstrapClient.redirectUris,
      grantTypes: ['authorization_code'],
      responseTypes: ['code'],
      tokenEndpointAuthMethod: bootstrapClient.tokenEndpointAuthMethod,
      clientIdIssuedAt: 0,
      clientSecretExpiresAt: bootstrapClient.clientSecret ? 0 : undefined,
      createdAt: 0,
    };
  }

  const client = await oauthClientsRepository.getByClientId(clientId);
  if (!client) {
    throw new Error('Unknown OAuth client_id');
  }

  return client;
}

function validateClientRequest(client: OAuthClientRegistration, redirectUri: string) {
  if (!client.redirectUris.includes(redirectUri)) {
    throw new Error('redirect_uri is not allowed');
  }
}

function readTokenClientAuthentication(req: Request): {
  clientId: string;
  clientSecret?: string;
  method: OAuthClientTokenEndpointAuthMethod;
} {
  const authorizationHeader = req.headers.authorization;
  if (typeof authorizationHeader === 'string' && authorizationHeader.startsWith('Basic ')) {
    const decoded = Buffer.from(authorizationHeader.slice('Basic '.length), 'base64').toString(
      'utf8'
    );
    const separatorIndex = decoded.indexOf(':');

    if (separatorIndex <= 0) {
      throw new Error('Invalid Basic client authentication');
    }

    return {
      clientId: decoded.slice(0, separatorIndex),
      clientSecret: decoded.slice(separatorIndex + 1),
      method: 'client_secret_basic',
    };
  }

  const clientId = readBodyParam(req, 'client_id');
  const clientSecret = readOptionalBodyString(req, 'client_secret');
  return {
    clientId,
    clientSecret,
    method: clientSecret ? 'client_secret_post' : 'none',
  };
}

function isClientAuthenticationValid(
  client: OAuthClientRegistration,
  authentication: {
    clientId: string;
    clientSecret?: string;
    method: OAuthClientTokenEndpointAuthMethod;
  }
): boolean {
  if (client.clientId !== authentication.clientId) {
    return false;
  }

  if (client.tokenEndpointAuthMethod !== authentication.method) {
    return false;
  }

  if (client.tokenEndpointAuthMethod === 'none') {
    return true;
  }

  if (!client.clientSecretHash || !authentication.clientSecret) {
    return false;
  }

  return safeEqual(client.clientSecretHash, hashClientSecret(authentication.clientSecret));
}

function readTokenEndpointAuthMethod(req: Request): OAuthClientTokenEndpointAuthMethod {
  const method = readOptionalBodyString(req, 'token_endpoint_auth_method') ?? 'client_secret_basic';
  if (
    method === 'none' ||
    method === 'client_secret_basic' ||
    method === 'client_secret_post'
  ) {
    return method;
  }

  throw new Error('Unsupported token_endpoint_auth_method');
}

function validateRegistrationGrantTypes(grantTypes: string[], responseTypes: string[]) {
  const supportedGrantTypes = new Set(['authorization_code', 'refresh_token']);
  const uniqueGrantTypes = new Set(grantTypes);

  if (!uniqueGrantTypes.has('authorization_code')) {
    throw new InvalidClientMetadataError(
      'authorization_code grant type is required'
    );
  }

  for (const grantType of uniqueGrantTypes) {
    if (!supportedGrantTypes.has(grantType)) {
      throw new InvalidClientMetadataError(
        'Only authorization_code and refresh_token grant types are supported'
      );
    }
  }

  if (responseTypes.length !== 1 || responseTypes[0] !== 'code') {
    throw new InvalidClientMetadataError('Only code response type is supported');
  }
}

function validateRefreshTokenSupport(
  grantTypes: string[],
  tokenEndpointAuthMethod: OAuthClientTokenEndpointAuthMethod
) {
  if (tokenEndpointAuthMethod === 'none' && !grantTypes.includes('authorization_code')) {
    throw new InvalidClientMetadataError(
      'public clients must support authorization_code when requesting tokens'
    );
  }
}

function readClientMetadata<T>(reader: () => T): T {
  try {
    return reader();
  } catch (error) {
    if (error instanceof InvalidClientMetadataError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new InvalidClientMetadataError(error.message);
    }

    throw error;
  }
}

function validateRedirectUris(redirectUris: string[], allowedRedirectSchemes: string[]) {
  for (const redirectUri of redirectUris) {
    validateRedirectUri(redirectUri, allowedRedirectSchemes);
  }
}

function validateRedirectUri(redirectUri: string, allowedRedirectSchemes: string[]) {
  const parsed = new URL(redirectUri);
  if (parsed.hash) {
    throw new Error('redirect_uri must not include a fragment');
  }

  if (parsed.protocol === 'https:') {
    return;
  }

  if (
    parsed.protocol === 'http:' &&
    (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')
  ) {
    return;
  }

  const redirectScheme = parsed.protocol.slice(0, -1).toLowerCase();
  if (allowedRedirectSchemes.includes(redirectScheme)) {
    return;
  }

  throw new Error(
    'redirect_uri must use https, localhost http, or an explicitly allowed application-specific scheme'
  );
}

function hashClientSecret(secret: string): string {
  return createHash('sha256').update(secret).digest('hex');
}

function safeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(left), Buffer.from(right));
}

async function createCodeChallenge(codeVerifier: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier));
  return Buffer.from(digest)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function readSingleQueryParam(req: Request, name: string): string {
  const value = req.query[name];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Missing ${name}`);
  }
  return value;
}

function readOptionalQueryParam(req: Request, name: string): string | undefined {
  const value = req.query[name];
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function readBodyParam(req: Request, name: string): string {
  const value = req.body?.[name];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Missing ${name}`);
  }
  return value;
}

function readOptionalBodyString(req: Request, name: string): string | undefined {
  const value = req.body?.[name];
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function readOptionalStringArrayBodyParam(req: Request, name: string): string[] | undefined {
  const value = req.body?.[name];
  if (!Array.isArray(value) || !value.every(item => typeof item === 'string')) {
    return undefined;
  }

  return value;
}

function readStringArrayBodyParam(req: Request, name: string): string[] {
  const value = readOptionalStringArrayBodyParam(req, name);
  if (!value || value.length === 0) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}

function requireString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Missing ${fieldName}`);
  }
  return value;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function stripTrailingSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}