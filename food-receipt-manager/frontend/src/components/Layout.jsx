import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { LogOut, LayoutDashboard, PackageSearch, PlusCircle, Menu, X, Moon, Sun, Beef, ListTree, ArrowRightLeft } from 'lucide-react';

const Layout = ({ toggleTheme, isDarkMode }) => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  if (!token) return <Navigate to="/login" replace />;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/inventory', label: 'Stock Items', icon: PackageSearch },
    { path: '/categories', label: 'Categories', icon: ListTree },
    { path: '/transactions', label: 'Transactions', icon: ArrowRightLeft },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black transition-colors duration-200">
      <aside className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-[#111111] shadow-xl transform transition-all duration-300 ease-in-out md:relative ${isSidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}`}>
        <div className="flex items-center justify-between p-6 h-20">
          {isSidebarOpen ? (
            <img src="https://al-makhzan.com/Logo%20Al-makhzen.png" alt="Al-makhzen Logo" className="h-12 w-auto" />
          ) : (
            <img src="https://al-makhzan.com/Logo%20Al-makhzen.png" alt="Al-makhzen Logo" className="h-10 w-10 mx-auto object-contain" />
          )}
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500 dark:text-gray-400">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="mt-6 flex flex-col h-[calc(100vh-180px)] overflow-y-auto">
          {navLinks.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              title={label}
              className={`flex items-center px-6 py-4 transition-all duration-200 ${
                location.pathname.startsWith(path) 
                  ? 'bg-green-50 dark:bg-gray-700 text-primary border-r-4 border-primary font-medium' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <Icon className={`w-6 h-6 flex-shrink-0 ${location.pathname.startsWith(path) ? 'text-primary' : 'text-gray-400'} ${!isSidebarOpen && 'mx-auto'}`} />
              {isSidebarOpen && <span className="ml-3 truncate">{label}</span>}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 bg-white dark:bg-[#111111]">
          <button
            onClick={() => dispatch(logout())}
            title="Sign Out"
            className={`flex items-center w-full py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium ${isSidebarOpen ? 'px-4' : 'justify-center'}`}
          >
            <LogOut className="w-6 h-6 flex-shrink-0" />
            {isSidebarOpen && <span className="ml-3">Sign Out</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white dark:bg-[#111111] flex items-center justify-between px-4 sm:px-6 z-10">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-500 hover:bg-gray-100 p-2 rounded-md">
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1"></div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
      
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
