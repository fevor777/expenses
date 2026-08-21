import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {
  Categories,
  setResolvedCategoriesForLegacyHelpers,
} from '../model/categories';
import {
  CategoryOverrideDocument,
  mergeCategories,
  ResolvedCategory,
} from '../model/category.model';

type CategoryCache = {
  version: 1;
  overrides: CategoryOverrideDocument[];
  resolved: ResolvedCategory[];
};

@Injectable({
  providedIn: 'root',
})
export class CategoryStoreService {
  private readonly storageKeyPrefix = 'category-cache-v1';
  private readonly allCategoriesSubject = new BehaviorSubject<
    ResolvedCategory[]
  >(mergeCategories(Categories, []));
  private readonly categoriesSubject = new BehaviorSubject<ResolvedCategory[]>(
    []
  );
  private readonly hiddenCategoriesSubject = new BehaviorSubject<
    ResolvedCategory[]
  >([]);
  private overrides: CategoryOverrideDocument[] = [];
  private scopeId = 'anonymous';

  readonly allCategories$ = this.allCategoriesSubject.asObservable();
  readonly categories$ = this.categoriesSubject.asObservable();
  readonly hiddenCategories$ = this.hiddenCategoriesSubject.asObservable();

  constructor() {
    const cache = this.readCache();
    this.overrides = cache?.overrides || [];
    this.publish(mergeCategories(Categories, this.overrides));
  }

  setScope(scopeId?: string | null): void {
    const nextScopeId = scopeId?.trim() || 'anonymous';
    if (this.scopeId === nextScopeId) {
      return;
    }

    this.scopeId = nextScopeId;
    const cache = this.readCache();
    this.overrides = cache?.overrides || [];
    this.publish(mergeCategories(Categories, this.overrides));
  }

  getCategories(): ResolvedCategory[] {
    return this.categoriesSubject.value;
  }

  getAllCategories(): ResolvedCategory[] {
    return this.allCategoriesSubject.value;
  }

  getHiddenCategories(): ResolvedCategory[] {
    return this.hiddenCategoriesSubject.value;
  }

  getCategoryById(id: string): ResolvedCategory | undefined {
    return this.allCategoriesSubject.value.find(category => category.id === id);
  }

  getOverride(id: string): CategoryOverrideDocument | undefined {
    return this.overrides.find(override => override.id === id);
  }

  setOverrides(overrides: readonly CategoryOverrideDocument[]): void {
    this.overrides = this.canonicalizeOverrides(overrides);
    this.persistAndPublish();
  }

  upsertOverride(override: CategoryOverrideDocument): void {
    this.overrides = [
      ...this.overrides.filter(item => item.id !== override.id),
      { ...override },
    ];
    this.persistAndPublish();
  }

  removeOverride(id: string): void {
    this.overrides = this.overrides.filter(override => override.id !== id);
    this.persistAndPublish();
  }

  restoreOverride(
    id: string,
    previousOverride?: CategoryOverrideDocument
  ): void {
    if (previousOverride) {
      this.upsertOverride(previousOverride);
      return;
    }
    this.removeOverride(id);
  }

  private persistAndPublish(): void {
    const resolved = mergeCategories(Categories, this.overrides);
    this.writeCache({
      version: 1,
      overrides: this.overrides,
      resolved,
    });
    this.publish(resolved);
  }

  private publish(categories: ResolvedCategory[]): void {
    const all = categories.map(category => ({ ...category }));
    this.allCategoriesSubject.next(all);
    this.categoriesSubject.next(all.filter(category => !category.hidden));
    this.hiddenCategoriesSubject.next(all.filter(category => category.hidden));
    setResolvedCategoriesForLegacyHelpers(all);
  }

  private canonicalizeOverrides(
    overrides: readonly CategoryOverrideDocument[]
  ): CategoryOverrideDocument[] {
    const byId = new Map<string, CategoryOverrideDocument>();
    overrides.forEach(override => {
      if (
        override?.id &&
        (override.source === 'custom' || override.source === 'default-override')
      ) {
        byId.set(override.id, { ...override });
      }
    });
    return Array.from(byId.values());
  }

  private readCache(): CategoryCache | undefined {
    try {
      const raw = localStorage.getItem(this.storageKey());
      if (!raw) {
        return undefined;
      }
      const cache = JSON.parse(raw) as Partial<CategoryCache>;
      if (cache.version !== 1 || !Array.isArray(cache.overrides)) {
        return undefined;
      }
      return {
        version: 1,
        overrides: this.canonicalizeOverrides(cache.overrides),
        resolved: Array.isArray(cache.resolved) ? cache.resolved : [],
      };
    } catch {
      return undefined;
    }
  }

  private writeCache(cache: CategoryCache): void {
    try {
      localStorage.setItem(this.storageKey(), JSON.stringify(cache));
    } catch {
      // In-memory state remains usable when storage is unavailable or full.
    }
  }

  private storageKey(): string {
    return `${this.storageKeyPrefix}:${encodeURIComponent(this.scopeId)}`;
  }
}
