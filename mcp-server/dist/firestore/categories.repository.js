export class CategoriesRepository {
    firestore;
    ownerUid;
    constructor(firestore, ownerUid) {
        this.firestore = firestore;
        this.ownerUid = ownerUid;
    }
    async list() {
        const snapshot = await this.firestore
            .collection('users')
            .doc(this.ownerUid)
            .collection('category-overrides')
            .get();
        return snapshot.docs.flatMap(document => {
            const override = mapCategoryOverride(document.id, document.data());
            return override ? [override] : [];
        });
    }
}
function mapCategoryOverride(id, rawValue) {
    const value = rawValue ?? {};
    if (value.source !== 'default-override' && value.source !== 'custom') {
        return null;
    }
    return {
        id,
        source: value.source,
        ...(readOptionalString(value.baseCategoryId)
            ? { baseCategoryId: readOptionalString(value.baseCategoryId) }
            : {}),
        ...(readOptionalString(value.name)
            ? { name: readOptionalString(value.name) }
            : {}),
        ...(typeof value.icon === 'string' ? { icon: value.icon.trim() } : {}),
        ...(readOptionalString(value.color)
            ? { color: readOptionalString(value.color) }
            : {}),
        ...(typeof value.includeInBalance === 'boolean'
            ? { includeInBalance: value.includeInBalance }
            : {}),
        ...(typeof value.isDeleted === 'boolean'
            ? { isDeleted: value.isDeleted }
            : {}),
        ...(readOptionalString(value.normalizedName)
            ? { normalizedName: readOptionalString(value.normalizedName) }
            : {}),
        createdAt: readTimestamp(value.createdAt),
        updatedAt: readTimestamp(value.updatedAt),
    };
}
function readOptionalString(value) {
    if (typeof value !== 'string') {
        return undefined;
    }
    const normalized = value.trim();
    return normalized || undefined;
}
function readTimestamp(value) {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return Math.trunc(value);
    }
    if (typeof value === 'object' &&
        value !== null &&
        'toMillis' in value &&
        typeof value.toMillis === 'function') {
        const timestamp = value.toMillis();
        return Number.isFinite(timestamp) ? Math.trunc(timestamp) : 0;
    }
    return 0;
}
