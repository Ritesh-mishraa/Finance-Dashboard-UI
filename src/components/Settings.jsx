import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Download, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

const Settings = () => {
  const { transactions } = useFinance();
  const [exportSuccess, setExportSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify(transactions, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `finance-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (e) {
      console.error('Error exporting data', e);
    }
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all your data? This will clear your entire local storage history and cannot be undone.")) {
      localStorage.removeItem('finance_transactions');
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload(); // Reload the app to regenerate original mock data
      }, 1500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-forwards">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your application preferences and data</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 space-y-8 relative overflow-hidden">
        
        {/* Export Section */}
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl mt-1">
              <Download size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export Data</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-4 max-w-xl">
                Download a JSON copy of all your transaction records. This serves as a personal backup of your data.
              </p>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleExportData}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  Download JSON
                </button>
                {exportSuccess && (
                  <span className="flex items-center text-sm font-medium text-emerald-500 animate-in fade-in zoom-in">
                    <CheckCircle2 size={18} className="mr-1.5" />
                    Exported successfully
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-700 w-full" />

        {/* Reset Section */}
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl mt-1">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Danger Zone</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-4 max-w-xl">
                Factory reset will delete all custom transactions you've added and revert the app back to the initial mock data state.
              </p>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleResetData}
                  className="px-5 py-2.5 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 hover:border-rose-300 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800 dark:hover:bg-rose-900/40 rounded-xl font-medium transition-all"
                >
                  Factory Reset App
                </button>
                {resetSuccess && (
                  <span className="flex items-center text-sm font-medium text-rose-500 animate-pulse">
                    <RefreshCw size={18} className="mr-1.5 animate-spin" />
                    Resetting...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
