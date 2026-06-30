import type { Firestore, Query } from 'firebase-admin/firestore';
import {
  canonicalizeTag,
  type CreateTagInput,
  type TagDocument,
  type UpdateTagInput,
} from '../domain/models.js';

export class TagsRepository {
  constructor(
    private readonly firestore: Firestore,
    private readonly ownerUid: string
  ) {}

  async list(): Promise<TagDocument[]> {
    const snapshot = await this.baseQuery().orderBy('normalizedName', 'asc').get();
    return snapshot.docs.map(document => this.mapTag(document.id, document.data()));
  }

  async create(input: CreateTagInput): Promise<TagDocument> {
    const reference = this.firestore.collection('tags').doc();
    const tag = canonicalizeTag({
      id: reference.id,
      uid: this.ownerUid,
      ...input,
    });

    await reference.set(tag);
    return tag;
  }

  async update(input: UpdateTagInput): Promise<TagDocument> {
    const existing = await this.getById(input.id);
    if (!existing) {
      throw new Error(`Tag ${input.id} not found`);
    }

    const updatedTag = canonicalizeTag({
      ...existing,
      ...input,
      id: existing.id,
      uid: this.ownerUid,
    });

    await this.firestore.collection('tags').doc(existing.id).set(updatedTag);
    return updatedTag;
  }

  async delete(id: string): Promise<string> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`Tag ${id} not found`);
    }

    const expensesSnapshot = await this.firestore
      .collection('expenses')
      .where('uid', '==', this.ownerUid)
      .where('tagIds', 'array-contains', id)
      .get();

    await Promise.all(
      expensesSnapshot.docs.map(document => {
        const value = document.data() ?? {};
        const tagIds = Array.isArray(value.tagIds)
          ? value.tagIds.filter((tagId: unknown) => tagId !== id)
          : [];
        return document.ref.set({ ...value, tagIds }, { merge: true });
      })
    );

    await this.firestore.collection('tags').doc(existing.id).delete();
    return existing.id;
  }

  async getById(id: string): Promise<TagDocument | null> {
    const document = await this.firestore.collection('tags').doc(id).get();
    if (!document.exists) {
      return null;
    }

    const tag = this.mapTag(document.id, document.data());
    return tag.uid === this.ownerUid ? tag : null;
  }

  private baseQuery(): Query {
    return this.firestore.collection('tags').where('uid', '==', this.ownerUid);
  }

  private mapTag(
    id: string,
    rawValue: FirebaseFirestore.DocumentData | undefined
  ): TagDocument {
    const value = rawValue ?? {};
    return canonicalizeTag({
      id,
      uid: String(value.uid ?? this.ownerUid),
      name: String(value.name ?? ''),
      star: value.star === true,
    });
  }
}