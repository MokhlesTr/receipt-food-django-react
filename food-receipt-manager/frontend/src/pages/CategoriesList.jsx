import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/categories/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      });
      setCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (category) => {
    if (category.item_count > 0) {
      toast.error('Cannot delete category because it is being used by inventory items.');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete ${category.name}?`)) {
      try {
        await axios.delete(`${API_URL}/categories/${category.id}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
        });
        toast.success('Category deleted successfully');
        fetchCategories();
      } catch (e) {
        toast.error('Failed to delete category');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Categories</h1>
        <Link to="/categories/new" className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm font-medium">
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Category
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm tracking-wider">Name</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm tracking-wider">Description</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-3">
                    <Link to={`/categories/edit/${item.id}`} className="text-blue-600 hover:text-blue-900 font-medium inline-flex items-center">
                      <Edit2 className="w-4 h-4 mr-1" /> Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(item)}
                      className={`${item.item_count > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-900'} font-medium inline-flex items-center transition-colors`}
                      title={item.item_count > 0 ? "Cannot delete: category in use" : "Delete category"}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CategoriesList;
