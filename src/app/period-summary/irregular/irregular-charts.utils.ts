import { Expense } from '../../common/model/expense.model';
import { Categories } from '../../common/model/categories';

export const IRREGULAR_CATEGORY_IDS = Categories.filter(
  c => c.includeInBalance
).map(c => c.id);

export function filterIrregular(expenses: Expense[]): Expense[] {
  const set = new Set(IRREGULAR_CATEGORY_IDS);
  return (expenses || []).filter(e => set.has(e.category));
}
