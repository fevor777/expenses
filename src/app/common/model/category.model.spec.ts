import {
  Category,
  CategoryOverrideDocument,
  CategoryValidationError,
  mergeCategories,
  ResolvedCategory,
  validateCategoryInput,
} from './category.model';

describe('category model', () => {
  const defaults: Category[] = [
    {
      id: 'meal',
      name: 'Питание',
      icon: 'fa-solid fa-bell-concierge',
      color: '#474747',
      includeInBalance: true,
    },
    {
      id: 'home',
      name: 'Для дома',
      icon: 'fas fa-home',
      color: '#9C27B0',
      includeInBalance: true,
    },
  ];

  it('merges default overrides and keeps hidden categories resolvable', () => {
    const overrides: CategoryOverrideDocument[] = [
      {
        id: 'meal',
        source: 'default-override',
        baseCategoryId: 'meal',
        name: 'Продукты',
        isDeleted: true,
        createdAt: 1,
        updatedAt: 2,
      },
    ];

    const result = mergeCategories(defaults, overrides);
    const meal = result.find(category => category.id === 'meal');

    expect(meal).toEqual(
      jasmine.objectContaining({
        name: 'Продукты',
        icon: 'fa-solid fa-bell-concierge',
        source: 'default-override',
        hidden: true,
        sortOrder: 0,
      })
    );
    expect(
      result.filter(category => !category.hidden).map(category => category.id)
    ).toEqual(['home']);
  });

  it('adds active and archived custom categories to the resolved view', () => {
    const overrides: CategoryOverrideDocument[] = [
      customOverride('custom_gifts', 'Подарки'),
      { ...customOverride('custom_old', 'Старое'), isDeleted: true },
    ];

    const result = mergeCategories(defaults, overrides);

    expect(
      result.find(category => category.id === 'custom_gifts')?.hidden
    ).toBeFalse();
    expect(
      result.find(category => category.id === 'custom_old')?.hidden
    ).toBeTrue();
    expect(result.map(category => category.id)).toEqual([
      'meal',
      'home',
      'custom_gifts',
      'custom_old',
    ]);
  });

  it('prefers explicit sortOrder over name sorting', () => {
    const overrides: CategoryOverrideDocument[] = [
      {
        id: 'home',
        source: 'default-override',
        baseCategoryId: 'home',
        sortOrder: 0,
        createdAt: 1,
        updatedAt: 1,
      },
      {
        id: 'meal',
        source: 'default-override',
        baseCategoryId: 'meal',
        sortOrder: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    ];

    const result = mergeCategories(defaults, overrides);

    expect(result.map(category => category.id)).toEqual(['home', 'meal']);
    expect(result.map(category => category.sortOrder)).toEqual([0, 1]);
  });

  it('normalizes fields and rejects a duplicate active name', () => {
    const active = mergeCategories(defaults, []);

    expect(() =>
      validateCategoryInput(
        {
          name: '  ПИТАНИЕ  ',
          icon: 'fas fa-home',
          color: '#fff',
          includeInBalance: false,
        },
        active
      )
    ).toThrowError(
      CategoryValidationError,
      'An active category with this name already exists.'
    );
  });

  it('does not count hidden categories as duplicate names', () => {
    const hidden = {
      ...mergeCategories(defaults, [
        {
          id: 'meal',
          source: 'default-override',
          isDeleted: true,
          createdAt: 1,
          updatedAt: 1,
        },
      ]).find(category => category.id === 'meal'),
    } as ResolvedCategory;

    const value = validateCategoryInput(
      {
        name: ' Питание ',
        icon: 'fas fa-home',
        color: '#fff',
        includeInBalance: false,
      },
      [hidden]
    );

    expect(value.name).toBe('Питание');
  });

  it('validates required fields, supported icons, colors, and boolean flags', () => {
    const valid = {
      name: 'Подарки',
      icon: 'fas fa-gift',
      color: '#123abc',
      includeInBalance: true,
    };

    expect(() =>
      validateCategoryInput({ ...valid, name: ' ' }, [])
    ).toThrowError(CategoryValidationError);
    expect(() =>
      validateCategoryInput({ ...valid, icon: 'fas fa-not-supported' }, [])
    ).toThrowError(CategoryValidationError);
    expect(() =>
      validateCategoryInput({ ...valid, color: 'not a color' }, [])
    ).toThrowError(CategoryValidationError);
    expect(() =>
      validateCategoryInput({ ...valid, includeInBalance: undefined }, [])
    ).toThrowError(CategoryValidationError);
    expect(validateCategoryInput(valid, [])).toEqual(valid);
  });

  function customOverride(id: string, name: string): CategoryOverrideDocument {
    return {
      id,
      source: 'custom',
      name,
      icon: 'fas fa-gift',
      color: '#123456',
      includeInBalance: true,
      normalizedName: name.toLocaleLowerCase(),
      sortOrder: undefined,
      createdAt: 1,
      updatedAt: 1,
    };
  }
});
