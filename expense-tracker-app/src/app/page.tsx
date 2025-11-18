import Dashboard from '@/components/Dashboard';
import AddTransaction from '@/components/AddTransaction';
import TransactionList from '@/components/TransactionList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-bold text-center mb-8">Expense Tracker</h1>
        <Dashboard />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <AddTransaction />
          <TransactionList />
        </div>
      </main>
    </div>
  );
}
