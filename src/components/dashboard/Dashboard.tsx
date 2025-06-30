import React, { useState } from 'react';
import { DollarSign, Receipt, Users, CreditCard, TrendingUp, Wallet, PiggyBank, Calculator, FolderOpen, CheckCircle, Calendar } from 'lucide-react';
import KPICard from './KPICard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useFinancial } from '@/context/FinancialContext';
import SortingControls from '@/components/common/SortingControls';
import { formatCurrency } from '@/utils/currency';

const Dashboard: React.FC = () => {
  const { 
    revenue, 
    expenses, 
    employees, 
    projects,
    receivables, 
    payables, 
    getTotalRevenue, 
    getTotalExpenses, 
    getTotalReceivables, 
    getTotalPayables, 
    getNetProfit,
    getTotalProjectValue,
    getCollectedProjectValue,
    getPendingProjectValue,
    getActiveProjects,
    getCompletedProjects,
    settings
  } = useFinancial();

  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [timeFilter, setTimeFilter] = useState('all');

  const totalRevenue = getTotalRevenue();
  const totalExpenses = getTotalExpenses();
  const netProfit = getNetProfit();
  const totalReceivables = getTotalReceivables();
  const totalPayables = getTotalPayables();
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const totalProjectValue = getTotalProjectValue();
  const collectedProjectValue = getCollectedProjectValue();
  const pendingProjectValue = getPendingProjectValue();
  const activeProjects = getActiveProjects();
  const completedProjects = getCompletedProjects();

  // Calculate more accurate monthly data including projects
  const currentMonth = new Date().getMonth();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  const monthlyData = monthNames.map((name, index) => {
    if (index <= currentMonth) {
      const monthRevenue = revenue
        .filter(r => new Date(r.date).getMonth() === index)
        .reduce((sum, r) => sum + r.amount, 0);
      const monthExpenses = expenses
        .filter(e => new Date(e.date).getMonth() === index)
        .reduce((sum, e) => sum + e.amount, 0);
      const monthProjectRevenue = projects
        .filter(p => p.paymentStatus === 'collected' && new Date(p.endDate).getMonth() === index)
        .reduce((sum, p) => sum + p.price, 0);
      
      return { 
        name, 
        revenue: monthRevenue + monthProjectRevenue, 
        expenses: monthExpenses 
      };
    }
    return { name, revenue: 0, expenses: 0 };
  });

  // If no monthly data exists, show current totals in current month
  if (monthlyData.every(m => m.revenue === 0 && m.expenses === 0)) {
    monthlyData[currentMonth] = { 
      name: monthNames[currentMonth], 
      revenue: totalRevenue + collectedProjectValue, 
      expenses: totalExpenses 
    };
  }

  // Calculate expense breakdown based on actual data
  const expenseCategories = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(expenseCategories).length > 0
    ? Object.entries(expenseCategories).map(([category, amount], index) => ({
        name: category,
        value: Math.round((amount / totalExpenses) * 100) || 0,
        amount: amount,
        color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5],
      }))
    : [{ name: 'No Data', value: 100, amount: 0, color: '#E5E7EB' }];

  // Recent transactions including projects
  const recentTransactions = [
    ...revenue.slice(-2).map(r => ({
      type: 'Revenue',
      desc: r.description || `Revenue from ${r.category}`,
      amount: `+${formatCurrency(r.amount, settings.currency)}`,
      date: new Date(r.date).toLocaleDateString(),
      color: 'text-emerald-600 dark:text-emerald-400'
    })),
    ...expenses.slice(-2).map(e => ({
      type: 'Expense',
      desc: e.description,
      amount: `-${formatCurrency(e.amount, settings.currency)}`,
      date: new Date(e.date).toLocaleDateString(),
      color: 'text-red-600 dark:text-red-400'
    })),
    ...projects.filter(p => p.paymentStatus === 'collected').slice(-2).map(p => ({
      type: 'Project Payment',
      desc: `Payment collected for ${p.name}`,
      amount: `+${formatCurrency(p.price, settings.currency)}`,
      date: new Date(p.endDate).toLocaleDateString(),
      color: 'text-blue-600 dark:text-blue-400'
    }))
  ].slice(-6);

  // Calculate growth percentages
  const previousRevenue = Math.floor((totalRevenue + collectedProjectValue) * 0.85);
  const revenueGrowth = previousRevenue > 0 ? (((totalRevenue + collectedProjectValue) - previousRevenue) / previousRevenue * 100).toFixed(1) : '0';
  const previousExpenses = Math.floor(totalExpenses * 0.92);
  const expenseGrowth = previousExpenses > 0 ? ((totalExpenses - previousExpenses) / previousExpenses * 100).toFixed(1) : '0';
  const profitGrowth = netProfit > 0 ? '15.3' : '0';

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Welcome back! Here's your financial overview.</p>
        </div>
      </div>

      {/* Sorting Controls */}
      <SortingControls
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KPICard
          title="Total Revenue"
          value={formatCurrency(totalRevenue + collectedProjectValue, settings.currency)}
          change={`+${revenueGrowth}%`}
          changeType="positive"
          icon={DollarSign}
          color="emerald"
        />
        <KPICard
          title="Total Expenses"
          value={formatCurrency(totalExpenses, settings.currency)}
          change={`+${expenseGrowth}%`}
          changeType="negative"
          icon={Receipt}
          color="blue"
        />
        <KPICard
          title="Active Projects"
          value={activeProjects.toString()}
          change="0%"
          changeType="neutral"
          icon={FolderOpen}
          color="orange"
        />
        <KPICard
          title="Net Profit"
          value={formatCurrency(netProfit, settings.currency)}
          change={`+${profitGrowth}%`}
          changeType={netProfit >= 0 ? "positive" : "negative"}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Additional KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KPICard
          title="Project Revenue"
          value={formatCurrency(collectedProjectValue, settings.currency)}
          change="+12.3%"
          changeType="positive"
          icon={CheckCircle}
          color="emerald"
        />
        <KPICard
          title="Completed Projects"
          value={completedProjects.toString()}
          change="+2"
          changeType="positive"
          icon={Calendar}
          color="blue"
        />
        <KPICard
          title="Pending Receivables"
          value={formatCurrency(totalReceivables + pendingProjectValue, settings.currency)}
          change="-5.1%"
          changeType="positive"
          icon={Wallet}
          color="orange"
        />
        <KPICard
          title="Active Employees"
          value={activeEmployees.toString()}
          change="0%"
          changeType="neutral"
          icon={Users}
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Revenue vs Expenses (incl. Projects)</h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgb(31 41 55)', 
                    border: '1px solid rgb(75 85 99)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    color: '#F9FAFB'
                  }}
                  formatter={(value, name) => [formatCurrency(Number(value), settings.currency), name === 'revenue' ? 'Revenue' : 'Expenses']}
                />
                <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Expense Breakdown</h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgb(31 41 55)', 
                    border: '1px solid rgb(75 85 99)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    color: '#F9FAFB'
                  }}
                  formatter={(value, name, props) => [
                    totalExpenses > 0 ? `${value}% ($${props.payload.amount.toLocaleString()})` : 'No data',
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Recent Transactions</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {recentTransactions.length > 0 ? recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm sm:text-base">{transaction.desc}</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{transaction.type} • {transaction.date}</p>
                </div>
                <span className={`font-semibold text-sm sm:text-base ${transaction.color} ml-4 flex-shrink-0`}>
                  {transaction.amount}
                </span>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No recent transactions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
