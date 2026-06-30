import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { filter, from, map, Observable, of, switchMap, tap } from 'rxjs';

import { canonicalizeTag, normalizeTagName, Tag } from '../model/tag.model';
import { withUserId } from './with-user-id.helper';
import { TagStoreService } from './tag-store.service';
import { Expense } from '../model/expense.model';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private readonly tagsCollection;

  constructor(
    private fireStore: AngularFirestore,
    private tagStoreService: TagStoreService,
    private afAuth: AngularFireAuth
  ) {
    this.tagsCollection = this.fireStore.collection<Tag>('tags');
  }

  addTag(name: string): Observable<Tag> {
    const id = this.fireStore.createId();
    const tag = canonicalizeTag({ id, name });
    const fallback = () => this.tagStoreService.addTag(tag);
    fallback();
    const request = (uid: string) =>
      from(this.tagsCollection.doc(id).set({ ...tag, uid })).pipe(
        map(() => ({ ...tag, uid }))
      );
    return withUserId(this.afAuth, request, fallback, fallback);
  }

  getTags(useCache = true): Observable<Tag[]> {
    const fallback = () => this.tagStoreService.getTagsObs();
    const request = (uid: string) =>
      this.fireStore
        .collection<Tag>('tags', ref =>
          ref.where('uid', '==', uid).orderBy('normalizedName', 'asc')
        )
        .snapshotChanges()
        .pipe(
          filter(
            changes =>
              useCache ||
              changes.every(change => change.payload.doc.metadata.fromCache === false)
          ),
          map(changes =>
            changes
              .map(change =>
                canonicalizeTag({
                  id: change.payload.doc.id,
                  ...change.payload.doc.data(),
                })
              )
              .filter(tag => !!tag.id && !!tag.normalizedName)
          ),
          tap(tags => {
            localStorage.setItem('tags', JSON.stringify(tags));
          }),
          tap(tags => this.tagStoreService.setTags(tags))
        );
    return withUserId(this.afAuth, request, fallback, fallback);
  }

  updateTag(tag: Tag): Observable<Tag> {
    const canonicalTag = canonicalizeTag(tag);
    const fallback = () => this.tagStoreService.updateTag(canonicalTag);
    fallback();
    const request = () =>
      from(this.tagsCollection.doc(canonicalTag.id).update(canonicalTag)).pipe(
        map(() => canonicalTag)
      );
    return withUserId(this.afAuth, request, fallback, fallback);
  }

  deleteTag(id: string): Observable<string> {
    const fallback = () => {
      this.removeTagReferenceLocally(id);
      return this.tagStoreService.deleteTag(id);
    };
    fallback();
    const request = (uid: string) =>
      this.removeTagReferenceRemotely(uid, id).pipe(
        switchMap(() => from(this.tagsCollection.doc(id).delete()).pipe(map(() => id)))
      );
    return withUserId(this.afAuth, request, fallback, fallback);
  }

  normalizeName(name?: string): string {
    return normalizeTagName(name);
  }

  private removeTagReferenceLocally(tagId: string): void {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]') as Expense[];
    const updatedExpenses = expenses.map(expense => {
      const nextTagIds = (expense.tagIds || []).filter(id => id !== tagId);
      if (nextTagIds.length === 0) {
        const { tagIds: _tagIds, ...rest } = expense;
        return rest;
      }

      return {
        ...expense,
        tagIds: nextTagIds,
      };
    });
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
  }

  private removeTagReferenceRemotely(uid: string, tagId: string): Observable<void> {
    return from(
      this.fireStore
        .collection<Expense>('expenses', ref =>
          ref.where('uid', '==', uid).where('tagIds', 'array-contains', tagId)
        )
        .ref.get()
    ).pipe(
      switchMap(snapshot => {
        if (snapshot.empty) {
          return of(void 0);
        }

        return from(
          Promise.all(
            snapshot.docs.map(doc => {
              const data = doc.data() as Expense;
              const nextTagIds = (data.tagIds || []).filter(id => id !== tagId);
              return doc.ref.set(
                nextTagIds.length > 0
                  ? { ...data, tagIds: nextTagIds }
                  : { ...data, tagIds: [] },
                { merge: true }
              );
            })
          )
        ).pipe(map(() => void 0));
      })
    );
  }
}