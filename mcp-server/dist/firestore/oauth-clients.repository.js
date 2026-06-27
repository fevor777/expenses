export class OAuthClientsRepository {
    firestore;
    constructor(firestore) {
        this.firestore = firestore;
    }
    async getByClientId(clientId) {
        const document = await this.collection().doc(clientId).get();
        if (!document.exists) {
            return null;
        }
        return this.mapDocument(document.id, document.data());
    }
    async create(registration) {
        await this.collection().doc(registration.clientId).set(withoutUndefinedFields(registration));
        return registration;
    }
    collection() {
        return this.firestore.collection('oauthClients');
    }
    mapDocument(id, rawValue) {
        const value = rawValue ?? {};
        return {
            clientId: id,
            clientSecretHash: typeof value.clientSecretHash === 'string' ? value.clientSecretHash : undefined,
            redirectUris: Array.isArray(value.redirectUris)
                ? value.redirectUris.filter((item) => typeof item === 'string')
                : [],
            grantTypes: Array.isArray(value.grantTypes)
                ? value.grantTypes.filter((item) => typeof item === 'string')
                : ['authorization_code'],
            responseTypes: Array.isArray(value.responseTypes)
                ? value.responseTypes.filter((item) => typeof item === 'string')
                : ['code'],
            tokenEndpointAuthMethod: value.tokenEndpointAuthMethod === 'none' ||
                value.tokenEndpointAuthMethod === 'client_secret_basic' ||
                value.tokenEndpointAuthMethod === 'client_secret_post'
                ? value.tokenEndpointAuthMethod
                : 'client_secret_basic',
            clientName: typeof value.clientName === 'string' ? value.clientName : undefined,
            clientUri: typeof value.clientUri === 'string' ? value.clientUri : undefined,
            logoUri: typeof value.logoUri === 'string' ? value.logoUri : undefined,
            scope: typeof value.scope === 'string' ? value.scope : undefined,
            contacts: Array.isArray(value.contacts)
                ? value.contacts.filter((item) => typeof item === 'string')
                : undefined,
            clientIdIssuedAt: typeof value.clientIdIssuedAt === 'number' ? value.clientIdIssuedAt : 0,
            clientSecretExpiresAt: typeof value.clientSecretExpiresAt === 'number' ? value.clientSecretExpiresAt : undefined,
            createdAt: typeof value.createdAt === 'number' ? value.createdAt : 0,
        };
    }
}
function withoutUndefinedFields(value) {
    return Object.fromEntries(Object.entries(value).filter(([, entryValue]) => entryValue !== undefined));
}
