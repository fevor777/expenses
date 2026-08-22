import type { Firestore } from 'firebase-admin/firestore';
import {
  canonicalizeBudget,
  DEFAULT_BUDGET,
  roundCurrency,
  type BudgetDocument,
  type UpdateBudgetInput,
} from '../domain/models.js';

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

    return canonicalizeBudget({
      uid: this.ownerUid,
      value: Number(value.value ?? DEFAULT_BUDGET.value),
      period: Number(value.period ?? DEFAULT_BUDGET.period),
      ...(value.periodStartTs !== undefined
        ? { periodStartTs: Number(value.periodStartTs) }
        : {}),
      ...(value.timezone !== undefined
        ? { timezone: String(value.timezone).trim() }
        : {}),
      ...(value.minDayLimit !== undefined
        ? { minDayLimit: Number(value.minDayLimit) }
        : {}),
      ...(Array.isArray(value.limits)
        ? {
            limits: value.limits.map((limit: Record<string, unknown>) => ({
              id: String(limit.id ?? ''),
              type:
                limit.type === 'category' || limit.type === 'tag'
                  ? limit.type
                  : 'category',
              targetId: String(limit.targetId ?? ''),
              value: Number(limit.value),
            })),
          }
        : {}),
    });
  }

  async updateBudget(input: UpdateBudgetInput): Promise<BudgetDocument> {
    const existing = await this.getBudget();
    const budget = canonicalizeBudget({
      uid: this.ownerUid,
      value: input.value ?? existing?.value ?? DEFAULT_BUDGET.value,
      period: input.period ?? existing?.period ?? DEFAULT_BUDGET.period,
      ...(input.periodStartTs !== undefined
        ? { periodStartTs: input.periodStartTs }
        : existing?.periodStartTs !== undefined
          ? { periodStartTs: existing.periodStartTs }
          : {}),
      ...(input.timezone !== undefined
        ? { timezone: input.timezone }
        : existing?.timezone !== undefined
          ? { timezone: existing.timezone }
          : {}),
      ...(input.minDayLimit !== undefined
        ? { minDayLimit: input.minDayLimit }
        : existing?.minDayLimit !== undefined
          ? { minDayLimit: existing.minDayLimit }
          : {}),
      ...(input.limits !== undefined
        ? { limits: input.limits }
        : existing?.limits !== undefined
          ? { limits: existing.limits }
          : {}),
    });

    await this.firestore
      .collection('irregularBudget')
      .doc(this.ownerUid)
      .set(budget);

    return budget;
  }

  async getSavings(): Promise<number> {
    const document = await this.firestore.collection('savings').doc(this.ownerUid).get();
    if (!document.exists) {
      return 0;
    }

    return roundCurrency(Number(document.data()?.value ?? 0));
  }

  async updateSavings(value: number): Promise<number> {
    const savings = roundCurrency(value);

    await this.firestore.collection('savings').doc(this.ownerUid).set({
      uid: this.ownerUid,
      value: savings,
    });

    return savings;
  }
}
