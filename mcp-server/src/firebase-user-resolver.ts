import type { Request } from 'express';
import { getAuth } from 'firebase-admin/auth';
import type { Logger } from 'pino';
import type { AppConfig } from './config.js';
import { getFirestoreClient } from './firestore/client.js';
import { OAuthIdentitiesRepository } from './firestore/oauth-identities.repository.js';

export class RequestUserResolutionError extends Error {
  readonly statusCode = 403;
}

export async function resolveRequestOwnerUid(
  req: Request,
  config: AppConfig,
  logger: Logger
): Promise<string> {
  const authInfo = req.authInfo;

  if (!authInfo) {
    throw new RequestUserResolutionError('Request is missing authenticated user context');
  }

  if (authInfo.kind === 'bearer') {
    if (!config.ownerUid) {
      throw new RequestUserResolutionError(
        'Bearer authentication requires EXPENSES_OWNER_UID'
      );
    }

    return config.ownerUid;
  }

  const auth = getAuth();
  const oauthIdentitiesRepository = new OAuthIdentitiesRepository(getFirestoreClient(config));

  if (config.oauthBroker?.mode === 'google' && authInfo.sub) {
    try {
      const user = await auth.getUserByProviderUid('google.com', authInfo.sub);
      return user.uid;
    } catch (error) {
      logger.debug(
        {
          error: error instanceof Error ? error.message : String(error),
          provider: 'google.com',
          sub: authInfo.sub,
        },
        'Firebase user lookup by Google provider uid failed'
      );
    }
  }

  if (authInfo.issuer && authInfo.sub) {
    const identityLink = await oauthIdentitiesRepository.getByIssuerAndSub(
      authInfo.issuer,
      authInfo.sub
    );
    if (identityLink) {
      return identityLink.firebaseUid;
    }
  }

  if (config.resolveFirebaseUserByEmail && authInfo.email && authInfo.emailVerified) {
    try {
      const user = await auth.getUserByEmail(authInfo.email);
      return user.uid;
    } catch (error) {
      logger.debug(
        {
          email: authInfo.email,
          error: error instanceof Error ? error.message : String(error),
        },
        'Firebase user lookup by email failed'
      );
    }
  }

  throw new RequestUserResolutionError(
    `Authenticated OAuth user ${authInfo.principal} is not linked to a Firebase user`
  );
}