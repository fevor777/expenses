import { getCategoryById } from '../model/categories';
import { CategoryOverrideDocument } from '../model/category.model';
import { CategoryStoreService } from './category-store.service';

describe('CategoryStoreService', () => {
  beforeEach(() => localStorage.clear());

  it('supports optimistic add, update, archive, and rollback for custom categories', () => {
    const store = new CategoryStoreService();
    store.setScope('user-1');
    const original = customOverride('custom_gifts', 'Подарки');

    store.upsertOverride(original);
    expect(
      store.getCategories().some(category => category.id === original.id)
    ).toBeTrue();

    const updated = {
      ...original,
      name: 'Сюрпризы',
      normalizedName: 'сюрпризы',
    };
    store.upsertOverride(updated);
    expect(store.getCategoryById(original.id)?.name).toBe('Сюрпризы');

    store.upsertOverride({ ...updated, isDeleted: true });
    expect(
      store.getCategories().some(category => category.id === original.id)
    ).toBeFalse();
    expect(store.getCategoryById(original.id)?.hidden).toBeTrue();

    store.restoreOverride(original.id, updated);
    expect(store.getCategoryById(original.id)?.hidden).toBeFalse();
    expect(store.getCategoryById(original.id)?.name).toBe('Сюрпризы');
  });

  it('keeps explicit sortOrder across cache and publish cycles', () => {
    const store = new CategoryStoreService();
    store.setScope('user-1');

    store.setOverrides([
      {
        id: 'meal',
        source: 'default-override',
        baseCategoryId: 'meal',
        sortOrder: 1,
        createdAt: 1,
        updatedAt: 1,
      },
      {
        id: 'home',
        source: 'default-override',
        baseCategoryId: 'home',
        sortOrder: 0,
        createdAt: 1,
        updatedAt: 1,
      },
    ]);

    expect(
      store
        .getCategories()
        .slice(0, 2)
        .map(category => category.id)
    ).toEqual(['home', 'meal']);

    const rehydrated = new CategoryStoreService();
    rehydrated.setScope('user-1');
    expect(
      rehydrated
        .getCategories()
        .slice(0, 2)
        .map(category => category.id)
    ).toEqual(['home', 'meal']);
  });

  it('hides and restores a default without losing history resolution', () => {
    const store = new CategoryStoreService();
    store.setScope('user-1');
    const hiddenDefault: CategoryOverrideDocument = {
      id: 'meal',
      source: 'default-override',
      baseCategoryId: 'meal',
      isDeleted: true,
      createdAt: 1,
      updatedAt: 1,
    };

    store.upsertOverride(hiddenDefault);

    expect(
      store.getCategories().some(category => category.id === 'meal')
    ).toBeFalse();
    expect(store.getCategoryById('meal')?.name).toBe('Питание');
    expect(getCategoryById('meal')?.name).toBe('Питание');

    store.removeOverride('meal');
    expect(
      store.getCategories().some(category => category.id === 'meal')
    ).toBeTrue();
  });

  it('hydrates cached overrides and isolates cache by user', () => {
    const first = new CategoryStoreService();
    first.setScope('user-1');
    first.upsertOverride(customOverride('custom_gifts', 'Подарки'));

    const second = new CategoryStoreService();
    second.setScope('user-1');
    expect(second.getCategoryById('custom_gifts')?.name).toBe('Подарки');

    second.setScope('user-2');
    expect(second.getCategoryById('custom_gifts')).toBeUndefined();
  });

  it('replaces remote overrides and removes stale cached documents', () => {
    const store = new CategoryStoreService();
    store.setScope('user-1');
    store.upsertOverride(customOverride('custom_old', 'Старое'));

    store.setOverrides([customOverride('custom_new', 'Новое')]);

    expect(store.getCategoryById('custom_old')).toBeUndefined();
    expect(store.getCategoryById('custom_new')?.name).toBe('Новое');
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
      sortOrder: 99,
      createdAt: 1,
      updatedAt: 1,
    };
  }
});
