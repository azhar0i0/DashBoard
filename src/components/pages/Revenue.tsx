
import React, { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { useFinancial } from '@/context/FinancialContext';
import SortingControls from '@/components/common/SortingControls';
import CategorySelector from '@/components/common/CategorySelector';
import { formatCurrency } from '@/utils/currency';

const Revenue: React.FC = () => {
  const { 
    revenue, 
    addRevenue, 
    updateRevenue, 
    deleteRevenue,
    customCategories,
    addCustomCategory,
    removeCustomCategory,
    settings
  } = useFinancial();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [timeFilter, setTimeFilter] = useState('all');

  const [newRevenue, setNewRevenue] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    category: '',
    status: 'received' as 'received' | 'pending',
  });

  const defaultCategories = ['Sales', 'Services', 'Consulting', 'Products', 'Subscriptions', 'Other'];

  const filteredAndSortedRevenue = useMemo(() => {
  let filtered = revenue.filter(item => {
    const description = item.description || '';
    const category = item.category || '';

    const matchesSearch =
      description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || category === selectedCategory;

    // Time filtering
    const itemDate = new Date(item.date);
    const now = new Date();
    let matchesTime = true;

    switch (timeFilter) {
      case 'week': {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesTime = itemDate >= weekAgo;
        break;
      }
      case 'month':
        matchesTime =
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear();
        break;
      case 'quarter': {
        const quarter = Math.floor(now.getMonth() / 3);
        const itemQuarter = Math.floor(itemDate.getMonth() / 3);
        matchesTime =
          itemQuarter === quarter &&
          itemDate.getFullYear() === now.getFullYear();
        break;
      }
      case 'year':
        matchesTime = itemDate.getFullYear() === now.getFullYear();
        break;
    }

    return matchesSearch && matchesCategory && matchesTime;
  });

  // Sorting
  filtered.sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'amount':
        comparison = Number(a.amount) - Number(b.amount); // Safe conversion
        break;
      case 'category':
        comparison = (a.category || '').localeCompare(b.category || '');
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return filtered;
}, [revenue, searchTerm, selectedCategory, timeFilter, sortBy, sortOrder]);

  const totalRevenue = filteredAndSortedRevenue.reduce((sum, item) => sum + item.amount, 0);

  const handleAddRevenue = () => {
    if (newRevenue.description && newRevenue.amount && newRevenue.category) {
      addRevenue({
        date: newRevenue.date,
        description: newRevenue.description,
        amount: Number(newRevenue.amount),
        category: newRevenue.category,
        status: newRevenue.status,
      });
      setShowAddModal(false);
      setNewRevenue({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: '',
        category: '',
        status: 'received',
      });
    }
  };

  const handleStatusChange = (id: number, newStatus: 'received' | 'pending') => {
    updateRevenue(id, { status: newStatus });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this revenue?')) {
      deleteRevenue(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Revenue Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage your income streams</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add Revenue</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl text-white shadow-lg">
        <h3 className="text-emerald-100 text-sm font-medium">Total Revenue</h3>
        <p className="text-3xl font-bold mt-2">{formatCurrency(totalRevenue, settings.currency)}</p>
        <p className="text-emerald-100 text-sm mt-1">
          {filteredAndSortedRevenue.length} transaction(s) • {timeFilter === 'all' ? 'All time' : timeFilter}
        </p>
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

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search revenue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="all">All Categories</option>
            {defaultCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
            {customCategories.revenue.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Revenue Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Description</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAndSortedRevenue.length > 0 ? (
                filteredAndSortedRevenue.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{item.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{item.description}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(item.amount, settings?.currency || 'USD')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{item.category}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'received' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300' 
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleStatusChange(item._id, 'received')}
                          className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 text-sm font-medium"
                          disabled={item.status === 'received'}
                        >
                          Mark Received
                        </button>
                        <button 
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No revenue found. Add your first revenue to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Revenue Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Add New Revenue</h2>
            <div className="space-y-4">
              <input
                type="date"
                value={newRevenue.date}
                onChange={(e) => setNewRevenue({...newRevenue, date: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
              <input
                type="text"
                placeholder="Description"
                value={newRevenue.description}
                onChange={(e) => setNewRevenue({...newRevenue, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newRevenue.amount}
                onChange={(e) => setNewRevenue({...newRevenue, amount: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
              
              <CategorySelector
                value={newRevenue.category}
                onChange={(value) => setNewRevenue({...newRevenue, category: value})}
                defaultCategories={defaultCategories}
                placeholder="Select or add category"
                customCategories={customCategories.revenue}
                onAddCustomCategory={(category) => addCustomCategory('revenue', category)}
                onRemoveCustomCategory={(category) => removeCustomCategory('revenue', category)}
              />

              <select
                value={newRevenue.status}
                onChange={(e) => setNewRevenue({...newRevenue, status: e.target.value as 'received' | 'pending'})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="received">Received</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRevenue}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all"
              >
                Add Revenue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Revenue;
