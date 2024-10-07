import { Expense } from "../../common/expense.model";
import { DateTime } from "luxon";

export function getExpensesFromTo(expenses: any[], from: DateTime, to: DateTime) {
  return expenses.filter((expense: Expense) => {
    const date = DateTime.fromMillis(expense.date);
    return date >= from && date <= to
  })
}
