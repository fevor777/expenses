import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { BehaviorSubject, firstValueFrom, NEVER, of } from 'rxjs';
import { ExpenseStoreService } from './expense-store.service';
import { IrregularBudgetStoreService } from './irregular-budget-store.service';
import { CategoryOverrideDocument } from '../model/category.model';

import { CategoryStoreService } from './category-store.service';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let store: CategoryStoreService;
  let setDocument: jasmine.Spy;
  let collection: jasmine.Spy;
  let fireStore: AngularFirestore;
  let service: CategoryService;
  let expenseStore: ExpenseStoreService;
  let budgetStore: IrregularBudgetStoreService;

  beforeEach(() => {
    localStorage.clear();
    store = new CategoryStoreService();
    expenseStore = new ExpenseStoreService();
    budgetStore = new IrregularBudgetStoreService();
    setDocument = jasmine.createSpy('set').and.resolveTo(undefined);
    collection = jasmine.createSpy('collection').and.returnValue({
      doc: () => ({ set: setDocument }),
    });
    fireStore = {
      createId: () => 'generated-id',
      collection,
    } as unknown as AngularFirestore;
    const auth = {
      authState: of({ uid: 'user-1' }),
      currentUser: Promise.resolve({ uid: 'user-1' }),
    } as unknown as AngularFireAuth;
    service = new CategoryService(
      fireStore,
      store,
      auth,
      expenseStore,
      budgetStore
    );
  });

  it('runs authenticated optimistic CRUD with hide, restore, and archive semantics', async () => {
    const created = await firstValueFrom(
      service.createCategory({
        id: 'gifts',
        name: 'Подарки',
        icon: 'fas fa-gift',
        color: '#123456',
        includeInBalance: true,
      })
    );
    expect(created.id).toBe('custom_gifts');
    expect(created.source).toBe('custom');

    const updated = await firstValueFrom(
      service.updateCategory(created.id, { name: 'Сюрпризы' })
    );
    expect(updated.name).toBe('Сюрпризы');

    await firstValueFrom(service.hideCategory('meal'));
    expect(store.getCategoryById('meal')?.hidden).toBeTrue();
    expect(
      store.getCategories().some(category => category.id === 'meal')
    ).toBeFalse();

    await firstValueFrom(service.restoreCategory('meal'));
    expect(store.getCategoryById('meal')?.hidden).toBeFalse();

    await firstValueFrom(service.archiveCategory(created.id));
    expect(store.getCategoryById(created.id)?.hidden).toBeTrue();
    expect(setDocument).toHaveBeenCalledTimes(5);
    expect(collection).toHaveBeenCalledWith('users/user-1/category-overrides');
  });

  it('reorders active categories while keeping hidden categories in place', async () => {
    await firstValueFrom(service.hideCategory('home'));
    await firstValueFrom(
      service.createCategory({
        id: 'gifts',
        name: 'Подарки',
        icon: 'fas fa-gift',
        color: '#123456',
        includeInBalance: true,
      })
    );

    await firstValueFrom(
      service.reorderCategories(['custom_gifts', 'meal', 'subscriptions'])
    );

    expect(store.getAllCategories().map(category => category.id)).toEqual([
      'custom_gifts',
      'meal',
      'subscriptions',
      'entertainments',
      'nicotine',
      'home',
      'travel',
      'alcohol',
      'bus',
      'utility-bills',
      'pharmacy',
      'barbershop',
      'electronics',
      'clothes',
      'another',
      'sport',
      'rental-payment',
    ]);
    expect(store.getCategoryById('home')?.hidden).toBeTrue();
  });

  it('rolls back an optimistic change when Firestore rejects the write', async () => {
    setDocument.and.rejectWith(new Error('offline'));

    await expectAsync(
      firstValueFrom(
        service.createCategory({
          id: 'gifts',
          name: 'Подарки',
          icon: 'fas fa-gift',
          color: '#123456',
          includeInBalance: true,
        })
      )
    ).toBeRejectedWithError('offline');

    expect(store.getCategoryById('custom_gifts')).toBeUndefined();
  });

  it('switches the local cache scope when the authenticated user changes', fakeAsync(() => {
    const userOneCategory = customOverride('custom_user_one', 'User one');
    const userTwoCategory = customOverride('custom_user_two', 'User two');
    const seed = new CategoryStoreService();
    seed.setScope('user-1');
    seed.upsertOverride(userOneCategory);
    seed.setScope('user-2');
    seed.upsertOverride(userTwoCategory);

    const authState = new BehaviorSubject<{ uid: string } | null>({
      uid: 'user-1',
    });
    const scopedStore = new CategoryStoreService();
    const scopedFirestore = {
      createId: () => 'generated-id',
      collection: () => ({ snapshotChanges: () => NEVER }),
    } as unknown as AngularFirestore;
    const scopedAuth = {
      authState,
      get currentUser() {
        return Promise.resolve(authState.value);
      },
    } as unknown as AngularFireAuth;
    const scopedService = new CategoryService(
      scopedFirestore,
      scopedStore,
      scopedAuth,
      new ExpenseStoreService(),
      new IrregularBudgetStoreService()
    );
    const subscription = scopedService.getCategories().subscribe();

    expect(scopedStore.getCategoryById(userOneCategory.id)).toBeDefined();
    expect(scopedStore.getCategoryById(userTwoCategory.id)).toBeUndefined();

    authState.next({ uid: 'user-2' });

    expect(scopedStore.getCategoryById(userOneCategory.id)).toBeUndefined();
    expect(scopedStore.getCategoryById(userTwoCategory.id)).toBeDefined();

    authState.next(null);
    flushMicrotasks();

    expect(scopedStore.getCategoryById(userOneCategory.id)).toBeUndefined();
    expect(scopedStore.getCategoryById(userTwoCategory.id)).toBeUndefined();
    subscription.unsubscribe();
  }));

  it('renames a custom category locally together with expenses and category limits', async () => {
    const localAuth = {
      authState: of(null),
      currentUser: Promise.resolve(null),
    } as unknown as AngularFireAuth;
    const localService = new CategoryService(
      fireStore,
      store,
      localAuth,
      expenseStore,
      budgetStore
    );

    await firstValueFrom(
      localService.createCategory({
        id: 'gifts',
        name: 'Подарки',
        icon: 'fas fa-gift',
        color: '#123456',
        includeInBalance: true,
      })
    );
    expenseStore.replaceStoredExpenses([
      {
        id: 'expense-1',
        amount: 10,
        category: 'custom_gifts',
        currency: 'EUR',
        date: 1,
      },
      {
        id: 'expense-2',
        amount: 20,
        category: 'meal',
        currency: 'EUR',
        date: 2,
      },
    ]);
    budgetStore.addValueObs({
      value: 600,
      period: 30,
      limits: [
        {
          id: 'category:custom_gifts',
          type: 'category',
          targetId: 'custom_gifts',
          value: 50,
        },
      ],
    });

    const renamed = await firstValueFrom(
      localService.updateCategory('custom_gifts', { id: 'family-gifts' })
    );

    expect(renamed.id).toBe('custom_family-gifts');
    expect(store.getCategoryById('custom_gifts')).toBeUndefined();
    expect(store.getCategoryById('custom_family-gifts')?.name).toBe('Подарки');
    expect(expenseStore.getStoredExpenses()[0]?.category).toBe(
      'custom_family-gifts'
    );
    expect(expenseStore.getStoredExpenses()[1]?.category).toBe('meal');
    expect(budgetStore.getValue().limits).toEqual([
      {
        id: 'category:custom_family-gifts',
        type: 'category',
        targetId: 'custom_family-gifts',
        value: 50,
      },
    ]);
  });

  it('filters unrelated expense documents before building remote rename batches', () => {
    const batches: Array<{
      updates: Array<{ ref: unknown; data: unknown }>;
      set: jasmine.Spy;
      delete: jasmine.Spy;
    }> = [];
    (fireStore as unknown as { firestore: { batch: () => unknown } }).firestore = {
      batch: () => {
        const batch = {
          updates: [] as Array<{ ref: unknown; data: unknown }>,
          set: jasmine.createSpy('set'),
          delete: jasmine.createSpy('delete'),
          update(ref: unknown, data: unknown) {
            batch.updates.push({ ref, data });
          },
        };
        batches.push(batch);
        return batch;
      },
    };

    const categoryRef = { doc: (id: string) => `category:${id}` };
    const expenseDoc = (category: string, ref: string) => ({
      data: () => ({ category }),
      ref,
    });
    const document = customOverride('custom_family-gifts', 'Подарки');

    (service as any).buildRenameBatches(
      categoryRef,
      'custom_gifts',
      document,
      [
        expenseDoc('custom_gifts', 'expense:matching'),
        expenseDoc('meal', 'expense:unrelated'),
      ],
      undefined,
      'budget:user-1'
    );

    expect(batches.flatMap(batch => batch.updates)).toEqual([
      {
        ref: 'expense:matching',
        data: { category: 'custom_family-gifts' },
      },
    ]);
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
