'use client';

import { useState } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import Tesseract from 'tesseract.js';

const AddTransaction = () => {
  const { addTransaction } = useTransactions();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'Income' | 'Expense'>('Expense');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [receipt, setReceipt] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [ocrText, setOcrText] = useState('');

  const parseOcrText = (text: string) => {
    const lines = text.split('\n');

    // Find vendor (heuristic: first non-empty line)
    const vendor = lines.find(line => line.trim() !== '') || 'Unknown Vendor';

    // Find date (more robust regex for various formats)
    const dateRegex = /(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})|(\d{4}[./-]\d{1,2}[./-]\d{1,2})/;
    const dateMatch = text.match(dateRegex);
    let date = dateMatch ? dateMatch[0].replace(/[./]/g, '-') : '';
    // Basic normalization to yyyy-mm-dd
    if (date) {
      const parts = date.split('-');
      if (parts[2].length === 2) parts[2] = `20${parts[2]}`;
      if (parts[0].length !== 4) { // Assuming mm-dd-yyyy or dd-mm-yyyy
        date = [parts[2], parts[0], parts[1]].join('-'); // Defaulting to mm-dd-yyyy for simplicity
      }
    }


    // Find total amount (heuristic: find the largest number, especially near "Total")
    const amountRegex = /([\d,]+\.\d{2})/g;
    const amountMatches = text.match(amountRegex);
    let amount = '0.00';
    if (amountMatches) {
      const amounts = amountMatches.map(m => parseFloat(m.replace(',', '')));
      amount = Math.max(...amounts).toFixed(2);
    }

    setTitle(vendor);
    if (date) setDate(date);
    setAmount(amount);

    alert(`Receipt scanned!\nVendor: ${vendor}\nDate: ${date}\nAmount: ${amount}`);
  };

  const handleScanReceipt = async () => {
    if (!receipt) return;
    setIsScanning(true);
    setOcrText('');
    try {
      const { data: { text } } = await Tesseract.recognize(receipt, 'eng');
      setOcrText(text);
      parseOcrText(text);
    } catch (error) {
      console.error('Error scanning receipt:', error);
      alert('Failed to scan receipt. See console for details.');
    }
    setIsScanning(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !date || !category) {
      alert('Please fill in all fields');
      return;
    }

    addTransaction({
      title,
      amount: parseFloat(amount),
      type,
      date,
      category,
      notes,
    });

    setTitle('');
    setAmount('');
    setType('Expense');
    setDate('');
    setCategory('');
    setNotes('');
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold text-white mb-4">Add New Transaction</h2>
      <div className="mb-4">
        <label className="block text-gray-300 mb-2" htmlFor="receipt">
          Scan Receipt
        </label>
        <div className="flex items-center">
          <input
            type="file"
            id="receipt"
            onChange={(e) => setReceipt(e.target.files ? e.target.files[0] : null)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            accept="image/*"
            capture="environment"
          />
          <button
            onClick={handleScanReceipt}
            className="ml-4 bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
            disabled={!receipt || isScanning}
          >
            {isScanning ? 'Scanning...' : 'Scan'}
          </button>
        </div>
      </div>
      {ocrText && (
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Scanned Text (for debugging)</label>
          <pre className="bg-gray-700 p-2 rounded text-white text-xs whitespace-pre-wrap">
            {ocrText}
          </pre>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2" htmlFor="amount">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2" htmlFor="type">
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as 'Income' | 'Expense')}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2" htmlFor="date">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2" htmlFor="category">
            Category
          </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;
