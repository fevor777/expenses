export class Expense {
  id?: string;
  uid?: string;
  amount: number;
  category: string;
  currency: string;
  date: number;
  isDeletedFromBalance?: boolean;
}
