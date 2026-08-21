import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ResolvedCategory } from '../../../model/category.model';
import { CategoryService } from '../../../service/category.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CategoryFilterComponent implements OnInit, OnChanges, OnDestroy {
  @Input() value: string[];
  @Input() hideCategoryTitle: boolean;
  @Input() hideReset: boolean;
  @Output() selectedCategories: EventEmitter<string[]> = new EventEmitter();

  readonly regularValue: string = 'regular';
  readonly irregularValue: string = 'irregular';
  filterCategories: Record<string, boolean> = {};

  categories: { regular: ResolvedCategory[]; irregular: ResolvedCategory[] } = {
    regular: [],
    irregular: [],
  };
  private activeCategories: ResolvedCategory[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.categories$
      .pipe(takeUntil(this.destroy$))
      .subscribe(categories => {
        this.activeCategories = categories;
        this.categories = {
          regular: categories.filter(category => !category.includeInBalance),
          irregular: categories.filter(category => category.includeInBalance),
        };
        this.rebuildFilterState();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && Array.isArray(this.value)) {
      const currentLenght = Object.keys(this.filterCategories)?.filter(
        key =>
          this.filterCategories[key] &&
          key !== this.regularValue &&
          key !== this.irregularValue
      )?.length;
      const isValueAll =
        this.value.length === 0 ||
        this.value.length === this.activeCategories.length;
      const isFilterAll =
        currentLenght === 0 || currentLenght === this.activeCategories.length;
      if (currentLenght === this.value.length || (isValueAll && isFilterAll)) {
        return;
      }
      this.initiateFilterCategory();
      this.rebuildFilterState();
      this.checkMainCategory();
    }
  }

  clearCategoryFilters() {
    this.initiateFilterCategory();
    this.emitChanges();
  }

  filterCategory(type: string) {
    let idList: any[] =
      type === this.regularValue
        ? this.categories.regular
        : this.categories.irregular;
    idList = idList.map(category => category.id);

    if (this.filterCategories[type]) {
      idList.forEach(id => {
        this.filterCategories[id] = false;
      });
    }

    for (const key in this.filterCategories) {
      if (idList.includes(key)) {
        this.filterCategories[key] = !this.filterCategories[key];
      }
    }

    this.emitChanges();
  }

  emitChanges(): void {
    this.checkMainCategory();
    let selectedCategories = this.getSelectedCategories();
    selectedCategories =
      selectedCategories?.length === this.activeCategories.length
        ? []
        : selectedCategories;
    this.selectedCategories.emit(selectedCategories);
  }

  private checkMainCategory(): {
    regularChecked: boolean;
    irregularChecked: boolean;
  } {
    const regularIds = this.categories.regular.map(category => category.id);
    const irregularIds = this.categories.irregular.map(category => category.id);
    const regularChecked =
      regularIds.length > 0 &&
      regularIds.every(id => this.filterCategories[id]);
    const irregularChecked =
      irregularIds.every(id => this.filterCategories[id]) &&
      irregularIds.length > 0;
    this.filterCategories['regular'] = regularChecked;
    this.filterCategories['irregular'] = irregularChecked;
    return {
      regularChecked,
      irregularChecked,
    };
  }

  private getSelectedCategories(): string[] {
    return Object.keys(this.filterCategories).reduce((acc, key) => {
      if (
        this.filterCategories[key] &&
        key !== this.regularValue &&
        key !== this.irregularValue
      ) {
        acc.push(key);
      }
      return acc;
    }, []);
  }

  private initiateFilterCategory(): void {
    for (const key in this.filterCategories) {
      this.filterCategories[key] = false;
    }
    this.filterCategories['irregular'] = false;
    this.filterCategories['regular'] = false;
  }

  private rebuildFilterState(): void {
    const selected = Array.isArray(this.value) ? this.value : [];
    this.filterCategories = this.activeCategories.reduce<
      Record<string, boolean>
    >(
      (acc, category) => {
        acc[category.id] =
          selected.length > 0 && selected.includes(category.id);
        return acc;
      },
      { regular: false, irregular: false }
    );
    this.checkMainCategory();
  }
}
