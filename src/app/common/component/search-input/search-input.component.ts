import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchInputComponent),
      multi: true,
    },
  ],
})
export class SearchInputComponent implements ControlValueAccessor {
  @Input() placeholder: string = 'Поиск...';
  @Input() ariaLabel: string = 'Поиск';
  @Input() clearButtonAriaLabel: string = 'Очистить поиск';
  @Output() searchChange = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  value: string = '';

  private onChange = (value: string) => {};
  private onTouched = () => {};

  onSearchChange(newValue: string): void {
    this.value = newValue;
    this.onChange(this.value);
    this.searchChange.emit(this.value);
  }

  onClear(): void {
    this.value = '';
    this.onChange(this.value);
    this.searchChange.emit(this.value);
    this.clear.emit();
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handle disabled state if needed
  }
}