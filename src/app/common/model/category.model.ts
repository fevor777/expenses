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
  isDeleted?: boolean;
  createdAt: number;
  updatedAt: number;
  normalizedName?: string;
};

export type ResolvedCategory = Category & {
  source: CategorySource;
  hidden?: boolean;
  normalizedName?: string;
};

export type CategoryInput = Omit<Category, 'id'>;
export type CategoryPatch = Partial<CategoryInput>;

export type CategoryValidationCode =
  | 'required'
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

export function normalizeCategoryName(name?: string | null): string {
  return normalizeCategoryDisplayName(name).toLowerCase();
}

export function normalizeCategoryDisplayName(name?: string | null): string {
  return (name || '').replace(/\s+/g, ' ').trim();
}

export function mergeCategories(
  defaults: readonly Category[],
  overrides: readonly CategoryOverrideDocument[]
): ResolvedCategory[] {
  const overridesById = new Map(
    overrides
      .filter(override => !!override?.id)
      .map(override => [override.id, override] as const)
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
    };
  });

  const defaultIds = new Set(defaults.map(category => category.id));
  overrides.forEach(override => {
    if (
      override.source !== 'custom' ||
      defaultIds.has(override.id) ||
      typeof override.name !== 'string' ||
      typeof override.icon !== 'string' ||
      typeof override.color !== 'string' ||
      typeof override.includeInBalance !== 'boolean'
    ) {
      return;
    }

    const name = normalizeCategoryDisplayName(override.name);
    if (!name) {
      return;
    }

    resolved.push({
      id: override.id,
      name,
      icon: override.icon,
      color: override.color,
      includeInBalance: override.includeInBalance,
      source: 'custom',
      hidden: override.isDeleted === true,
      normalizedName: normalizeCategoryName(name),
    });
  });

  return resolved.sort((left, right) =>
    (left.normalizedName || normalizeCategoryName(left.name)).localeCompare(
      right.normalizedName || normalizeCategoryName(right.name)
    )
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
    name,
    icon: input.icon,
    color: input.color.trim(),
    includeInBalance: input.includeInBalance,
  };
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
