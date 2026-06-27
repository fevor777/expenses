import type { Firestore, Query } from 'firebase-admin/firestore';
import { FieldPath } from 'firebase-admin/firestore';
import {
  applyDescriptionFilter,
  type NormalizedExpenseFilter,
} from '../domain/filters.js';
import {
  canonicalizeExpense,
  type CreateExpenseInput,
  type ExpenseDocument,
  type UpdateExpenseInput,
} from '../domain/models.js';

export class ExpensesRepository {
  constructor(
    private readonly firestore: Firestore,
    private readonly ownerUid: string
  ) {}

  async list(filter: NormalizedExpenseFilter): Promise<ExpenseDocument[]> {
    let query = this.baseQuery();

    if (filter.startDate !== undefined && filter.endDate !== undefined) {
      query = query
        .where('date', '>=', filter.startDate)
        .where('date', '<=', filter.endDate);
    }

    if (filter.categories.length > 0) {
      query = query.where('category', 'in', filter.categories);
    }

    query = query.orderBy('date', filter.sort);

    if (!filter.description) {
      query = query.limit(filter.limit);
    }

    const snapshot = await query.get();
    const expenses = snapshot.docs.map(document => this.mapExpense(document.id, document.data()));
    const filteredByDescription = applyDescriptionFilter(expenses, filter.description);

    return filteredByDescription.slice(0, filter.limit);
  }

  async listInRange(startDate: number, endDate: number): Promise<ExpenseDocument[]> {
    const snapshot = await this.baseQuery()
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .orderBy('date', 'desc')
      .get();

    return snapshot.docs.map(document => this.mapExpense(document.id, document.data()));
  }

  async getById(id: string): Promise<ExpenseDocument | null> {
    const document = await this.firestore.collection('expenses').doc(id).get();
    if (!document.exists) {
      return null;
    }

    const expense = this.mapExpense(document.id, document.data());
    return expense.uid === this.ownerUid ? expense : null;
  }

  async create(input: CreateExpenseInput): Promise<ExpenseDocument> {
    const reference = this.firestore.collection('expenses').doc();
    const expense = canonicalizeExpense({
      id: reference.id,
      uid: this.ownerUid,
      ...input,
    });

    await reference.set(expense);
    return expense;
  }

  async update(input: UpdateExpenseInput): Promise<ExpenseDocument> {
    const existing = await this.getById(input.id);
    if (!existing) {
      throw new Error(`Expense ${input.id} not found`);
    }

    const updatedExpense = canonicalizeExpense({
      ...existing,
      ...input,
      id: existing.id,
      uid: this.ownerUid,
    });

    await this.firestore.collection('expenses').doc(existing.id).set(updatedExpense);
    return updatedExpense;
  }

  async delete(id: string): Promise<string> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`Expense ${id} not found`);
    }

    await this.firestore.collection('expenses').doc(existing.id).delete();
    return existing.id;
  }

  private baseQuery(): Query {
    return this.firestore.collection('expenses').where('uid', '==', this.ownerUid);
  }

  private mapExpense(
    id: string,
    rawValue: FirebaseFirestore.DocumentData | undefined
  ): ExpenseDocument {
    const value = rawValue ?? {};
    return canonicalizeExpense({
      id,
      uid: String(value.uid ?? this.ownerUid),
      amount: Number(value.amount ?? 0),
      category: value.category,
      currency: String(value.currency ?? 'EUR'),
      date: Number(value.date ?? 0),
      description:
        typeof value.description === 'string' ? value.description : undefined,
      includeInBalance:
        typeof value.includeInBalance === 'boolean'
          ? value.includeInBalance
          : undefined,
    });
  }
}