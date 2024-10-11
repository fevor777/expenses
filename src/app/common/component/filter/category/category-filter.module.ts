import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CategoryFilterComponent } from './category-filter.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CategoryFilterComponent],
  imports: [CommonModule, FormsModule],
  exports: [CategoryFilterComponent],
})
export class CategoryFilterModule {}
