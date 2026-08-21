import { Expense } from '../../common/model/expense.model';

export function getIncudedInBudgetExpenses(expenses: Expense[]): Expense[] {
  return (expenses || []).filter(e => e.includeInBalance);
}
