import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Expense } from './expense.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private expensesCollection;

  constructor(private fireStore: AngularFirestore) {
    this.expensesCollection = this.fireStore.collection<Expense>('expenses');
  }

  // Add expense
  addExpense(expense: Expense): Promise<void> {
    const id = this.fireStore.createId();
    return this.expensesCollection.doc(id).set({ ...expense, id });
  }

  // Get all expenses
  getExpenses(): Observable<Expense[]> {
    return this.expensesCollection.valueChanges({
      idField: 'id',
    }) as Observable<Expense[]>;
  }

  // Update expense
  updateExpense(expense: Expense): Promise<void> {
    return this.expensesCollection.doc(expense.id).update(expense);
  }

  // Delete expense
  deleteExpense(id: string): Promise<void> {
    return this.expensesCollection.doc(id).delete();
  }
}
