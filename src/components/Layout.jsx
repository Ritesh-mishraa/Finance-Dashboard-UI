import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  PieChart, 
  Settings,
  Menu,
  Moon,
  Sun,
  UserCircle,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const SidebarItem = ({ icon: Icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      isActive 
        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const Layout = ({ children, activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode, toggleDarkMode, role, toggleRole } = useFinance();

  const handleNav = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-200">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-500">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <PieChart size={24} />
            </div>
            <span className="text-xl font-bold mt-1 text-gray-900 dark:text-white tracking-tight">FinDash</span>
          </div>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          <SidebarItem icon={LayoutDashboard} label="Overview" isActive={activeTab === 'Overview'} onClick={() => handleNav('Overview')} />
          <SidebarItem icon={ArrowRightLeft} label="Transactions" isActive={activeTab === 'Transactions'} onClick={() => handleNav('Transactions')} />
          <SidebarItem icon={PieChart} label="Insights" isActive={activeTab === 'Insights'} onClick={() => handleNav('Insights')} />
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
            <SidebarItem icon={Settings} label="Settings" isActive={activeTab === 'Settings'} onClick={() => handleNav('Settings')} />
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0">
          <button 
            className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex-1" />

          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Role Switcher */}
            <button
              onClick={toggleRole}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              title="Toggle Role"
            >
              {role === 'admin' ? (
                <ShieldCheck size={16} className="text-blue-600 dark:text-blue-400" />
              ) : (
                <ShieldAlert size={16} className="text-gray-500 dark:text-gray-400" />
              )}
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                {role}
              </span>
            </button>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* User Profile */}
            <div className="flex items-center space-x-2 pl-2 sm:pl-4 border-l border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
              <UserCircle size={28} className="text-gray-400" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
