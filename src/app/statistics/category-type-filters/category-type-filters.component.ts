import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-type-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-type-filters.component.html',
  styleUrls: ['./category-type-filters.component.scss'],
})
export class CategoryTypeFiltersComponent {
  @Input() regularAmount = 0;
  @Input() irregularAmount = 0;
  @Input() regularValue = true;
  @Input() irregularValue = true;
  @Output() regularChange = new EventEmitter<boolean>();
  @Output() irregularChange = new EventEmitter<boolean>();
}
