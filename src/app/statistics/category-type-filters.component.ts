import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-type-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="stats-section stats-section--filters">
      <div class="statistics-checkbox">
        <label class="statistics-checkbox-item">
          <input
            type="checkbox"
            value="regular"
            class="statistics-checkbox-input"
            [checked]="regularValue"
            [(ngModel)]="regularValue"
            (ngModelChange)="regularChange.emit($event)"
          />
          <span class="statistics-checkbox-label"
            >Регулярное
            <span class="statistics-amount-muted">({{ regularAmount }}€)</span></span
          >
        </label>
        <label class="statistics-checkbox-item">
          <input
            type="checkbox"
            value="irregular"
            class="statistics-checkbox-input"
            [checked]="irregularValue"
            [(ngModel)]="irregularValue"
            (ngModelChange)="irregularChange.emit($event)"
          />
          <span class="statistics-checkbox-label"
            >Нерегулярное
            <span class="statistics-amount-muted">({{ irregularAmount }}€)</span></span
          >
        </label>
      </div>
    </div>
  `,
  styles: [
    `
    .stats-section {\n      display: flex;\n      flex-direction: column;\n      gap: 4px;\n      margin-top: 10px;\n      margin-bottom: 10px;\n    }\n+    .stats-section--filters {\n      margin-top: 10px;\n      margin-bottom: 10px;\n    }\n     .statistics-checkbox {\n       display: flex;\n       flex-direction: row;\n       gap: 3px;\n       margin-left: 37px;\n       margin-top: 5px;\n       margin-bottom: 5px;\n       flex-wrap: nowrap;\n     }\n*** End Patch
    .statistics-checkbox {
      display: flex;
      flex-direction: row;
      gap: 3px;
      margin-left: 37px;
      margin-top: 5px;
      margin-bottom: 5px;
      flex-wrap: nowrap;
    }
    .statistics-checkbox-item {
      display: flex;
      align-items: center;
      gap: 10px;
      border-radius: 8px;
      cursor: pointer;
      flex: 1 1 0;
      min-width: 0;
    }
    .statistics-checkbox-input {
      width: 18px;
      height: 18px;
      cursor: pointer;
      margin: 0;
    }
    .statistics-checkbox-label,
    .statistics-amount-muted {
      font-size: 13px;
      color: var(--color-text-secondary);
    }
    .statistics-checkbox-label { font-weight: 500; }
    .statistics-amount-muted { font-weight: 400; }
    :where(.dark,[data-theme='dark']) .statistics-checkbox-item { background: var(--color-bg-alt); }
    `
  ]
})
export class CategoryTypeFiltersComponent {
  @Input() regularAmount = 0;
  @Input() irregularAmount = 0;
  @Input() regularValue = true;
  @Input() irregularValue = true;
  @Output() regularChange = new EventEmitter<boolean>();
  @Output() irregularChange = new EventEmitter<boolean>();
}
