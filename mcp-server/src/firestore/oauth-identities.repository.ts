import { createHash } from 'node:crypto';
import type { Firestore } from 'firebase-admin/firestore';

export type OAuthIdentityLink = {
  firebaseUid: string;
  issuer: string;
  sub: string;
};

export class OAuthIdentitiesRepository {
  constructor(private readonly firestore: Firestore) {}

  async getByIssuerAndSub(issuer: string, sub: string): Promise<OAuthIdentityLink | null> {
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

  private collection() {
    return this.firestore.collection('oauthIdentities');
  }
}

function createLinkId(issuer: string, sub: string): string {
  return createHash('sha256').update(`${issuer}|${sub}`).digest('hex');
}