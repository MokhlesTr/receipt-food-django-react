import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ArrowLeft, Save } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const ItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '', category: '', quantity: '', unit: '', min_stock_level: '', expiration_date: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/categories/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
    }).then(res => setCategories(res.data)).catch(console.error);

    if (isEditMode) {
      axios.get(`${API_URL}/inventory/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      }).then(res => setFormData(res.data)).catch(() => {
        toast.error('Failed to fetch details');
        navigate('/inventory');
      });
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('access')}` };
      if (isEditMode) {
        await axios.put(`${API_URL}/inventory/${id}/`, formData, { headers });
        toast.success('Item updated');
      } else {
        await axios.post(`${API_URL}/inventory/`, formData, { headers });
        toast.success('Item added');
      }
      navigate('/inventory');
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/inventory')} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{isEditMode ? 'Edit Item' : 'Add Item'}</h1>
      </div>

      <div className="bg-white dark:bg-[#111111] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-[#27272a]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Name</label>
              <input type="text" name="name" required className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-[#27272a] rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:text-white transition-all" value={formData.name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <select name="category" required className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-[#27272a] rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:text-white transition-all" value={formData.category} onChange={handleChange}>
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
              <input type="number" step="0.01" name="quantity" required className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-[#27272a] rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:text-white transition-all" value={formData.quantity} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit (e.g. kg, boxes)</label>
              <input type="text" name="unit" required className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-[#27272a] rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:text-white transition-all" value={formData.unit} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Min Stock Level</label>
              <input type="number" step="0.01" name="min_stock_level" required className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-[#27272a] rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:text-white transition-all" value={formData.min_stock_level} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expiration Date</label>
              <input type="date" name="expiration_date" className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-[#27272a] rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:text-white transition-all" value={formData.expiration_date} onChange={handleChange} />
            </div>
          </div>
          
          <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-[#27272a]">
            <button type="submit" disabled={isLoading} className="flex items-center px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50">
              <Save className="w-5 h-5 mr-2" />
              {isLoading ? 'Saving...' : 'Save Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;
