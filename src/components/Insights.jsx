import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Target,
  Award,
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const Insights = () => {
  const { transactions } = useFinance();

  // Compute insights
  const insights = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryExpenses = {};
    let largestExpense = null;

    transactions.forEach(t => {
      const amount = Number(t.amount);
      if (t.type === 'income') {
        totalIncome += amount;
      } else {
        totalExpense += amount;
        categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + amount;
        
        if (!largestExpense || amount > Number(largestExpense.amount)) {
          largestExpense = t;
        }
      }
    });

    const savings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0;
    
    // Find highest spending category
    let highestSpendingCat = { name: 'N/A', amount: 0 };
    Object.entries(categoryExpenses).forEach(([name, amount]) => {
      if (amount > highestSpendingCat.amount) {
        highestSpendingCat = { name, amount };
      }
    });

    // Monthly trend data (simplified for mock data)
    // We group by day for the area chart
    const dailyDataObj = {};
    transactions.forEach(t => {
      const dateStr = t.date.substring(0, 10);
      if (!dailyDataObj[dateStr]) {
        dailyDataObj[dateStr] = { date: dateStr, income: 0, expense: 0, savings: 0 };
      }
      if (t.type === 'income') dailyDataObj[dateStr].income += Number(t.amount);
      else dailyDataObj[dateStr].expense += Number(t.amount);
    });

    const trendData = Object.values(dailyDataObj).sort((a, b) => new Date(a.date) - new Date(b.date));
    let runningSavings = 0;
    trendData.forEach(day => {
      runningSavings += (day.income - day.expense);
      day.savings = runningSavings;
    });

    return {
      totalIncome,
      totalExpense,
      savings,
      savingsRate,
      highestSpendingCat,
      largestExpense,
      trendData
    };
  }, [transactions]);

  // Tooltip custom component for Area chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">{label}</p>
          <p className="font-semibold text-gray-800 dark:text-white text-sm">
            Total Savings: <span className="text-purple-500">₹{payload[0].value.toLocaleString('en-IN')}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Financial Insights</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">AI-driven analysis of your spending habits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Savings Rate Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target className="w-16 h-16 text-blue-500" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Savings Rate</h3>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">
              {insights.savingsRate}%
            </p>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              {insights.savings > 0 ? (
                 <span className="text-green-500 flex items-center"><ArrowUpRight className="w-4 h-4" /> Healthy</span>
              ) : (
                 <span className="text-red-500 flex items-center"><ArrowDownRight className="w-4 h-4" /> Needs attention</span>
              )}
            </p>
          </div>
        </div>

        {/* Highest Spending Category */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertCircle className="w-16 h-16 text-orange-500" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-xl">
              <TrendingDown className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Top Expense</h3>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white truncate">
              {insights.highestSpendingCat.name}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              ₹{insights.highestSpendingCat.amount.toLocaleString('en-IN')} total
            </p>
          </div>
        </div>

        {/* Largest Single Expense */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet className="w-16 h-16 text-purple-500" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
              <Wallet className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Largest Payout</h3>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white truncate">
              {insights.largestExpense ? `₹${Number(insights.largestExpense.amount).toLocaleString('en-IN')}` : '₹0'}
            </p>
            <p className="text-sm text-gray-500 mt-1 truncate">
              {insights.largestExpense ? insights.largestExpense.category : 'N/A'}
            </p>
          </div>
        </div>

        {/* Financial Health Score */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-md text-white relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
            <Award className="w-16 h-16 text-white" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-medium text-indigo-100">Health Score</h3>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">
              {Number(insights.savingsRate) > 20 ? 'Excellent' : Number(insights.savingsRate) > 0 ? 'Good' : 'Poor'}
            </p>
            <p className="text-sm text-indigo-100 mt-1">Based on current savings</p>
          </div>
        </div>
      </div>

      {/* Cumulative Savings Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mt-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Cumulative Savings Growth</h3>
        <div className="h-[300px] w-full">
          {insights.trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={insights.trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickFormatter={(value) => `₹${value}`}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSavings)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No data available to show trends.
            </div>
          )}
        </div>
      </div>
      
      {/* AI Recommendations */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mt-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-5">Smart Recommendations</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 flex gap-4 transition-all duration-300 hover:shadow-md">
            <div className="mt-1">
              <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white text-sm">Optimize {insights.highestSpendingCat.name} Expenses</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                Your spending on {insights.highestSpendingCat.name} makes up a significant portion of your expenses. 
                Consider setting a strict budget to boost your savings rate by 5-10%.
              </p>
            </div>
          </div>
          
          {Number(insights.savingsRate) < 20 && (
            <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 flex gap-4 transition-all duration-300 hover:shadow-md">
              <div className="mt-1">
                 <div className="p-2 bg-orange-100 dark:bg-orange-800/50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                 </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white text-sm">Action Required: Low Savings Rate</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  Your current savings rate is {insights.savingsRate}%. Financial experts recommend a 20% savings rate for long-term stability. Try reducing discretionary spending.
                </p>
              </div>
            </div>
          )}

          {Number(insights.savingsRate) >= 20 && (
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 flex gap-4 transition-all duration-300 hover:shadow-md">
               <div className="mt-1">
                 <div className="p-2 bg-green-100 dark:bg-green-800/50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                 </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white text-sm">Great Job on Savings!</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  Your savings rate is strong at {insights.savingsRate}%. Consider automating investments or increasing your emergency fund.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Insights;
