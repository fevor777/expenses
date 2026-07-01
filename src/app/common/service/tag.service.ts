import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import {
  catchError,
  filter,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

import { canonicalizeTag, normalizeTagName, Tag } from '../model/tag.model';
import { withUserId } from './with-user-id.helper';
import { TagStoreService } from './tag-store.service';
import { Expense } from '../model/expense.model';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private readonly deletedTagIdsStorageKey = 'deletedTagIds';
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
    this.unmarkTagDeleted(id);
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
              .filter(change => {
                const data = change.payload.doc.data() as Tag & {
                  deleted?: boolean;
                  deletedAt?: number;
                };
                return data?.deleted !== true && data?.deletedAt == null;
              })
              .map(change =>
                canonicalizeTag({
                  id: change.payload.doc.id,
                  ...change.payload.doc.data(),
                })
              )
              .filter(tag => !!tag.id && !!tag.normalizedName)
                .filter(tag => !this.getDeletedTagIds().has(tag.id))
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
    const strictFallback = () =>
      throwError(
        () =>
          new Error(
            'Strict hard-delete requires authenticated remote access and successful Firestore deletion.'
          )
      );

    const request = (uid: string) =>
      from(this.tagsCollection.doc(id).delete()).pipe(
        map(() => id),
        switchMap(deletedId =>
          this.removeTagReferenceRemotely(uid, deletedId).pipe(
            // Post-delete cleanup is best-effort and must not block delete success.
            catchError(error => {
              console.warn('Failed to remove tag references after hard delete', {
                tagId: deletedId,
                error,
              });
              return of(void 0);
            }),
            map(() => deletedId)
          )
        )
      );
    return withUserId(this.afAuth, request, strictFallback, strictFallback).pipe(
      switchMap(deletedId => {
        this.markTagDeleted(deletedId);
        this.removeTagReferenceLocally(deletedId);
        return this.tagStoreService.deleteTag(deletedId);
      })
    );
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

        const commitPromises: Promise<void>[] = [];
        const batchSize = 500;

        for (let index = 0; index < snapshot.docs.length; index += batchSize) {
          const batch = this.fireStore.firestore.batch();
          const docs = snapshot.docs.slice(index, index + batchSize);

          docs.forEach(doc => {
              const data = doc.data() as Expense;
              const nextTagIds = (data.tagIds || []).filter(id => id !== tagId);
              batch.update(
                doc.ref,
                nextTagIds.length > 0
                  ? { tagIds: nextTagIds }
                  : { tagIds: firebase.firestore.FieldValue.delete() }
              );
            });

          commitPromises.push(batch.commit().then(() => void 0));
        }

        return from(Promise.all(commitPromises)).pipe(map(() => void 0));
      })
    );
  }

  private getDeletedTagIds(): Set<string> {
    const raw = JSON.parse(localStorage.getItem(this.deletedTagIdsStorageKey) || '[]') as string[];
    return new Set(raw.filter(Boolean));
  }

  private markTagDeleted(id: string): void {
    const deletedIds = this.getDeletedTagIds();
    deletedIds.add(id);
    localStorage.setItem(this.deletedTagIdsStorageKey, JSON.stringify(Array.from(deletedIds)));
  }

  private unmarkTagDeleted(id: string): void {
    const deletedIds = this.getDeletedTagIds();
    if (!deletedIds.has(id)) {
      return;
    }
    deletedIds.delete(id);
    localStorage.setItem(this.deletedTagIdsStorageKey, JSON.stringify(Array.from(deletedIds)));
  }
}