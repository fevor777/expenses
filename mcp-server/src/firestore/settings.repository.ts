import type { Firestore } from 'firebase-admin/firestore';
import type { BudgetDocument } from '../domain/models.js';

export class SettingsRepository {
  constructor(
    private readonly firestore: Firestore,
    private readonly ownerUid: string
  ) {}

  async getBudget(): Promise<BudgetDocument | null> {
    const document = await this.firestore
      .collection('irregularBudget')
      .doc(this.ownerUid)
      .get();

    if (!document.exists) {
      return null;
    }

    const value = document.data() ?? {};

    return {
      uid: this.ownerUid,
      value: Number(value.value ?? 0),
      period: Number(value.period ?? 30),
      ...(value.periodStartTs !== undefined
        ? { periodStartTs: Number(value.periodStartTs) }
        : {}),
      ...(value.minDayLimit !== undefined
        ? { minDayLimit: Number(value.minDayLimit) }
        : {}),
    };
  }

  async getSavings(): Promise<number> {
    const document = await this.firestore.collection('savings').doc(this.ownerUid).get();
    if (!document.exists) {
      return 0;
    }

    return Number(document.data()?.value ?? 0);
  }
}