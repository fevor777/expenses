import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectOption } from '../../../model/select-option';
import { Mode } from '../dateFrame.model';

@Component({
  selector: 'app-date-filter-drop-down',
  templateUrl: './date-filter-drop-down.component.html',
  styleUrls: ['./date-filter-drop-down.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class DateFilterDropDownComponent<T> implements OnChanges, OnInit {
  @Input() options: SelectOption<T>[] = [];
  @Input() mode: Mode;
  @Input() activatedMode: Mode;
  @Input() defaultValue: SelectOption<T>;
  @Input() hideOptions: boolean = false;

  @Output() select: EventEmitter<T> = new EventEmitter();
  @Output() active: EventEmitter<Mode> = new EventEmitter();
  @Output() toggleClick: EventEmitter<Mode> = new EventEmitter();

  selectedOption: SelectOption<T>;
  dropdownOpen: boolean = false;
  isActivated: boolean = false;

  ngOnInit(): void {
    if (
      this.defaultValue &&
      this.mode &&
      this.activatedMode &&
      this.activatedMode === this.mode
    ) {
      this.selectedOption = this.defaultValue;
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
    if (changes?.['activatedMode'] && this.activatedMode) {
      this.isActivated = this.activatedMode === this.mode;
    }
    if (changes?.['hideOptions'] && this.hideOptions) {
      this.dropdownOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isClickInsideComponent(event)) {
      this.dropdownOpen = false;
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
    this.toggleClick.emit(this.mode);
  }

  onSelectValue(selected: SelectOption<T>): void {
    this.selectedOption = selected;
    this.select.emit(selected.value);
    this.isActivated = true;
    this.active.emit(this.mode);
    this.dropdownOpen = false;
  }

  onClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  onDisplayValueClick(): void {
    if (this.isActivated) {
      this.dropdownOpen = !this.dropdownOpen;
    } else if (this.dropdownOpen) {
      this.dropdownOpen = false;
    }
    this.isActivated = true;
    this.active.emit(this.mode);
    this.select.emit(this.selectedOption?.value);
  }

  private isClickInsideComponent(event: MouseEvent): boolean {
    const target = event.target as HTMLElement;
    return target.closest('.date-filter-drop-down') !== null;
  }
}
