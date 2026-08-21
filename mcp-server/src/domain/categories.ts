import {
  CATEGORY_DEFINITIONS,
  type CategoryOverrideDocument,
  type ResolvedCategory,
} from './models.js';

export type CategoryOverridesReader = {
  list(): Promise<CategoryOverrideDocument[]>;
};

export class ResolvedCategoriesProvider {
  constructor(private readonly overridesReader: CategoryOverridesReader) {}

  async list(): Promise<ResolvedCategory[]> {
    return resolveCategories(await this.overridesReader.list());
  }

  async getById(id: string): Promise<ResolvedCategory | undefined> {
    const normalizedId = id.trim();
    if (!normalizedId) {
      return undefined;
    }

    return (await this.list()).find(category => category.id === normalizedId);
  }

  async requireById(id: string): Promise<ResolvedCategory> {
    const category = await this.getById(id);
    if (!category) {
      throw new Error(`Unknown or inactive category id: ${id}`);
    }

    return category;
  }
}

export function resolveCategories(
  overrides: CategoryOverrideDocument[]
): ResolvedCategory[] {
  const defaultIds = new Set<string>(
    CATEGORY_DEFINITIONS.map(category => category.id)
  );
  const defaultOverrides = new Map(
    overrides
      .filter(override => override.source === 'default-override')
      .map(override => [override.id, override] as const)
  );

  const resolved: Array<{
    category: ResolvedCategory;
    sortName: string;
  }> = [];

  for (const category of CATEGORY_DEFINITIONS) {
    const override = defaultOverrides.get(category.id);
    if (override?.isDeleted === true) {
      continue;
    }

    const name = normalizeCategoryDisplayName(override?.name) || category.name;
    const resolvedCategory: ResolvedCategory = {
      id: category.id,
      name,
      icon: override?.icon ?? category.icon,
      color: override?.color ?? category.color,
      includeInBalance: override?.includeInBalance ?? category.includeInBalance,
      source: override ? 'default-override' : 'default',
    };
    resolved.push({
      category: resolvedCategory,
      sortName: normalizeCategoryName(name),
    });
  }

  for (const override of overrides) {
    if (
      override.source !== 'custom' ||
      override.isDeleted === true ||
      defaultIds.has(override.id) ||
      typeof override.name !== 'string' ||
      typeof override.icon !== 'string' ||
      typeof override.color !== 'string' ||
      typeof override.includeInBalance !== 'boolean'
    ) {
      continue;
    }

    const name = normalizeCategoryDisplayName(override.name);
    if (!name) {
      continue;
    }

    const category: ResolvedCategory = {
      id: override.id,
      name,
      icon: override.icon,
      color: override.color,
      includeInBalance: override.includeInBalance,
      source: 'custom',
    };
    resolved.push({
      category,
      sortName: normalizeCategoryName(name),
    });
  }

  return resolved
    .sort(
      (left, right) =>
        left.sortName.localeCompare(right.sortName) ||
        left.category.id.localeCompare(right.category.id)
    )
    .map(item => item.category);
}

function normalizeCategoryName(name: string): string {
  return normalizeCategoryDisplayName(name).toLocaleLowerCase();
}

function normalizeCategoryDisplayName(name?: string): string {
  return (name ?? '').replace(/\s+/gu, ' ').trim();
}
