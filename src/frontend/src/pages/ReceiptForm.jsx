import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ArrowLeft, Save } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const ReceiptForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    store_name: '',
    category: '',
    amount: '',
    purchase_date: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchReceipt = async () => {
        try {
          const token = localStorage.getItem('access');
          const response = await axios.get(`${API_URL}/receipts/${id}/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const { store_name, category, amount, purchase_date, notes } = response.data;
          setFormData({ store_name, category, amount, purchase_date, notes: notes || '' });
        } catch (error) {
          toast.error('Failed to fetch receipt details');
          navigate('/receipts');
        }
      };
      fetchReceipt();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access');
      const headers = { Authorization: `Bearer ${token}` };
      
      if (isEditMode) {
        await axios.put(`${API_URL}/receipts/${id}/`, formData, { headers });
        toast.success('Receipt updated successfully');
      } else {
        await axios.post(`${API_URL}/receipts/`, formData, { headers });
        toast.success('Receipt added successfully');
      }
      navigate('/receipts');
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/receipts')} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">{isEditMode ? 'Edit Receipt' : 'Add New Receipt'}</h1>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Store Name</label>
              <input
                type="text"
                name="store_name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                value={formData.store_name}
                onChange={handleChange}
                placeholder="e.g. Whole Foods"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                name="category"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Groceries"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                name="amount"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
              <input
                type="date"
                name="purchase_date"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                value={formData.purchase_date}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
            <textarea
              name="notes"
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional details..."
            ></textarea>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50"
            >
              <Save className="w-5 h-5 mr-2" />
              {isLoading ? 'Saving...' : 'Save Receipt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReceiptForm;
