export class Tag {
  id?: string;
  uid?: string;
  name: string;
  normalizedName: string;
  star?: boolean;
}

export function normalizeTagName(name?: string | null): string {
  return (name || '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function canonicalizeTag(tag: Partial<Tag>): Tag {
  const normalizedName = normalizeTagName(tag.name || tag.normalizedName);
  return {
    id: tag.id,
    uid: tag.uid,
    name: (tag.name || '').replace(/\s+/g, ' ').trim(),
    normalizedName,
    star: tag.star === true,
  };
}

export function normalizeTagIds(tagIds?: readonly string[] | null): string[] | undefined {
  if (!Array.isArray(tagIds) || tagIds.length === 0) {
    return undefined;
  }

  const normalized = Array.from(
    new Set(
      tagIds
        .filter((tagId): tagId is string => typeof tagId === 'string')
        .map(tagId => tagId.trim())
        .filter(Boolean)
    )
  ).sort((left, right) => left.localeCompare(right));

  return normalized.length > 0 ? normalized : undefined;
}

export function canonicalizeTagIds<T extends { tagIds?: string[] }>(value: T): T {
  const tagIds = normalizeTagIds(value.tagIds);
  if (!tagIds) {
    const { tagIds: _tagIds, ...rest } = value;
    return rest as T;
  }

  return {
    ...value,
    tagIds,
  };
}