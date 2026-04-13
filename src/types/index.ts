export type TransactionType = 'income' | 'expense';

export type Category =
  | 'Maaş' | 'Freelance' | 'Yatırım' | 'Diğer Gelir'
  | 'Kira' | 'Market' | 'Ulaşım' | 'Sağlık'
  | 'Eğlence' | 'Faturalar' | 'Yemek' | 'Diğer Gider';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  description: string;
  date: string; // ISO string
}

export interface Summary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}
