export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: 'Income' | 'Expense';
  date: string;
  category: string;
  notes?: string;
}

export interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: number) => void;
}
