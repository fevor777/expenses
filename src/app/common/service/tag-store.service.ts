import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { canonicalizeTag, Tag } from '../model/tag.model';

@Injectable({
  providedIn: 'root',
})
export class TagStoreService {
  private readonly storageKey = 'tags';
  private readonly tagsSubject = new BehaviorSubject<Tag[]>([]);
  readonly tags$ = this.tagsSubject.asObservable();

  getTags(): Tag[] {
    return this.tagsSubject.value;
  }

  getTagsObs(): Observable<Tag[]> {
    const tags = this.readTags();
    this.setTags(tags);
    return this.tags$;
  }

  addTag(tag: Tag): Observable<Tag> {
    const tags = [canonicalizeTag(tag), ...this.readTags().filter(item => item.id !== tag.id)];
    this.persistTags(tags);
    return of(canonicalizeTag(tag));
  }

  updateTag(tag: Tag): Observable<Tag> {
    const canonicalTag = canonicalizeTag(tag);
    const tags = this.readTags().map(item =>
      item.id === canonicalTag.id ? canonicalTag : item
    );
    this.persistTags(tags);
    return of(canonicalTag);
  }

  deleteTag(id: string): Observable<string> {
    const tags = this.readTags().filter(tag => tag.id !== id);
    this.persistTags(tags);
    return of(id);
  }

  setTags(tags: Tag[]): void {
    this.tagsSubject.next(tags);
  }

  private readTags(): Tag[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]')
      .map((tag: Tag) => canonicalizeTag(tag))
      .filter((tag: Tag) => !!tag.id && !!tag.normalizedName)
      .sort((left: Tag, right: Tag) =>
        left.normalizedName.localeCompare(right.normalizedName)
      );
  }

  private persistTags(tags: Tag[]): void {
    const normalized = tags
      .map(tag => canonicalizeTag(tag))
      .filter(tag => !!tag.id && !!tag.normalizedName)
      .sort((left, right) => left.normalizedName.localeCompare(right.normalizedName));
    localStorage.setItem(this.storageKey, JSON.stringify(normalized));
    this.setTags(normalized);
  }
}