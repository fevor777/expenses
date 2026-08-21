import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { BehaviorSubject, firstValueFrom, NEVER, of } from 'rxjs';
import { CategoryOverrideDocument } from '../model/category.model';

import { CategoryStoreService } from './category-store.service';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let store: CategoryStoreService;
  let setDocument: jasmine.Spy;
  let collection: jasmine.Spy;
  let fireStore: AngularFirestore;
  let service: CategoryService;

  beforeEach(() => {
    localStorage.clear();
    store = new CategoryStoreService();
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
    service = new CategoryService(fireStore, store, auth);
  });

  it('runs authenticated optimistic CRUD with hide, restore, and archive semantics', async () => {
    const created = await firstValueFrom(
      service.createCategory({
        name: 'Подарки',
        icon: 'fas fa-gift',
        color: '#123456',
        includeInBalance: true,
      })
    );
    expect(created.id).toBe('custom_generated-id');
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

  it('rolls back an optimistic change when Firestore rejects the write', async () => {
    setDocument.and.rejectWith(new Error('offline'));

    await expectAsync(
      firstValueFrom(
        service.createCategory({
          name: 'Подарки',
          icon: 'fas fa-gift',
          color: '#123456',
          includeInBalance: true,
        })
      )
    ).toBeRejectedWithError('offline');

    expect(store.getCategoryById('custom_generated-id')).toBeUndefined();
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
      scopedAuth
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

  function customOverride(id: string, name: string): CategoryOverrideDocument {
    return {
      id,
      source: 'custom',
      name,
      icon: 'fas fa-gift',
      color: '#123456',
      includeInBalance: true,
      normalizedName: name.toLocaleLowerCase(),
      createdAt: 1,
      updatedAt: 1,
    };
  }
});
