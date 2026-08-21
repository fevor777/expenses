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
    source: 'default',
    hidden: false,
    normalizedName: 'meal',
  };

  const hiddenCategory: ResolvedCategory = {
    ...defaultCategory,
    id: 'travel',
    name: 'Travel',
    icon: 'fas fa-plane',
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
      ]),
      {
        allCategories$: categories$,
        loading$: new BehaviorSubject(false),
      }
    );
    service.getAllCategories.and.returnValue(of(categories$.value));
    service.createCategory.and.callFake(input =>
      of({
        id: 'custom-groceries',
        source: 'custom',
        hidden: false,
        normalizedName: 'groceries',
        ...input,
      })
    );
    service.updateCategory.and.callFake((id, patch) =>
      of({ ...defaultCategory, ...patch, id })
    );
    service.hideCategory.and.returnValue(of('meal'));
    service.restoreCategory.and.returnValue(of('travel'));
    service.archiveCategory.and.returnValue(of('custom-groceries'));

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
      name: '  Groceries  ',
      icon: 'fas fa-basket-shopping',
      color: '#12AB34',
      includeInBalance: true,
    };

    component.addCategory();

    expect(service.createCategory).toHaveBeenCalledWith({
      name: 'Groceries',
      icon: 'fas fa-basket-shopping',
      color: '#12AB34',
      includeInBalance: true,
    });
    expect(component.draft.name).toBe('');
  });

  it('rejects duplicate active names but ignores hidden names', () => {
    component.draft.name = ' meal ';
    component.addCategory();
    expect(service.createCategory).not.toHaveBeenCalled();
    expect(component.createError).toContain('already exists');

    component.draft.name = 'travel';
    component.addCategory();
    expect(service.createCategory).toHaveBeenCalled();
  });

  it('updates a category through the editor', () => {
    component.openEditor(defaultCategory);
    component.editDraft.name = 'Dining';
    component.saveCategory();

    expect(service.updateCategory).toHaveBeenCalledWith('meal', {
      name: 'Dining',
      icon: defaultCategory.icon,
      color: defaultCategory.color,
      includeInBalance: defaultCategory.includeInBalance,
    });
    expect(component.editingCategory).toBeNull();
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
