import { FieldValue } from 'firebase-admin/firestore';
import { canonicalizeTag, } from '../domain/models.js';
export class TagsRepository {
    firestore;
    ownerUid;
    constructor(firestore, ownerUid) {
        this.firestore = firestore;
        this.ownerUid = ownerUid;
    }
    async list() {
        const snapshot = await this.baseQuery().orderBy('normalizedName', 'asc').get();
        return snapshot.docs.map(document => this.mapTag(document.id, document.data()));
    }
    async create(input) {
        const reference = this.firestore.collection('tags').doc();
        const tag = canonicalizeTag({
            id: reference.id,
            uid: this.ownerUid,
            ...input,
        });
        await reference.set(tag);
        return tag;
    }
    async update(input) {
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
    async delete(id) {
        const existing = await this.getById(id);
        if (!existing) {
            throw new Error(`Tag ${id} not found`);
        }
        const expensesSnapshot = await this.firestore
            .collection('expenses')
            .where('uid', '==', this.ownerUid)
            .where('tagIds', 'array-contains', id)
            .get();
        await Promise.all(expensesSnapshot.docs.map(document => {
            const value = document.data() ?? {};
            const tagIds = Array.isArray(value.tagIds)
                ? value.tagIds.filter((tagId) => tagId !== id)
                : [];
            return document.ref.set(tagIds.length > 0
                ? { ...value, tagIds }
                : { ...value, tagIds: FieldValue.delete() }, { merge: true });
        }));
        await this.firestore.collection('tags').doc(existing.id).delete();
        return existing.id;
    }
    async getById(id) {
        const document = await this.firestore.collection('tags').doc(id).get();
        if (!document.exists) {
            return null;
        }
        const tag = this.mapTag(document.id, document.data());
        return tag.uid === this.ownerUid ? tag : null;
    }
    baseQuery() {
        return this.firestore.collection('tags').where('uid', '==', this.ownerUid);
    }
    mapTag(id, rawValue) {
        const value = rawValue ?? {};
        return canonicalizeTag({
            id,
            uid: String(value.uid ?? this.ownerUid),
            name: String(value.name ?? ''),
            star: value.star === true,
        });
    }
}
