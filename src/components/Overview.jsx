import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';

// Modern, harmonious color palette
const PIE_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316', '#eab308', '#10b981'];

const SummaryCard = ({ title, amount, icon: Icon, trend, trendValue, colorClass }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>
        <div className={`p-4 rounded-xl ${colorClass}`}>
          <Icon size={24} />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`font-medium flex items-center ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trend === 'up' ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
            {trendValue}%
          </span>
          <span className="text-gray-400 ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
};

const Overview = () => {
  const { transactions } = useFinance();

  // Calculate summaries
  const { income, expense, balance } = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        if (curr.type === 'income') {
          acc.income += curr.amount;
          acc.balance += curr.amount;
        } else {
          acc.expense += curr.amount;
          acc.balance -= curr.amount;
        }
        return acc;
      },
      { income: 0, expense: 0, balance: 0 }
    );
  }, [transactions]);

  // Transform data for the Bar Chart (Trend Analysis)
  // Let's sort by date and group incomes/expenses
  const barChartData = useMemo(() => {
    const grouped = transactions.reduce((acc, curr) => {
      // Just extract the day for a simpler axis, e.g., 'Oct 01'
      const dateKey = new Date(curr.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, income: 0, expense: 0 };
      }
      if (curr.type === 'income') {
        acc[dateKey].income += curr.amount;
      } else {
        acc[dateKey].expense += curr.amount;
      }
      return acc;
    }, {});
    
    // Convert to array and sort by actual date
    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a + ' 2023') - new Date(b + ' 2023'));
    return sortedDates.map(key => grouped[key]);
  }, [transactions]);

  // Transform data for the Pie Chart (Spending Breakdown)
  const pieChartData = useMemo(() => {
    const expensesOnly = transactions.filter(t => t.type === 'expense');
    const grouped = expensesOnly.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    
    return Object.keys(grouped).map(key => ({
      name: key,
      value: grouped[key]
    })).sort((a, b) => b.value - a.value); // Sort largest to smallest
  }, [transactions]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-forwards">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Overview Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here is the summary of your financial activity</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          title="Total Balance" 
          amount={balance} 
          icon={Wallet} 
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <SummaryCard 
          title="Total Incomes" 
          amount={income} 
          icon={TrendingUp} 
          trend="up"
          trendValue="12.5"
          colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
        />
        <SummaryCard 
          title="Total Expenses" 
          amount={expense} 
          icon={TrendingDown} 
          trend="down"
          trendValue="4.2"
          colorClass="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Cash Flow Trend</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="opacity-50 dark:opacity-20" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 13 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 13 }}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(107, 114, 128, 0.05)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ fontWeight: 500 }}
                  labelStyle={{ color: '#6b7280', marginBottom: '8px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Spending by Category</h3>
          
          {pieChartData.length > 0 ? (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="45%"
                    innerRadius={75}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`₹${value}`, 'Amount']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '10px', fontSize: '13px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex flex-col items-center justify-center text-gray-400">
              <PieChart size={48} className="mb-4 opacity-50" />
              <p>No expenses recorded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
