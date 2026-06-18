import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const TransactionsList = () => {
  const [txs, setTxs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTxs();
  }, []);

  const fetchTxs = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/transactions/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      });
      setTxs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transaction History</h1>
        <Link to="/transactions/new" className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm font-medium">
          <ArrowUpRight className="w-5 h-5 mr-2" />
          Log Transaction
        </Link>
      </div>

      <div className="bg-white dark:bg-[#111111] rounded-2xl shadow-sm border border-gray-100 dark:border-[#27272a] overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400 text-sm tracking-wider">Date</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400 text-sm tracking-wider">Type</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400 text-sm tracking-wider">Item</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400 text-sm tracking-wider text-right">Qty</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400 text-sm tracking-wider text-right">Total ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {txs.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {tx.transaction_type === 'BUY' ? (
                      <span className="flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded w-max text-xs font-bold"><ArrowDownLeft className="w-3 h-3 mr-1"/> BUY</span>
                    ) : (
                      <span className="flex items-center text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded w-max text-xs font-bold"><ArrowUpRight className="w-3 h-3 mr-1"/> SELL</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{tx.item_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium dark:text-gray-300">{tx.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold dark:text-gray-300">${tx.total_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransactionsList;
