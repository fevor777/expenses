import { OnDestroy, Pipe } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { CategoryService } from '../service/category.service';

@Pipe({
  name: 'categoryListName',
  standalone: true,
  pure: false,
})
export class CategoryListNamePipe implements OnDestroy {
  private categoryNames = new Map<string, string>();
  private readonly destroy$ = new Subject<void>();

  constructor(categoryService: CategoryService) {
    categoryService.allCategories$
      .pipe(takeUntil(this.destroy$))
      .subscribe(categories => {
        this.categoryNames = new Map(
          categories.map(category => [category.id, category.name])
        );
      });
  }

  transform(value: string[]): string {
    if (!value || value.length === 0) {
      return '';
    }
    return value
      .map(id => this.categoryNames.get(id) || `Unknown category (${id})`)
      .join(', ');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
