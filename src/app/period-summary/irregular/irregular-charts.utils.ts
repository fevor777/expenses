import { Expense } from '../../common/model/expense.model';
import { Categories } from '../../common/model/categories';

export const IRREGULAR_CATEGORY_IDS = Categories.filter(
  c => c.includeInBalance
).map(c => c.id);

export function getIncudedInBudgetExpenses(expenses: Expense[]): Expense[] {
  return (expenses || []).filter(e => e.includeInBalance);
}
