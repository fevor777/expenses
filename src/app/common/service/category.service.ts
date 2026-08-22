import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  BehaviorSubject,
  catchError,
  defer,
  distinctUntilChanged,
  EMPTY,
  filter,
  from,
  map,
  merge,
  Observable,
  of,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';

import {
  CategoryInput,
  CategoryOverrideDocument,
  CategoryPatch,
  CategoryValidationError,
  normalizeCategoryName,
  ResolvedCategory,
  validateCategoryInput,
} from '../model/category.model';
import { CategoryStoreService } from './category-store.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly loadingSubject = new BehaviorSubject(false);

  readonly categories$: Observable<ResolvedCategory[]>;
  readonly allCategories$: Observable<ResolvedCategory[]>;
  readonly hiddenCategories$: Observable<ResolvedCategory[]>;
  readonly loading$ = this.loadingSubject.asObservable();

  constructor(
    private fireStore: AngularFirestore,
    private categoryStore: CategoryStoreService,
    private afAuth: AngularFireAuth
  ) {
    this.categories$ = this.categoryStore.categories$;
    this.allCategories$ = this.categoryStore.allCategories$;
    this.hiddenCategories$ = this.categoryStore.hiddenCategories$;
  }

  getCategories(useCache = true): Observable<ResolvedCategory[]> {
    return this.observeCategories(useCache, false);
  }

  getAllCategories(useCache = true): Observable<ResolvedCategory[]> {
    return this.observeCategories(useCache, true);
  }

  getCategoryById(
    id: string,
    useCache = true
  ): Observable<ResolvedCategory | undefined> {
    return this.getAllCategories(useCache).pipe(
      map(categories => categories.find(category => category.id === id))
    );
  }

  createCategory(input: CategoryInput): Observable<ResolvedCategory> {
    return defer(() => {
      const id = `custom_${this.fireStore.createId()}`;
      return this.resolveUserId().pipe(
        switchMap(uid => {
          this.categoryStore.setScope(uid);
          const category = validateCategoryInput(
            input,
            this.categoryStore.getCategories()
          );
          const now = Date.now();
          const document: CategoryOverrideDocument = {
            id,
            source: 'custom',
            ...category,
            sortOrder: this.nextSortOrder(),
            normalizedName: normalizeCategoryName(category.name),
            isDeleted: false,
            createdAt: now,
            updatedAt: now,
          };

          return this.optimisticWrite(uid, document).pipe(
            map(() => this.requireCategory(id))
          );
        })
      );
    });
  }

  updateCategory(
    id: string,
    patch: CategoryPatch
  ): Observable<ResolvedCategory> {
    return defer(() =>
      this.resolveUserId().pipe(
        switchMap(uid => {
          this.categoryStore.setScope(uid);
          const current = this.requireCategory(id);
          const next = validateCategoryInput(
            {
              name: patch.name ?? current.name,
              icon: patch.icon ?? current.icon,
              color: patch.color ?? current.color,
              includeInBalance:
                patch.includeInBalance ?? current.includeInBalance,
            },
            this.categoryStore.getCategories(),
            id
          );
          const document = this.buildDocument(current, next);

          return this.optimisticWrite(uid, document).pipe(
            map(() => this.requireCategory(id))
          );
        })
      )
    );
  }

  deleteCategory(id: string): Observable<string> {
    return defer(() =>
      this.resolveUserId().pipe(
        switchMap(uid => {
          this.categoryStore.setScope(uid);
          const category = this.requireCategory(id);
          return category.source === 'custom'
            ? this.setHiddenState(id, true, 'custom')
            : this.setHiddenState(id, true, 'default');
        })
      )
    );
  }

  hideCategory(id: string): Observable<string> {
    return this.setHiddenState(id, true, 'default');
  }

  archiveCategory(id: string): Observable<string> {
    return this.setHiddenState(id, true, 'custom');
  }

  restoreCategory(id: string): Observable<string> {
    return defer(() =>
      this.resolveUserId().pipe(
        switchMap(uid => {
          this.categoryStore.setScope(uid);
          const current = this.requireCategory(id);
          validateCategoryInput(
            {
              name: current.name,
              icon: current.icon,
              color: current.color,
              includeInBalance: current.includeInBalance,
            },
            this.categoryStore.getCategories(),
            id
          );
          const document = {
            ...this.buildDocument(current, current),
            isDeleted: false,
            updatedAt: Date.now(),
          };
          return this.optimisticWrite(uid, document).pipe(map(() => id));
        })
      )
    );
  }

  reorderCategories(orderedIds: readonly string[]): Observable<void> {
    return defer(() =>
      this.resolveUserId().pipe(
        switchMap(uid => {
          this.categoryStore.setScope(uid);
          const allCategories = this.categoryStore.getAllCategories();
          const activeCategories = allCategories.filter(
            category => !category.hidden
          );
          if (activeCategories.length < 2) {
            return of(void 0);
          }

          const normalizedActiveIds = this.normalizeOrderedIds(
            orderedIds,
            activeCategories
          );
          const mergedIds = this.mergeOrderedIdsWithHidden(
            allCategories,
            normalizedActiveIds
          );
          const now = Date.now();
          const documents = mergedIds.map((id, sortOrder) =>
            this.buildReorderDocument(this.requireCategory(id), sortOrder, now)
          );

          return this.optimisticBatchWrite(uid, documents);
        })
      )
    );
  }

  normalizeName(name?: string): string {
    return normalizeCategoryName(name);
  }

  private observeCategories(
    useCache: boolean,
    includeHidden: boolean
  ): Observable<ResolvedCategory[]> {
    return defer(() => {
      this.loadingSubject.next(true);
      return this.observeUserId().pipe(
        switchMap(uid => {
          this.loadingSubject.next(true);
          this.categoryStore.setScope(uid);
          const local$ = includeHidden
            ? this.categoryStore.allCategories$
            : this.categoryStore.categories$;
          if (!uid) {
            this.loadingSubject.next(false);
            return local$;
          }

          const remote$ = this.fireStore
            .collection<CategoryOverrideDocument>(
              `users/${uid}/category-overrides`
            )
            .snapshotChanges()
            .pipe(
              filter(
                changes =>
                  useCache ||
                  changes.every(
                    change => change.payload.doc.metadata.fromCache === false
                  )
              ),
              tap(changes => {
                this.categoryStore.setOverrides(
                  changes.map(change => ({
                    ...change.payload.doc.data(),
                    id: change.payload.doc.id,
                  }))
                );
                this.loadingSubject.next(false);
              }),
              catchError(error => {
                this.loadingSubject.next(false);
                console.error('Failed to load category overrides', error);
                return EMPTY;
              })
            );

          return merge(local$, remote$.pipe(switchMap(() => EMPTY)));
        })
      );
    });
  }

  private setHiddenState(
    id: string,
    hidden: boolean,
    expectedSource: 'default' | 'custom'
  ): Observable<string> {
    return defer(() =>
      this.resolveUserId().pipe(
        switchMap(uid => {
          this.categoryStore.setScope(uid);
          const current = this.requireCategory(id);
          const isCustom = current.source === 'custom';
          if (
            (expectedSource === 'custom' && !isCustom) ||
            (expectedSource === 'default' && isCustom)
          ) {
            throw new CategoryValidationError('invalid-category-source');
          }

          const document = {
            ...this.buildDocument(current, current),
            isDeleted: hidden,
            updatedAt: Date.now(),
          };
          return this.optimisticWrite(uid, document).pipe(map(() => id));
        })
      )
    );
  }

  private buildDocument(
    current: ResolvedCategory,
    category: CategoryInput
  ): CategoryOverrideDocument {
    const previous = this.categoryStore.getOverride(current.id);
    const now = Date.now();
    const source = current.source === 'custom' ? 'custom' : 'default-override';
    return {
      ...previous,
      id: current.id,
      source,
      ...(source === 'default-override' ? { baseCategoryId: current.id } : {}),
      name: category.name,
      icon: category.icon,
      color: category.color,
      includeInBalance: category.includeInBalance,
      sortOrder: this.resolvePersistedSortOrder(current, previous),
      isDeleted: previous?.isDeleted === true,
      normalizedName: normalizeCategoryName(category.name),
      createdAt: previous?.createdAt ?? now,
      updatedAt: now,
    };
  }

  private buildReorderDocument(
    current: ResolvedCategory,
    sortOrder: number,
    now: number
  ): CategoryOverrideDocument {
    const previous = this.categoryStore.getOverride(current.id);
    if (current.source === 'custom') {
      return {
        ...previous,
        id: current.id,
        source: 'custom',
        name: current.name,
        icon: current.icon,
        color: current.color,
        includeInBalance: current.includeInBalance,
        sortOrder,
        isDeleted: current.hidden === true,
        normalizedName: normalizeCategoryName(current.name),
        createdAt: previous?.createdAt ?? now,
        updatedAt: now,
      };
    }

    return {
      ...previous,
      id: current.id,
      source: 'default-override',
      baseCategoryId: previous?.baseCategoryId ?? current.id,
      sortOrder,
      isDeleted: current.hidden === true,
      createdAt: previous?.createdAt ?? now,
      updatedAt: now,
    };
  }

  private optimisticWrite(
    uid: string | undefined,
    document: CategoryOverrideDocument
  ): Observable<void> {
    const previous = this.categoryStore.getOverride(document.id);
    this.categoryStore.upsertOverride(document);
    if (!uid) {
      return of(void 0);
    }

    return from(
      this.fireStore
        .collection<CategoryOverrideDocument>(`users/${uid}/category-overrides`)
        .doc(document.id)
        .set(document)
    ).pipe(
      map(() => void 0),
      catchError(error => {
        this.categoryStore.restoreOverride(document.id, previous);
        return throwError(() => error);
      })
    );
  }

  private optimisticBatchWrite(
    uid: string | undefined,
    documents: readonly CategoryOverrideDocument[]
  ): Observable<void> {
    const previousOverrides = this.categoryStore.getOverrides();
    this.categoryStore.setOverrides(
      this.mergeOverrides(previousOverrides, documents)
    );
    if (!uid) {
      return of(void 0);
    }

    const collection = this.fireStore.collection<CategoryOverrideDocument>(
      `users/${uid}/category-overrides`
    );
    return from(
      Promise.all(
        documents.map(document => collection.doc(document.id).set(document))
      )
    ).pipe(
      map(() => void 0),
      catchError(error => {
        this.categoryStore.setOverrides(previousOverrides);
        return throwError(() => error);
      })
    );
  }

  private requireCategory(id: string): ResolvedCategory {
    const category = this.categoryStore.getCategoryById(id);
    if (!category) {
      throw new CategoryValidationError('not-found');
    }
    return category;
  }

  private resolveUserId(): Observable<string | undefined> {
    return this.afAuth.authState.pipe(
      take(1),
      switchMap(user => {
        if (user?.uid) {
          return of(user.uid);
        }
        return from(this.afAuth.currentUser).pipe(
          map(currentUser => currentUser?.uid)
        );
      }),
      catchError(() => of(undefined))
    );
  }

  private observeUserId(): Observable<string | undefined> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user?.uid) {
          return of(user.uid);
        }
        return from(this.afAuth.currentUser).pipe(
          map(currentUser => currentUser?.uid),
          catchError(() => of(undefined))
        );
      }),
      distinctUntilChanged(),
      catchError(() => of(undefined))
    );
  }

  private resolvePersistedSortOrder(
    current: ResolvedCategory,
    previous?: CategoryOverrideDocument
  ): number | undefined {
    if (typeof previous?.sortOrder === 'number') {
      return previous.sortOrder;
    }

    return current.source === 'custom' ? current.sortOrder : undefined;
  }

  private normalizeOrderedIds(
    orderedIds: readonly string[],
    activeCategories: readonly ResolvedCategory[]
  ): string[] {
    const activeIds = new Set(activeCategories.map(category => category.id));
    const normalized: string[] = [];
    const seen = new Set<string>();

    orderedIds.forEach(id => {
      if (activeIds.has(id) && !seen.has(id)) {
        seen.add(id);
        normalized.push(id);
      }
    });

    activeCategories.forEach(category => {
      if (!seen.has(category.id)) {
        normalized.push(category.id);
      }
    });

    return normalized;
  }

  private mergeOrderedIdsWithHidden(
    allCategories: readonly ResolvedCategory[],
    orderedActiveIds: readonly string[]
  ): string[] {
    let activeIndex = 0;

    return allCategories.map(category => {
      if (category.hidden) {
        return category.id;
      }

      const nextId = orderedActiveIds[activeIndex];
      activeIndex += 1;
      return nextId ?? category.id;
    });
  }

  private mergeOverrides(
    previousOverrides: readonly CategoryOverrideDocument[],
    documents: readonly CategoryOverrideDocument[]
  ): CategoryOverrideDocument[] {
    const byId = new Map(
      previousOverrides.map(override => [override.id, { ...override }] as const)
    );
    documents.forEach(document => {
      byId.set(document.id, { ...document });
    });
    return Array.from(byId.values());
  }

  private nextSortOrder(): number {
    const categories = this.categoryStore.getAllCategories();
    if (!categories.length) {
      return 0;
    }

    return (
      Math.max(
        ...categories.map(category =>
          Number.isFinite(category.sortOrder) ? category.sortOrder : 0
        )
      ) + 1
    );
  }
}
