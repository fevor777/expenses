export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  includeInBalance: boolean;
};

export type CategorySource = 'default' | 'default-override' | 'custom';

export type CategoryOverrideDocument = {
  id: string;
  source: Exclude<CategorySource, 'default'>;
  baseCategoryId?: string;
  name?: string;
  icon?: string;
  color?: string;
  includeInBalance?: boolean;
  sortOrder?: number;
  isDeleted?: boolean;
  createdAt: number;
  updatedAt: number;
  normalizedName?: string;
};

export type ResolvedCategory = Category & {
  source: CategorySource;
  hidden?: boolean;
  normalizedName?: string;
  sortOrder: number;
};

export type CategoryInput = Category;
export type CategoryPatch = Partial<CategoryInput>;

export type CategoryValidationCode =
  | 'required'
  | 'invalid-id'
  | 'duplicate-id'
  | 'invalid-name'
  | 'duplicate-name'
  | 'invalid-icon'
  | 'invalid-color'
  | 'invalid-include-in-balance'
  | 'not-found'
  | 'invalid-category-source';

export class CategoryValidationError extends Error {
  constructor(
    readonly code: CategoryValidationCode,
    readonly field?: keyof CategoryInput
  ) {
    super(categoryValidationMessage(code));
    this.name = 'CategoryValidationError';
  }
}

export const SUPPORTED_CATEGORY_ICONS: readonly string[] = [
  'fas fa-newspaper',
  'fas fa-film',
  'fas fa-smoking',
  'fas fa-plane',
  'fas fa-home',
  'fas fa-wine-bottle',
  'fa-solid fa-bell-concierge',
  'fas fa-bus',
  'fas fa-water',
  'fas fa-prescription-bottle-alt',
  'fas fa-cut',
  'fas fa-tablet-alt',
  'fas fa-tshirt',
  'fas fa-random',
  'fas fa-dumbbell',
  'fas fa-building',
  'fas fa-basket-shopping',
  'fas fa-car',
  'fas fa-gift',
  'fas fa-graduation-cap',
  'fas fa-paw',
  'fas fa-heart',
];

const CUSTOM_CATEGORY_ID_PATTERN = /^custom_[a-z0-9]+(?:[a-z0-9_-]*[a-z0-9])?$/;

export function normalizeCategoryName(name?: string | null): string {
  return normalizeCategoryDisplayName(name).toLowerCase();
}

export function normalizeCategoryDisplayName(name?: string | null): string {
  return (name || '').replace(/\s+/g, ' ').trim();
}

export function normalizeCustomCategoryId(id?: string | null): string {
  const normalized = (id || '')
    .trim()
    .toLowerCase()
    .replace(/^custom[_-]?/u, '')
    .replace(/[^a-z0-9_-]+/gu, '-')
    .replace(/[-_]{2,}/gu, '-')
    .replace(/^[-_]+|[-_]+$/gu, '');

  return normalized ? `custom_${normalized}` : '';
}

export function mergeCategories(
  defaults: readonly Category[],
  overrides: readonly CategoryOverrideDocument[]
): ResolvedCategory[] {
  const explicitSortOrders = overrides
    .map(override => normalizeSortOrder(override.sortOrder))
    .filter((value): value is number => typeof value === 'number');
  const implicitSortOrderStart = explicitSortOrders.length
    ? Math.max(...explicitSortOrders) + 1
    : 0;
  const defaultIndexById = new Map(
    defaults.map((category, index) => [category.id, index] as const)
  );
  const overridesById = new Map(
    overrides
      .filter(override => !!override?.id)
      .map(override => [override.id, override] as const)
  );
  const customOverrides = overrides
    .filter(override => {
      if (
        override.source !== 'custom' ||
        defaultIndexById.has(override.id) ||
        typeof override.name !== 'string' ||
        typeof override.icon !== 'string' ||
        typeof override.color !== 'string' ||
        typeof override.includeInBalance !== 'boolean'
      ) {
        return false;
      }

      return !!normalizeCategoryDisplayName(override.name);
    })
    .sort((left, right) => {
      const leftCreatedAt = normalizeTimestamp(left.createdAt);
      const rightCreatedAt = normalizeTimestamp(right.createdAt);
      if (leftCreatedAt !== rightCreatedAt) {
        return leftCreatedAt - rightCreatedAt;
      }

      const leftName =
        left.normalizedName || normalizeCategoryName(left.name || '');
      const rightName =
        right.normalizedName || normalizeCategoryName(right.name || '');
      return (
        leftName.localeCompare(rightName) || left.id.localeCompare(right.id)
      );
    });
  const customFallbackOrderById = new Map(
    customOverrides.map(
      (override, index) => [override.id, defaults.length + index] as const
    )
  );
  const resolved: ResolvedCategory[] = defaults.map(category => {
    const override = overridesById.get(category.id);
    const isDefaultOverride = override?.source === 'default-override';
    const name =
      isDefaultOverride && typeof override.name === 'string'
        ? normalizeCategoryDisplayName(override.name) || category.name
        : category.name;

    return {
      ...category,
      name,
      icon:
        isDefaultOverride && typeof override.icon === 'string'
          ? override.icon
          : category.icon,
      color:
        isDefaultOverride && typeof override.color === 'string'
          ? override.color
          : category.color,
      includeInBalance:
        isDefaultOverride && typeof override.includeInBalance === 'boolean'
          ? override.includeInBalance
          : category.includeInBalance,
      source: isDefaultOverride ? 'default-override' : 'default',
      hidden: isDefaultOverride && override.isDeleted === true,
      normalizedName: normalizeCategoryName(name),
      sortOrder:
        normalizeSortOrder(override?.sortOrder) ??
        implicitSortOrderStart + (defaultIndexById.get(category.id) ?? 0),
    };
  });

  customOverrides.forEach(override => {
    const name = normalizeCategoryDisplayName(override.name);
    resolved.push({
      id: override.id,
      name,
      icon: override.icon,
      color: override.color,
      includeInBalance: override.includeInBalance,
      source: 'custom',
      hidden: override.isDeleted === true,
      normalizedName: normalizeCategoryName(name),
      sortOrder:
        normalizeSortOrder(override.sortOrder) ??
        implicitSortOrderStart +
          (customFallbackOrderById.get(override.id) ?? defaults.length),
    });
  });

  return resolved.sort(
    (left, right) =>
      left.sortOrder - right.sortOrder ||
      (left.normalizedName || normalizeCategoryName(left.name)).localeCompare(
        right.normalizedName || normalizeCategoryName(right.name)
      ) ||
      left.id.localeCompare(right.id)
  );
}

export function validateCategoryInput(
  input: CategoryInput,
  activeCategories: readonly ResolvedCategory[],
  excludeId?: string
): CategoryInput {
  if (!input || typeof input !== 'object') {
    throw new CategoryValidationError('required');
  }

  if (typeof input.id !== 'string' || !input.id.trim()) {
    throw new CategoryValidationError('required', 'id');
  }

  const name = normalizeCategoryDisplayName(input.name);
  const normalizedName = normalizeCategoryName(name);
  if (!normalizedName) {
    throw new CategoryValidationError('required', 'name');
  }
  if (name.length > 80) {
    throw new CategoryValidationError('invalid-name', 'name');
  }
  if (
    activeCategories.some(
      category =>
        !category.hidden &&
        category.id !== excludeId &&
        (category.normalizedName || normalizeCategoryName(category.name)) ===
          normalizedName
    )
  ) {
    throw new CategoryValidationError('duplicate-name', 'name');
  }
  if (
    typeof input.icon !== 'string' ||
    !SUPPORTED_CATEGORY_ICONS.includes(input.icon)
  ) {
    throw new CategoryValidationError('invalid-icon', 'icon');
  }
  if (!isValidCategoryColor(input.color)) {
    throw new CategoryValidationError('invalid-color', 'color');
  }
  if (typeof input.includeInBalance !== 'boolean') {
    throw new CategoryValidationError(
      'invalid-include-in-balance',
      'includeInBalance'
    );
  }

  return {
    id: input.id.trim(),
    name,
    icon: input.icon,
    color: input.color.trim(),
    includeInBalance: input.includeInBalance,
  };
}

export function validateCustomCategoryId(
  id: string,
  categories: readonly ResolvedCategory[],
  excludeId?: string
): string {
  const normalizedId = normalizeCustomCategoryId(id);
  if (!normalizedId || normalizedId.length > 80) {
    throw new CategoryValidationError('invalid-id', 'id');
  }

  if (!CUSTOM_CATEGORY_ID_PATTERN.test(normalizedId)) {
    throw new CategoryValidationError('invalid-id', 'id');
  }

  if (
    categories.some(
      category => category.id !== excludeId && category.id === normalizedId
    )
  ) {
    throw new CategoryValidationError('duplicate-id', 'id');
  }

  return normalizedId;
}

export function isValidCategoryColor(color?: string | null): boolean {
  if (typeof color !== 'string' || !color.trim() || color.length > 64) {
    return false;
  }

  const value = color.trim();
  if (/^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.test(value)) {
    return true;
  }

  return typeof CSS !== 'undefined' && CSS.supports('color', value);
}

function categoryValidationMessage(code: CategoryValidationCode): string {
  const messages: Record<CategoryValidationCode, string> = {
    required: 'Category value is required.',
    'invalid-id': 'Category id must use latin letters, numbers, "-" or "_".',
    'duplicate-id': 'A category with this id already exists.',
    'invalid-name': 'Category name is invalid.',
    'duplicate-name': 'An active category with this name already exists.',
    'invalid-icon': 'Category icon is not supported.',
    'invalid-color': 'Category color is invalid.',
    'invalid-include-in-balance': 'includeInBalance must be a boolean.',
    'not-found': 'Category was not found.',
    'invalid-category-source':
      'This action is not valid for the category source.',
  };
  return messages[code];
}

function normalizeSortOrder(value?: number | null): number | undefined {
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : undefined;
}

function normalizeTimestamp(value?: number | null): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : Number.MAX_SAFE_INTEGER;
}
