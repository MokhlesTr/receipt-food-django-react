import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ArrowLeft, Save } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const TransactionForm = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ item: '', transaction_type: 'BUY', quantity: '', price_per_unit: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/inventory/`, { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } })
      .then(res => setItems(res.data)).catch(console.error);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.transaction_type === 'SELL') {
      const selectedItem = items.find(i => i.id === parseInt(formData.item));
      if (selectedItem && parseFloat(formData.quantity) > parseFloat(selectedItem.quantity)) {
        toast.error(`Cannot sell more than available quantity (${selectedItem.quantity} ${selectedItem.unit})`);
        return;
      }
    }

    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/transactions/`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      });
      toast.success('Transaction logged successfully');
      navigate('/transactions');
    } catch {
      toast.error('Failed to log transaction');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/transactions')} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Record Transaction</h1>
      </div>

      <div className="bg-white dark:bg-[#111111] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-[#27272a]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item</label>
            <select name="item" required className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-[#27272a] rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white" value={formData.item} onChange={handleChange}>
              <option value="">Select an Item</option>
              {items.map(i => <option key={i.id} value={i.id}>{i.name} ({i.quantity} {i.unit} available)</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Transaction Type</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input type="radio" name="transaction_type" value="BUY" checked={formData.transaction_type === 'BUY'} onChange={handleChange} className="text-primary focus:ring-primary" />
                <span className="dark:text-white">BUY (Stock In)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="transaction_type" value="SELL" checked={formData.transaction_type === 'SELL'} onChange={handleChange} className="text-primary focus:ring-primary" />
                <span className="dark:text-white">SELL (Stock Out)</span>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
              <input type="number" step="0.01" name="quantity" required className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-[#27272a] rounded-xl outline-none dark:text-white" value={formData.quantity} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price Per Unit ($)</label>
              <input type="number" step="0.01" name="price_per_unit" required className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-[#27272a] rounded-xl outline-none dark:text-white" value={formData.price_per_unit} onChange={handleChange} />
            </div>
          </div>
          
          <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-[#27272a]">
            <button type="submit" disabled={isLoading} className="flex items-center px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50">
              <Save className="w-5 h-5 mr-2" />
              {isLoading ? 'Processing...' : 'Submit Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
