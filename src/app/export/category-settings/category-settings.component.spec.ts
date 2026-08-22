import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';

import { ResolvedCategory } from '../../common/model/category.model';
import { CategoryService } from '../../common/service/category.service';
import { CategorySettingsComponent } from './category-settings.component';

describe('CategorySettingsComponent', () => {
  let fixture: ComponentFixture<CategorySettingsComponent>;
  let component: CategorySettingsComponent;
  let categories$: BehaviorSubject<ResolvedCategory[]>;
  let service: jasmine.SpyObj<CategoryService> & {
    allCategories$: BehaviorSubject<ResolvedCategory[]>;
    loading$: BehaviorSubject<boolean>;
  };

  const defaultCategory: ResolvedCategory = {
    id: 'meal',
    name: 'Meal',
    icon: 'fa-solid fa-bell-concierge',
    color: '#474747',
    includeInBalance: true,
    sortOrder: 0,
    source: 'default',
    hidden: false,
    normalizedName: 'meal',
  };

  const hiddenCategory: ResolvedCategory = {
    ...defaultCategory,
    id: 'travel',
    name: 'Travel',
    icon: 'fas fa-plane',
    sortOrder: 1,
    hidden: true,
    normalizedName: 'travel',
  };

  beforeEach(async () => {
    categories$ = new BehaviorSubject<ResolvedCategory[]>([
      defaultCategory,
      hiddenCategory,
    ]);
    service = Object.assign(
      jasmine.createSpyObj<CategoryService>('CategoryService', [
        'getAllCategories',
        'createCategory',
        'updateCategory',
        'hideCategory',
        'restoreCategory',
        'archiveCategory',
        'reorderCategories',
      ]),
      {
        allCategories$: categories$,
        loading$: new BehaviorSubject(false),
      }
    );
    service.getAllCategories.and.returnValue(of(categories$.value));
    service.createCategory.and.callFake(input =>
      of({
        id: input.id,
        source: 'custom',
        hidden: false,
        normalizedName: 'groceries',
        sortOrder: 2,
        ...input,
      })
    );
    service.updateCategory.and.callFake((id, patch) =>
      of({ ...defaultCategory, ...patch, id })
    );
    service.hideCategory.and.returnValue(of('meal'));
    service.restoreCategory.and.returnValue(of('travel'));
    service.archiveCategory.and.returnValue(of('custom-groceries'));
    service.reorderCategories.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [CategorySettingsComponent],
      providers: [{ provide: CategoryService, useValue: service }],
    }).compileComponents();

    fixture = TestBed.createComponent(CategorySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders active and hidden categories separately', () => {
    const element = fixture.nativeElement as HTMLElement;
    const activeNames = Array.from(
      element.querySelectorAll(
        '.category-list:not(.category-list--hidden) .category-card__text strong'
      )
    ).map(node => node.textContent?.trim());
    const hiddenNames = Array.from(
      element.querySelectorAll(
        '.category-list--hidden .category-card__text strong'
      )
    ).map(node => node.textContent?.trim());

    expect(activeNames).toEqual(['Meal']);
    expect(hiddenNames).toEqual(['Travel']);
  });

  it('creates a valid custom category and resets the draft', () => {
    component.draft = {
      id: 'groceries',
      name: '  Groceries  ',
      icon: 'fas fa-basket-shopping',
      color: '#12AB34',
      includeInBalance: true,
    };

    component.addCategory();

    expect(service.createCategory).toHaveBeenCalledWith({
      id: 'custom_groceries',
      name: 'Groceries',
      icon: 'fas fa-basket-shopping',
      color: '#12AB34',
      includeInBalance: true,
    });
    expect(component.draft.name).toBe('');
  });

  it('rejects duplicate active names but ignores hidden names', () => {
    component.draft.id = 'grocery-2';
    component.draft.name = ' meal ';
    component.addCategory();
    expect(service.createCategory).not.toHaveBeenCalled();
    expect(component.createError).toContain('already exists');

    component.draft.id = 'travel-copy';
    component.draft.name = 'travel';
    component.addCategory();
    expect(service.createCategory).toHaveBeenCalled();
  });

  it('updates a custom category id through the editor', () => {
    const customCategory: ResolvedCategory = {
      ...defaultCategory,
      id: 'custom_groceries',
      name: 'Groceries',
      source: 'custom',
      normalizedName: 'groceries',
    };
    categories$.next([defaultCategory, customCategory, hiddenCategory]);
    fixture.detectChanges();

    component.openEditor(customCategory);
    component.editDraft.id = 'fresh-groceries';
    component.editDraft.name = 'Fresh groceries';
    component.saveCategory();

    expect(service.updateCategory).toHaveBeenCalledWith('custom_groceries', {
      id: 'custom_fresh-groceries',
      name: 'Fresh groceries',
      icon: customCategory.icon,
      color: customCategory.color,
      includeInBalance: customCategory.includeInBalance,
    });
    expect(component.editingCategory).toBeNull();
  });

  it('rejects a duplicate custom category id', () => {
    const customCategory: ResolvedCategory = {
      ...defaultCategory,
      id: 'custom_groceries',
      name: 'Groceries',
      source: 'custom',
      normalizedName: 'groceries',
    };
    const secondCustomCategory: ResolvedCategory = {
      ...defaultCategory,
      id: 'custom_family-gifts',
      name: 'Family gifts',
      source: 'custom',
      normalizedName: 'family gifts',
      sortOrder: 3,
    };
    categories$.next([
      defaultCategory,
      customCategory,
      secondCustomCategory,
      hiddenCategory,
    ]);
    fixture.detectChanges();

    component.openEditor(customCategory);
    component.editDraft.id = 'family-gifts';
    component.saveCategory();

    expect(service.updateCategory).not.toHaveBeenCalled();
    expect(component.editorError).toContain('already exists');
  });

  it('reorders categories through up/down controls', () => {
    const secondCategory: ResolvedCategory = {
      ...defaultCategory,
      id: 'subscriptions',
      name: 'Subscriptions',
      normalizedName: 'subscriptions',
      sortOrder: 1,
    };
    categories$.next([defaultCategory, secondCategory, hiddenCategory]);
    fixture.detectChanges();

    component.moveCategory(secondCategory, -1);

    expect(service.reorderCategories).toHaveBeenCalledWith([
      'subscriptions',
      'meal',
    ]);
  });

  it('disables move buttons on list edges', () => {
    const secondCategory: ResolvedCategory = {
      ...defaultCategory,
      id: 'subscriptions',
      name: 'Subscriptions',
      normalizedName: 'subscriptions',
      sortOrder: 1,
    };
    categories$.next([defaultCategory, secondCategory, hiddenCategory]);
    fixture.detectChanges();

    const activeActionRows = Array.from(
      fixture.nativeElement.querySelectorAll(
        '.category-list:not(.category-list--hidden) .category-card__actions'
      )
    ) as HTMLElement[];
    const firstButtons = Array.from(
      activeActionRows[0].querySelectorAll('button')
    ) as HTMLButtonElement[];
    const secondButtons = Array.from(
      activeActionRows[1].querySelectorAll('button')
    ) as HTMLButtonElement[];

    expect(firstButtons[0].disabled).toBeTrue();
    expect(firstButtons[1].disabled).toBeFalse();
    expect(secondButtons[0].disabled).toBeFalse();
    expect(secondButtons[1].disabled).toBeTrue();
  });

  it('keeps action failures local to the affected category', () => {
    service.restoreCategory.and.returnValue(
      throwError(() => new Error('Restore failed'))
    );

    component.restoreCategory(hiddenCategory);

    expect(component.actionErrors['travel']).toBe('Restore failed');
    expect(component.createError).toBe('');
  });
});
