import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, Subject, finalize, first, takeUntil } from 'rxjs';

import {
  CategoryInput,
  CategoryPatch,
  ResolvedCategory,
  isValidCategoryColor,
  normalizeCategoryName,
} from '../../common/model/category.model';
import { CategoryService } from '../../common/service/category.service';

type CategoryForm = {
  name: string;
  icon: string;
  color: string;
  includeInBalance: boolean;
};

@Component({
  selector: 'app-category-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-settings.component.html',
  styleUrls: ['./category-settings.component.scss'],
})
export class CategorySettingsComponent implements OnInit, OnDestroy {
  readonly iconOptions = [
    { value: 'fas fa-basket-shopping', label: 'Shopping' },
    { value: 'fas fa-newspaper', label: 'Subscription' },
    { value: 'fas fa-film', label: 'Entertainment' },
    { value: 'fas fa-plane', label: 'Travel' },
    { value: 'fas fa-home', label: 'Home' },
    { value: 'fas fa-wine-bottle', label: 'Drinks' },
    { value: 'fa-solid fa-bell-concierge', label: 'Food' },
    { value: 'fas fa-bus', label: 'Transport' },
    { value: 'fas fa-water', label: 'Utilities' },
    { value: 'fas fa-prescription-bottle-alt', label: 'Health' },
    { value: 'fas fa-cut', label: 'Personal care' },
    { value: 'fas fa-tablet-alt', label: 'Electronics' },
    { value: 'fas fa-tshirt', label: 'Clothes' },
    { value: 'fas fa-random', label: 'Other' },
    { value: 'fas fa-dumbbell', label: 'Sport' },
    { value: 'fas fa-building', label: 'Housing' },
    { value: 'fas fa-smoking', label: 'Smoking' },
    { value: 'fas fa-car', label: 'Car' },
    { value: 'fas fa-gift', label: 'Gifts' },
    { value: 'fas fa-graduation-cap', label: 'Education' },
    { value: 'fas fa-paw', label: 'Pets' },
    { value: 'fas fa-heart', label: 'Wellbeing' },
  ];

  readonly loading$: Observable<boolean>;

  categories: ResolvedCategory[] = [];
  draft = this.emptyForm();
  editingCategory: ResolvedCategory | null = null;
  editDraft = this.emptyForm();
  createSaving = false;
  createError = '';
  editorError = '';
  reorderSaving = false;
  actionErrors: Record<string, string> = {};

  private readonly savingCategoryIds = new Set<string>();
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly categoryService: CategoryService) {
    this.loading$ = this.categoryService.loading$;
  }

  get activeCategories(): ResolvedCategory[] {
    return this.categories.filter(category => !category.hidden);
  }

  get hiddenCategories(): ResolvedCategory[] {
    return this.categories.filter(category => category.hidden);
  }

  ngOnInit(): void {
    this.categoryService.allCategories$
      .pipe(takeUntil(this.destroy$))
      .subscribe(categories => (this.categories = categories || []));

    this.categoryService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: error => {
          this.createError = this.errorMessage(
            error,
            'Could not load categories.'
          );
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addCategory(): void {
    this.createError = this.validate(this.draft);
    if (this.createError || this.createSaving) {
      return;
    }

    const input: CategoryInput = this.toPayload(this.draft);
    this.createSaving = true;
    this.categoryService
      .createCategory(input)
      .pipe(
        first(),
        finalize(() => (this.createSaving = false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.draft = this.emptyForm();
          this.createError = '';
        },
        error: error => {
          this.createError = this.errorMessage(
            error,
            'Could not add category.'
          );
        },
      });
  }

  openEditor(category: ResolvedCategory): void {
    this.editingCategory = category;
    this.editDraft = {
      name: category.name,
      icon: category.icon,
      color: category.color,
      includeInBalance: category.includeInBalance,
    };
    this.editorError = '';
  }

  closeEditor(): void {
    if (this.editingCategory && this.isSaving(this.editingCategory.id)) {
      return;
    }

    this.editingCategory = null;
    this.editorError = '';
  }

  saveCategory(): void {
    const category = this.editingCategory;
    if (!category || this.isSaving(category.id)) {
      return;
    }

    this.editorError = this.validate(this.editDraft, category.id);
    if (this.editorError) {
      return;
    }

    const patch: CategoryPatch = this.toPayload(this.editDraft);
    this.setSaving(category.id, true);
    this.categoryService
      .updateCategory(category.id, patch)
      .pipe(
        first(),
        finalize(() => this.setSaving(category.id, false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.setSaving(category.id, false);
          this.closeEditor();
        },
        error: error => {
          this.editorError = this.errorMessage(
            error,
            'Could not save category.'
          );
        },
      });
  }

  hideCategory(category: ResolvedCategory): void {
    if (
      this.isSaving(category.id) ||
      !confirm(
        `Hide category "${category.name}"? Existing expenses will not change.`
      )
    ) {
      return;
    }

    this.runAction(
      category,
      this.categoryService.hideCategory(category.id),
      'Could not hide category.'
    );
  }

  restoreCategory(category: ResolvedCategory): void {
    if (this.isSaving(category.id)) {
      return;
    }

    this.runAction(
      category,
      this.categoryService.restoreCategory(category.id),
      'Could not restore category.'
    );
  }

  archiveCategory(category: ResolvedCategory): void {
    if (
      this.isSaving(category.id) ||
      !confirm(
        `Archive category "${category.name}"? Existing expenses will not change.`
      )
    ) {
      return;
    }

    this.runAction(
      category,
      this.categoryService.archiveCategory(category.id),
      'Could not archive category.'
    );
  }

  moveCategory(category: ResolvedCategory, direction: -1 | 1): void {
    if (this.reorderSaving || this.isSaving(category.id)) {
      return;
    }

    const categories = this.activeCategories;
    const currentIndex = categories.findIndex(item => item.id === category.id);
    const targetIndex = currentIndex + direction;
    if (
      currentIndex < 0 ||
      targetIndex < 0 ||
      targetIndex >= categories.length
    ) {
      return;
    }

    const targetCategory = categories[targetIndex];
    const orderedIds = categories.map(item => item.id);
    [orderedIds[currentIndex], orderedIds[targetIndex]] = [
      orderedIds[targetIndex],
      orderedIds[currentIndex],
    ];

    delete this.actionErrors[category.id];
    this.reorderSaving = true;
    this.setSaving(category.id, true);
    this.setSaving(targetCategory.id, true);
    this.categoryService
      .reorderCategories(orderedIds)
      .pipe(
        first(),
        finalize(() => {
          this.reorderSaving = false;
          this.setSaving(category.id, false);
          this.setSaving(targetCategory.id, false);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        error: error => {
          this.actionErrors[category.id] = this.errorMessage(
            error,
            'Could not reorder categories.'
          );
        },
      });
  }

  isSaving(id: string): boolean {
    return this.savingCategoryIds.has(id);
  }

  canMoveUp(category: ResolvedCategory): boolean {
    return this.activeCategories.findIndex(item => item.id === category.id) > 0;
  }

  canMoveDown(category: ResolvedCategory): boolean {
    const index = this.activeCategories.findIndex(
      item => item.id === category.id
    );
    return index > -1 && index < this.activeCategories.length - 1;
  }

  displayOrder(category: ResolvedCategory): number {
    const index = this.activeCategories.findIndex(
      item => item.id === category.id
    );
    return index > -1 ? index + 1 : category.sortOrder + 1;
  }

  sourceLabel(category: ResolvedCategory): string {
    return category.source === 'default-override'
      ? 'modified'
      : category.source;
  }

  trackByCategory(_: number, category: ResolvedCategory): string {
    return category.id;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeEditor();
  }

  private runAction(
    category: ResolvedCategory,
    action$: Observable<unknown>,
    fallbackError: string
  ): void {
    delete this.actionErrors[category.id];
    this.setSaving(category.id, true);
    action$
      .pipe(
        first(),
        finalize(() => this.setSaving(category.id, false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        error: error => {
          this.actionErrors[category.id] = this.errorMessage(
            error,
            fallbackError
          );
        },
      });
  }

  private setSaving(id: string, saving: boolean): void {
    if (saving) {
      this.savingCategoryIds.add(id);
      return;
    }

    this.savingCategoryIds.delete(id);
  }

  private validate(form: CategoryForm, editingId?: string): string {
    const name = form.name.trim();
    if (!name) {
      return 'Name is required.';
    }

    const normalizedName = normalizeCategoryName(name);
    const duplicate = this.activeCategories.some(
      category =>
        category.id !== editingId &&
        normalizeCategoryName(category.name) === normalizedName
    );
    if (duplicate) {
      return 'An active category with this name already exists.';
    }

    if (!this.iconOptions.some(option => option.value === form.icon)) {
      return 'Choose a supported icon.';
    }

    if (!isValidCategoryColor(form.color)) {
      return 'Enter a valid CSS color.';
    }

    return '';
  }

  private toPayload(form: CategoryForm): CategoryInput {
    return {
      name: form.name.trim().replace(/\s+/g, ' '),
      icon: form.icon,
      color: form.color.trim(),
      includeInBalance: form.includeInBalance,
    };
  }

  private emptyForm(): CategoryForm {
    return {
      name: '',
      icon: 'fas fa-basket-shopping',
      color: '#FFB400',
      includeInBalance: true,
    };
  }

  private errorMessage(error: unknown, fallback: string): string {
    return error instanceof Error && error.message ? error.message : fallback;
  }
}
