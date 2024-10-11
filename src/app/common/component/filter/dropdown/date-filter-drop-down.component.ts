import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SelectOption } from '../../../model/select-option';

export type DateFilterDropDownChange<T, D> = { value: T; name: D };

@Component({
  selector: 'app-date-filter-drop-down',
  templateUrl: './date-filter-drop-down.component.html',
  styleUrls: ['./date-filter-drop-down.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class DateFilterDropDownComponent<T, D> implements OnChanges {
  @Input() options: SelectOption<T>[] = [];
  @Input() name: D;
  @Input() activatedName: D;
  @Input() value: SelectOption<T>;
  @Input() hideOptions: boolean = false;

  @Output() select: EventEmitter<DateFilterDropDownChange<T, D>> =
    new EventEmitter();
  @Output() toggleClick: EventEmitter<D> = new EventEmitter();

  selectedOption: SelectOption<T>;
  dropdownOpen: boolean = false;
  isActivated: boolean = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isClickInsideComponent(event)) {
      this.dropdownOpen = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes?.['options'] &&
      Array.isArray(this.options) &&
      this.options.length > 0
    ) {
      this.selectedOption = this.options[0];
    }
    if (changes?.['activatedName'] && this.activatedName) {
      this.isActivated = this.activatedName === this.name;
      if (
        !this.isActivated &&
        Array.isArray(this.options) &&
        this.options.length > 0
      ) {
        this.selectedOption = this.options[0];
      }
    }
    if (changes?.['hideOptions'] && this.hideOptions) {
      this.dropdownOpen = false;
    }

    if (changes?.['value'] || changes?.['name'] || changes?.['activatedName']) {
      this.updateSelectedOption();
    }
  }

  updateSelectedOption(): void {
    if (
      this.value &&
      this.name &&
      this.activatedName &&
      this.activatedName === this.name
    ) {
      this.selectedOption = this.value;
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
    this.toggleClick.emit(this.name);
  }

  onSelectValue(selected: SelectOption<T>): void {
    this.selectedOption = selected;
    this.isActivated = true;
    this.select.emit({ name: this.name, value: selected.value });
    this.dropdownOpen = false;
  }

  onDisplayValueClick(): void {
    if (this.isActivated) {
      this.dropdownOpen = !this.dropdownOpen;
    } else if (this.dropdownOpen) {
      this.dropdownOpen = false;
    }
    this.isActivated = true;
    this.select.emit({ name: this.name, value: this.selectedOption?.value });
  }

  onClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  private isClickInsideComponent(event: MouseEvent): boolean {
    const target = event.target as HTMLElement;
    return target.closest('.date-filter-drop-down') !== null;
  }
}
