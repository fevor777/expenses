import { Expense } from "../../common/expense.model";
import { DateTime } from "luxon";

export function getExpensesFromTo(expenses: any[], from: DateTime, to: DateTime, excludedCategories: string[] = []) {
  return expenses.filter((expense: Expense) => {
    const date = DateTime.fromMillis(expense.date);
    const isExcluded = excludedCategories.includes(expense.category);
    return date >= from && date <= to && !isExcluded;
  })
}
