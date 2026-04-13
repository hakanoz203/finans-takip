import { useState, useMemo } from 'react';
import type { Transaction, Summary } from '../types';
import { dummyTransactions } from '../data/dummyData';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(dummyTransactions);

  const summary: Summary = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { totalIncome, totalExpense, netBalance: totalIncome - totalExpense };
  }, [transactions]);

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [
      { ...tx, id: crypto.randomUUID() },
      ...prev,
    ]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const chartData = useMemo(() => {
    const expenseByCategory: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
      });
    return expenseByCategory;
  }, [transactions]);

  const incomeChartData = useMemo(() => {
    const incomeByCategory: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'income')
      .forEach(t => {
        incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount;
      });
    return incomeByCategory;
  }, [transactions]);

  return { transactions, summary, addTransaction, deleteTransaction, chartData, incomeChartData };
}
