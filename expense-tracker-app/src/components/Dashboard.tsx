'use client';

import { useTransactions } from '@/context/TransactionContext';

const Dashboard = () => {
  const { transactions } = useTransactions();

  const totalBalance = transactions.reduce((acc, transaction) => {
    return transaction.type === 'Income' ? acc + transaction.amount : acc - transaction.amount;
  }, 0);

  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'Income')
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === 'Expense')
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-300">Total Balance</h3>
          <p className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${totalBalance.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-300">Total Income</h3>
          <p className="text-2xl font-bold text-green-500">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-300">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-500">${totalExpenses.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
