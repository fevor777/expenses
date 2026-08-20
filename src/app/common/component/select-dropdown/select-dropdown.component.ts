import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

export type SelectDropdownMode = 'single' | 'multi';

export type SelectDropdownOption = {
  value: string;
  label: string;
  disabled?: boolean;
  meta?: string;
};

@Component({
  selector: 'app-select-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-dropdown.component.html',
  styleUrls: ['./select-dropdown.component.scss'],
})
export class SelectDropdownComponent {
  @Input() options: SelectDropdownOption[] = [];
  @Input() mode: SelectDropdownMode = 'single';
  @Input() selectedValue: string | null = null;
  @Input() selectedValues: string[] = [];
  @Input() label = '';
  @Input() placeholder = 'Select';
  @Input() emptyLabel = 'No options';
  @Input() allowClear = true;
  @Input() compact = false;
  @Input() inline = false;
  @Input() disabled = false;

  @Output() selectedValueChange = new EventEmitter<string | null>();
  @Output() selectedValuesChange = new EventEmitter<string[]>();

  isOpen = false;

  get hasSelection(): boolean {
    return this.mode === 'single' ? !!this.selectedValue : this.selectedValues.length > 0;
  }

  get triggerLabel(): string {
    if (this.mode === 'single') {
      return this.selectedSingleOption?.label || this.placeholder;
    }

    if (this.selectedValues.length > 0) {
      const selectedLabels = this.options
        .filter(option => this.selectedValues.includes(option.value))
        .map(option => option.label)
        .join(', ');

      return this.label ? `${this.label}: ${selectedLabels}` : selectedLabels;
    }

    return this.placeholder;
  }

  get selectedSingleOption(): SelectDropdownOption | undefined {
    return this.options.find(option => option.value === this.selectedValue);
  }

  isSelected(optionValue: string): boolean {
    return this.mode === 'single'
      ? this.selectedValue === optionValue
      : this.selectedValues.includes(optionValue);
  }

  toggleDropdown(): void {
    if (this.disabled) {
      return;
    }

    this.isOpen = !this.isOpen;
  }

  selectOption(option: SelectDropdownOption): void {
    if (this.disabled || option.disabled) {
      return;
    }

    if (this.mode === 'single') {
      this.selectedValueChange.emit(option.value);
      this.isOpen = false;
      return;
    }

    if (this.selectedValues.includes(option.value)) {
      this.selectedValuesChange.emit(this.selectedValues.filter(value => value !== option.value));
      return;
    }

    this.selectedValuesChange.emit([...this.selectedValues, option.value]);
  }

  clearSelection(event?: MouseEvent): void {
    event?.stopPropagation();

    if (this.disabled || !this.allowClear) {
      return;
    }

    if (this.mode === 'single') {
      this.selectedValueChange.emit(null);
      return;
    }

    this.selectedValuesChange.emit([]);
  }

  trackByValue(_: number, option: SelectDropdownOption): string {
    return option.value;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isClickInsideComponent(event)) {
      this.isOpen = false;
    }
  }

  onContainerClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  private isClickInsideComponent(event: MouseEvent): boolean {
    const target = event.target as HTMLElement | null;
    return target?.closest('.select-dropdown') != null;
  }
}
