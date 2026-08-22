import { BehaviorSubject, of } from 'rxjs';

import { Budget } from '../common/model/budget.model';
import { ResolvedCategory } from '../common/model/category.model';
import { Tag } from '../common/model/tag.model';
import { ExportComponent } from './export.component';

describe('ExportComponent budget limits', () => {
  let budget$: BehaviorSubject<Budget>;
  let tags$: BehaviorSubject<Tag[]>;
  let categories$: BehaviorSubject<ResolvedCategory[]>;
  let addBudgetSpy: jasmine.Spy;
  let component: ExportComponent;

  beforeEach(() => {
    budget$ = new BehaviorSubject<Budget>({
      value: 900,
      period: 30,
      periodStartTs: new Date(2026, 7, 1).getTime(),
      timezone: 'Europe/Sofia',
      limits: [],
    });
    tags$ = new BehaviorSubject<Tag[]>([
      { id: 'tag-coffee', name: 'Coffee', normalizedName: 'coffee' },
    ]);
    categories$ = new BehaviorSubject<ResolvedCategory[]>([
      {
        id: 'meal',
        name: 'Meal',
        icon: 'fa-solid fa-bell-concierge',
        color: '#ff9900',
        includeInBalance: true,
        source: 'default',
        sortOrder: 0,
      },
    ]);
    addBudgetSpy = jasmine
      .createSpy('addValue')
      .and.callFake((value: Budget) => of(value));

    component = new ExportComponent(
      { getExpenses: () => of([]), addExpense: () => of(undefined) } as never,
      {
        signInWithGoogle: () => of(null),
        signOut: () => Promise.resolve(),
      } as never,
      {
        getValue: () => budget$.asObservable(),
        addValue: addBudgetSpy,
      } as never,
      { getSavings: () => of(0), addSaving: () => of(0) } as never,
      { user: of(null) } as never,
      {
        getSwipeLength: () => 48,
        saveSwipeLength: (value: number) => value,
      } as never,
      {
        getConfig: () => ({ enabled: true, startHour: 6, endHour: 11 }),
        saveConfig: () => undefined,
        resetTodayFlag: () => undefined,
        checkAndShowMorningReminder: () => of(false),
        showInAppMorningReminder: () => of(true),
      } as never,
      {
        allCategories$: categories$.asObservable(),
        getAllCategories: () => categories$.asObservable(),
      } as never,
      {
        getCurrentBudgetWithLimitSummaries: () =>
          of({
            budget: budget$.value,
            expenses: [],
            categories: categories$.value,
            tags: tags$.value,
            limitSummaries: [],
          }),
      } as never,
      {
        getTags: () => tags$.asObservable(),
        addTag: () => of(null),
        updateTag: () => of(null),
        deleteTag: () => of(''),
      } as never,
      { getTagsObs: () => tags$.asObservable() } as never
    );
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('adds a category budget limit with deterministic id', () => {
    component.categoryLimitTargetId = 'meal';
    component.categoryLimitValue = 123.456;

    component.addBudgetLimit('category');

    expect(component.budgetLimits).toEqual([
      {
        id: 'category:meal',
        type: 'category',
        targetId: 'meal',
        value: 123.46,
      },
    ]);
    expect(component.categoryLimitTargetId).toBe('');
    expect(component.categoryLimitValue).toBeNull();
    expect(component.categoryLimitError).toBe('');
  });

  it('keeps an added limit while a delayed budget value arrives', () => {
    component.categoryLimitTargetId = 'meal';
    component.categoryLimitValue = 100;

    component.addBudgetLimit('category');
    budget$.next({
      value: 900,
      period: 30,
      periodStartTs: new Date(2026, 7, 1).getTime(),
      timezone: 'Europe/Sofia',
      limits: [],
    });

    expect(component.budgetLimits).toEqual([
      {
        id: 'category:meal',
        type: 'category',
        targetId: 'meal',
        value: 100,
      },
    ]);
  });

  it('blocks duplicate limits for the same target', () => {
    component.budgetLimits = [
      {
        id: 'category:meal',
        type: 'category',
        targetId: 'meal',
        value: 90,
      },
    ];
    component.categoryLimitTargetId = 'meal';
    component.categoryLimitValue = 120;

    component.addBudgetLimit('category');

    expect(component.budgetLimits.length).toBe(1);
    expect(component.categoryLimitError).toContain('already exists');
  });

  it('edits a limit without treating itself as a duplicate', () => {
    component.budgetLimits = [
      {
        id: 'category:meal',
        type: 'category',
        targetId: 'meal',
        value: 90,
      },
    ];

    component.editBudgetLimit(component.budgetLimits[0]);
    component.categoryLimitValue = 120.456;
    component.addBudgetLimit('category');

    expect(component.budgetLimits).toEqual([
      {
        id: 'category:meal',
        type: 'category',
        targetId: 'meal',
        value: 120.46,
      },
    ]);
    expect(component.editingBudgetLimitId).toBeNull();
  });

  it('validates invalid limit amounts', () => {
    component.tagLimitTargetId = 'tag-coffee';
    component.tagLimitValue = -10;

    component.addBudgetLimit('tag');

    expect(component.budgetLimits).toEqual([]);
    expect(component.tagLimitError).toContain('greater than or equal to 0');
  });

  it('explains which category limit field is missing', () => {
    component.addBudgetLimit('category');

    expect(component.categoryLimitError).toBe('Select a category.');

    component.categoryLimitTargetId = 'meal';
    component.addBudgetLimit('category');

    expect(component.categoryLimitError).toBe('Enter a limit amount.');
  });

  it('removes a budget limit', () => {
    component.budgetLimits = [
      {
        id: 'category:meal',
        type: 'category',
        targetId: 'meal',
        value: 90,
      },
      {
        id: 'tag:tag-coffee',
        type: 'tag',
        targetId: 'tag-coffee',
        value: 40,
      },
    ];

    component.deleteBudgetLimit('category:meal');

    expect(component.budgetLimits).toEqual([
      {
        id: 'tag:tag-coffee',
        type: 'tag',
        targetId: 'tag-coffee',
        value: 40,
      },
    ]);
  });

  it('saves budget with current limits', () => {
    component.budgetLimits = [
      {
        id: 'tag:tag-coffee',
        type: 'tag',
        targetId: 'tag-coffee',
        value: 40,
      },
    ];

    component.onSaveBudget();

    expect(addBudgetSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        value: 900,
        period: 30,
        periodStartTs: new Date(2026, 7, 1).getTime(),
        timezone: 'Europe/Sofia',
        limits: [
          {
            id: 'tag:tag-coffee',
            type: 'tag',
            targetId: 'tag-coffee',
            value: 40,
          },
        ],
      })
    );
  });
});
