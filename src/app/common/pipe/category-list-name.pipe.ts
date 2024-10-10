import { Pipe } from '@angular/core';
import { getCategoryNameById } from '../categories';

@Pipe({
  name: 'categoryListName',
  standalone: true,
})
export class CategoryListNamePipe {
  transform(value: string[]): string {
    if (!value || value.length === 0) {
      return '';
    }
    return value.map((id) => getCategoryNameById(id)).join(', ');
  }
}
