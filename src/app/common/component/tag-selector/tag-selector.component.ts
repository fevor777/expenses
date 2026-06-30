import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Tag, normalizeTagIds } from '../../model/tag.model';
import { TagService } from '../../service/tag.service';

@Component({
  selector: 'app-tag-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tag-selector.component.html',
  styleUrls: ['./tag-selector.component.scss'],
})
export class TagSelectorComponent implements OnChanges {
  @Input() selectedTagIds: string[] = [];
  @Input() label = 'Tags';
  @Input() emptyLabel = 'No tags created yet';
  @Input() allowClear = true;
  @Input() compact = false;
  @Input() hideLabel = false;
  @Input() inline = false;
  @Input() starredOnly = false;

  @Output() selectedTagIdsChange = new EventEmitter<string[]>();

  tags: Tag[] = [];
  localSelectedTagIds: string[] = [];

  constructor(private tagService: TagService) {
    this.tagService.getTags().subscribe(tags => {
      this.tags = tags || [];
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedTagIds']) {
      this.localSelectedTagIds = normalizeTagIds(this.selectedTagIds) || [];
    }
  }

  get visibleTags(): Tag[] {
    if (!this.starredOnly) {
      return this.tags;
    }

    return this.tags.filter(tag => tag.star === true);
  }

  isSelected(tagId?: string): boolean {
    return !!tagId && this.localSelectedTagIds.includes(tagId);
  }

  toggleTag(tagId?: string): void {
    if (!tagId) {
      return;
    }

    if (this.localSelectedTagIds.includes(tagId)) {
      this.localSelectedTagIds = this.localSelectedTagIds.filter(id => id !== tagId);
    } else {
      this.localSelectedTagIds = [...this.localSelectedTagIds, tagId];
    }

    this.emitSelection();
  }

  clearSelection(): void {
    this.localSelectedTagIds = [];
    this.emitSelection();
  }

  private emitSelection(): void {
    this.localSelectedTagIds = normalizeTagIds(this.localSelectedTagIds) || [];
    this.selectedTagIdsChange.emit(this.localSelectedTagIds);
  }
}