import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard } from '../features/inventorySlice';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import { Package, AlertTriangle, Cuboid, DollarSign } from 'lucide-react';

const COLORS = ['#1f8a42', '#28a745', '#34ce57', '#5cd67c', '#85e0a1', '#adebc6', '#d6f5e1'];

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboard, isLoading } = useSelector((state) => state.inventory);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (isLoading || !dashboard) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  const categoryData = Object.entries(dashboard.items_by_category).map(([name, value]) => ({ name, value }));
  const txData = dashboard.transaction_history || [];
  const weekVolume = txData.length > 0 
    ? txData.reduce((acc, curr) => acc + (parseFloat(curr.buy) || 0) + (parseFloat(curr.sell) || 0), 0).toFixed(0)
    : '0';

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Executive Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center space-x-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-full">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Inventory</p>
            <p className="text-3xl font-bold text-gray-900">{dashboard.total_items}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center space-x-4">
          <div className="p-4 bg-red-50 text-red-600 rounded-full">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Low Stock Alerts</p>
            <p className="text-3xl font-bold text-gray-900">{dashboard.low_stock_items}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center space-x-4">
          <div className="p-4 bg-yellow-50 text-yellow-600 rounded-full">
            <Cuboid className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Categories</p>
            <p className="text-3xl font-bold text-gray-900">{categoryData.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center space-x-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Week Volume</p>
            <p className="text-3xl font-bold text-gray-900">${weekVolume}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Stock Distribution</h2>
          <div className="h-80 w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} innerRadius={80} outerRadius={120} paddingAngle={2} dataKey="value">
                    {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">No data available</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">7-Day Transaction Flow</h2>
          <div className="h-80 w-full">
            {txData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={txData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1f8a42" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#1f8a42" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSell" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f5b041" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f5b041" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend iconType="circle" />
                  <Area type="monotone" dataKey="buy" name="Buy ($)" stroke="#1f8a42" strokeWidth={2} fillOpacity={1} fill="url(#colorBuy)" />
                  <Area type="monotone" dataKey="sell" name="Sell ($)" stroke="#f5b041" strokeWidth={2} fillOpacity={1} fill="url(#colorSell)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">No transaction data available</div>
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Category Volumes</h2>
          <div className="h-80 w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                  <RechartsTooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" name="Items" fill="#1f8a42" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">No data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
