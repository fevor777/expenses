import { Expense } from '../common/model/expense.model';

export type HistoryExpense = Expense & {
  showDateTitle: boolean;
  amountPerDay: number;
};
