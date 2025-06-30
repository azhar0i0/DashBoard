
import React, { useState } from 'react';
import { useFinancial } from '@/context/FinancialContext';
import SortingControls from '@/components/common/SortingControls';
import { DollarSign, Receipt, CreditCard, FileText, TrendingUp, Users, FolderOpen, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import { formatCurrency } from '@/utils/currency';

const Summary: React.FC = () => {
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

  // Monthly summary data including projects
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();

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
        expenses: monthExpenses,
        profit: (monthRevenue + monthProjectRevenue) - monthExpenses 
      };
    }
    return { name, revenue: 0, expenses: 0, profit: 0 };
  });

  const summaryCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue + collectedProjectValue, settings.currency),
      change: '+12.5%',
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600',
      textColor: 'text-emerald-100'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses, settings.currency),
      change: '+8.2%',
      icon: Receipt,
      color: 'from-red-500 to-red-600',
      textColor: 'text-red-100'
    },
    {
      title: 'Net Profit',
      value: formatCurrency(netProfit, settings.currency),
      change: '+15.3%',
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-100'
    },
    {
      title: 'Active Projects',
      value: activeProjects.toString(),
      change: '+2',
      icon: FolderOpen,
      color: 'from-orange-500 to-orange-600',
      textColor: 'text-orange-100'
    },
    {
      title: 'Project Revenue',
      value: formatCurrency(collectedProjectValue, settings.currency),
      change: '+25.8%',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-100'
    },
    {
      title: 'Active Employees',
      value: activeEmployees.toString(),
      change: '0%',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Financial Summary</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Complete overview of your business finances including projects</p>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className={`bg-gradient-to-br ${card.color} p-6 rounded-xl text-white shadow-lg`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`${card.textColor} text-sm font-medium`}>{card.title}</h3>
                  <p className="text-2xl font-bold mt-2">{card.value}</p>
                  <p className="text-sm mt-1 opacity-90">{card.change} from last month</p>
                </div>
                <Icon className="h-8 w-8 opacity-80" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue vs Expenses */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Monthly Comparison (incl. Projects)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgb(31 41 55)', 
                    border: '1px solid rgb(75 85 99)',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value, name) => [formatCurrency(Number(value), settings.currency), name === 'revenue' ? 'Revenue' : 'Expenses']}
                />
                <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit Trend */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Profit Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgb(31 41 55)', 
                    border: '1px solid rgb(75 85 99)',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value, name) => [formatCurrency(Number(value), settings.currency), 'Profit']}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Revenue including Projects */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Revenue</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                ...revenue.slice(-3).map((item, index) => ({
                  type: 'revenue',
                  description: item.description || item.category,
                  date: item.date,
                  amount: item.amount,
                  key: `revenue-${index}`
                })),
                ...projects.filter(p => p.paymentStatus === 'collected').slice(-2).map((item, index) => ({
                  type: 'project',
                  description: `Project Payment: ${item.name}`,
                  date: item.endDate,
                  amount: item.price,
                  key: `project-${index}`
                }))
              ].slice(-5).map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{item.description}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.type === 'project' ? 'Project' : 'Revenue'} • {item.date}
                    </p>
                  </div>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(item.amount, settings.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Expenses</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {expenses.slice(-5).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{item.description}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.date}</p>
                  </div>
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    -{formatCurrency(item.amount, settings.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
