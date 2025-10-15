import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-description-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './description-edit-modal.component.html',
  styleUrls: ['./description-edit-modal.component.scss']
})
export class DescriptionEditModalComponent {
  @Input() description: string = '';
  @Output() apply: EventEmitter<string> = new EventEmitter<string>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  localDescription = '';

  ngOnInit(): void {
    this.localDescription = this.description || '';
  }

  onBackdrop(): void {
    this.cancel.emit();
  }

  onApply(): void {
    this.apply.emit(this.localDescription?.trim() || '');
  }

  appendSuffix(mark: '!' | '?') {
    const trimmed = this.localDescription.trim();
    const suffix = `, ${mark}`;
    // Avoid double-adding same suffix at end
    if (trimmed.endsWith(suffix)) {
      return;
    }
    if (!trimmed) {
      this.localDescription = suffix.substring(2); // just mark without leading comma if empty
    } else {
      this.localDescription = trimmed + suffix;
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.cancel.emit();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      this.onApply();
    }
  }
}
