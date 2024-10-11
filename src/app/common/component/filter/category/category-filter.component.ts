import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Categories } from '../../../categories';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss'],
})
export class CategoryFilterComponent implements OnChanges {
  @Input() value: string[];
  @Output() selectedCategories: EventEmitter<string[]> = new EventEmitter();

  readonly regularValue: string = 'regular';
  readonly irregularValue: string = 'irregular';
  filterCategories: any = Categories.reduce((acc, category) => {
    acc[category.id] = false;
    return acc;
  }, {});

  categories = {
    regular: Categories.filter((category) => !category.includeInBalance),
    irregular: Categories.filter((category) => category.includeInBalance),
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && Array.isArray(this.value)) {
      this.initiateFilterCategory();
      this.filterCategories = Categories.reduce((acc, category) => {
        acc[category.id] =
          this.value.length > 0 ? this.value.includes(category.id) : false;
        return acc;
      }, {});
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
    idList = idList.map((category) => category.id);

    if (this.filterCategories[type]) {
      idList.forEach((id) => {
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
      selectedCategories?.length === Categories.length
        ? []
        : selectedCategories;
    this.selectedCategories.emit(selectedCategories);
  }

  private checkMainCategory(): {
    regularChecked: boolean;
    irregularChecked: boolean;
  } {
    const regularIds = this.categories.regular.map((category) => category.id);
    const irregularIds = this.categories.irregular.map(
      (category) => category.id
    );
    const regularChecked = regularIds.every((id) => this.filterCategories[id]);
    const irregularChecked = irregularIds.every(
      (id) => this.filterCategories[id]
    );
    this.filterCategories.regular = regularChecked;
    this.filterCategories.irregular = irregularChecked;
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
    this.filterCategories.irregular = false;
    this.filterCategories.regular = false;
  }
}
