import type { Firestore } from 'firebase-admin/firestore';

export type OAuthClientTokenEndpointAuthMethod =
  | 'none'
  | 'client_secret_basic'
  | 'client_secret_post';

export type OAuthClientRegistration = {
  clientId: string;
  clientSecretHash?: string;
  redirectUris: string[];
  grantTypes: string[];
  responseTypes: string[];
  tokenEndpointAuthMethod: OAuthClientTokenEndpointAuthMethod;
  clientName?: string;
  clientUri?: string;
  logoUri?: string;
  scope?: string;
  contacts?: string[];
  clientIdIssuedAt: number;
  clientSecretExpiresAt?: number;
  createdAt: number;
};

export class OAuthClientsRepository {
  constructor(private readonly firestore: Firestore) {}

  async getByClientId(clientId: string): Promise<OAuthClientRegistration | null> {
    const document = await this.collection().doc(clientId).get();
    if (!document.exists) {
      return null;
    }

    return this.mapDocument(document.id, document.data());
  }

  async create(registration: OAuthClientRegistration): Promise<OAuthClientRegistration> {
    await this.collection().doc(registration.clientId).set(withoutUndefinedFields(registration));
    return registration;
  }

  private collection() {
    return this.firestore.collection('oauthClients');
  }

  private mapDocument(
    id: string,
    rawValue: FirebaseFirestore.DocumentData | undefined
  ): OAuthClientRegistration {
    const value = rawValue ?? {};
    return {
      clientId: id,
      clientSecretHash:
        typeof value.clientSecretHash === 'string' ? value.clientSecretHash : undefined,
      redirectUris: Array.isArray(value.redirectUris)
        ? value.redirectUris.filter((item: unknown): item is string => typeof item === 'string')
        : [],
      grantTypes: Array.isArray(value.grantTypes)
        ? value.grantTypes.filter((item: unknown): item is string => typeof item === 'string')
        : ['authorization_code'],
      responseTypes: Array.isArray(value.responseTypes)
        ? value.responseTypes.filter((item: unknown): item is string => typeof item === 'string')
        : ['code'],
      tokenEndpointAuthMethod:
        value.tokenEndpointAuthMethod === 'none' ||
        value.tokenEndpointAuthMethod === 'client_secret_basic' ||
        value.tokenEndpointAuthMethod === 'client_secret_post'
          ? value.tokenEndpointAuthMethod
          : 'client_secret_basic',
      clientName: typeof value.clientName === 'string' ? value.clientName : undefined,
      clientUri: typeof value.clientUri === 'string' ? value.clientUri : undefined,
      logoUri: typeof value.logoUri === 'string' ? value.logoUri : undefined,
      scope: typeof value.scope === 'string' ? value.scope : undefined,
      contacts: Array.isArray(value.contacts)
        ? value.contacts.filter((item: unknown): item is string => typeof item === 'string')
        : undefined,
      clientIdIssuedAt:
        typeof value.clientIdIssuedAt === 'number' ? value.clientIdIssuedAt : 0,
      clientSecretExpiresAt:
        typeof value.clientSecretExpiresAt === 'number' ? value.clientSecretExpiresAt : undefined,
      createdAt: typeof value.createdAt === 'number' ? value.createdAt : 0,
    };
  }
}

function withoutUndefinedFields<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== undefined)
  );
}