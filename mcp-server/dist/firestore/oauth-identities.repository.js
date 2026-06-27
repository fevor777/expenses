import { createHash } from 'node:crypto';
export class OAuthIdentitiesRepository {
    firestore;
    constructor(firestore) {
        this.firestore = firestore;
    }
    async getByIssuerAndSub(issuer, sub) {
        const document = await this.collection().doc(createLinkId(issuer, sub)).get();
        if (!document.exists) {
            return null;
        }
        const value = document.data() ?? {};
        const firebaseUid = typeof value.firebaseUid === 'string' ? value.firebaseUid : undefined;
        if (!firebaseUid) {
            return null;
        }
        return {
            firebaseUid,
            issuer,
            sub,
        };
    }
    collection() {
        return this.firestore.collection('oauthIdentities');
    }
}
function createLinkId(issuer, sub) {
    return createHash('sha256').update(`${issuer}|${sub}`).digest('hex');
}
