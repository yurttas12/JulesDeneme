'use client';

import { useTransactions } from '@/context/TransactionContext';

const TransactionList = () => {
  const { transactions, deleteTransaction } = useTransactions();

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold text-white mb-4">Recent Transactions</h2>
      <ul>
        {transactions.map((transaction) => (
          <li
            key={transaction.id}
            className={`flex justify-between items-center p-4 rounded-lg mb-2 ${
              transaction.type === 'Income' ? 'bg-green-900' : 'bg-red-900'
            }`}
          >
            <div>
              <p className="font-bold text-white">{transaction.title}</p>
              <p className="text-gray-400">
                {transaction.date} - <span className="font-semibold">{transaction.category}</span>
              </p>
              {transaction.notes && <p className="text-gray-500 text-sm italic mt-1">{transaction.notes}</p>}
            </div>
            <div className="flex items-center">
              <p
                className={`text-xl font-bold ${
                  transaction.type === 'Income' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {transaction.type === 'Income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </p>
              <button
                onClick={() => deleteTransaction(transaction.id)}
                className="ml-4 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
