import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import type { AppConfig } from '../config.js';

export function getFirestoreClient(config: AppConfig): Firestore {
  if (!getApps().length) {
    initializeApp({
      credential: applicationDefault(),
      projectId: config.firebaseProjectId,
    });
  }

  return getFirestore();
}