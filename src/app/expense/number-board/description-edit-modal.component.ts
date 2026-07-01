import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TagSelectorComponent } from '../../common/component/tag-selector/tag-selector.component';
import { normalizeTagIds } from '../../common/model/tag.model';

@Component({
  selector: 'app-description-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, TagSelectorComponent],
  templateUrl: './description-edit-modal.component.html',
  styleUrls: ['./description-edit-modal.component.scss']
})
export class DescriptionEditModalComponent implements OnInit {
  @Input() description: string = '';
  @Input() selectedTagIds: string[] = [];
  @Output() apply: EventEmitter<{ description: string; tagIds: string[] }> =
    new EventEmitter<{ description: string; tagIds: string[] }>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  localDescription = '';
  localSelectedTagIds: string[] = [];

  ngOnInit(): void {
    this.localDescription = this.description || '';
    this.localSelectedTagIds = normalizeTagIds(this.selectedTagIds) || [];
  }

  onBackdrop(): void {
    this.cancel.emit();
  }

  onApply(): void {
    this.apply.emit({
      description: this.localDescription?.trim() || '',
      tagIds: this.localSelectedTagIds,
    });
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
