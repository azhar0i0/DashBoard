
import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, DollarSign, FileText, Clock, CheckCircle } from 'lucide-react';
import { useFinancial } from '@/context/FinancialContext';
import { formatCurrency } from '@/utils/currency';

const Receivables: React.FC = () => {
  const { receivables, addReceivable, updateReceivable, deleteReceivable, settings } = useFinancial();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'received'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReceivable, setNewReceivable] = useState({
    client: '',
    amount: '',
    description: '',
    dueDate: '',
    status: 'pending' as 'pending' | 'received',
  });

  const totalReceivables = receivables.reduce((sum, rec) => sum + rec.amount, 0);
  const pendingReceivables = receivables.filter(rec => rec.status === 'pending').reduce((sum, rec) => sum + rec.amount, 0);
  const receivedAmount = receivables.filter(rec => rec.status === 'received').reduce((sum, rec) => sum + rec.amount, 0);

  const filteredReceivables = receivables.filter(rec => {
    const matchesSearch = rec.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         rec.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddReceivable = () => {
    if (newReceivable.client && newReceivable.amount && newReceivable.description && newReceivable.dueDate) {
      addReceivable({
        date: new Date().toISOString().split('T')[0], // Add current date
        client: newReceivable.client,
        amount: Number(newReceivable.amount),
        description: newReceivable.description,
        dueDate: newReceivable.dueDate,
        status: newReceivable.status,
      });
      setShowAddModal(false);
      setNewReceivable({ client: '', amount: '', description: '', dueDate: '', status: 'pending' });
    }
  };

  const handleDeleteReceivable = (id: number) => {
    if (window.confirm('Are you sure you want to delete this receivable?')) {
      deleteReceivable(id);
    }
  };

  const handleStatusToggle = (id: number, currentStatus: 'pending' | 'received' | 'overdue') => {
    // Only toggle between pending and received, ignore overdue
    if (currentStatus === 'overdue') {
      updateReceivable(id, { status: 'received' });
    } else {
      updateReceivable(id, { status: currentStatus === 'pending' ? 'received' : 'pending' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Receivables</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track incoming payments and invoices</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add Receivable</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-blue-100 text-sm font-medium">Total Receivables</h3>
              <p className="text-3xl font-bold mt-2">{formatCurrency(totalReceivables, settings.currency)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-orange-100 text-sm font-medium">Pending</h3>
              <p className="text-3xl font-bold mt-2">{formatCurrency(pendingReceivables, settings.currency)}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-emerald-100 text-sm font-medium">Received</h3>
              <p className="text-3xl font-bold mt-2">{formatCurrency(receivedAmount, settings.currency)}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-emerald-200" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Search receivables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'received')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="received">Received</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
            <Filter className="h-5 w-5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Receivables Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Client</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Description</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Due Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filteredReceivables.length > 0 ? (
                filteredReceivables.map((receivable) => (
                  <tr key={receivable.id || receivables._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <p className="ml-3 text-sm font-semibold text-gray-900 dark:text-gray-100">{receivable.client}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(receivable.amount, settings.currency)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{receivable.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                        {receivable.dueDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        receivable.status === 'received' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300'
                          : receivable.status === 'overdue'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
                      }`}>
                        {receivable.status === 'received' ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Received
                          </>
                        ) : receivable.status === 'overdue' ? (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            Overdue
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleStatusToggle(receivable._id, receivable.status)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                        >
                          {receivable.status === 'pending' || receivable.status === 'overdue' ? 'Mark as Received' : 'Mark as Pending'}
                        </button>
                        <button 
                          onClick={() => handleDeleteReceivable(receivable._id)}
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
                    No receivables found. Add your first receivable to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Receivable Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Add New Receivable</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Client Name"
                value={newReceivable.client}
                onChange={(e) => setNewReceivable({...newReceivable, client: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newReceivable.amount}
                onChange={(e) => setNewReceivable({...newReceivable, amount: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <textarea
                placeholder="Description"
                value={newReceivable.description}
                onChange={(e) => setNewReceivable({...newReceivable, description: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <input
                type="date"
                value={newReceivable.dueDate}
                onChange={(e) => setNewReceivable({...newReceivable, dueDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <select
                value={newReceivable.status}
                onChange={(e) => setNewReceivable({...newReceivable, status: e.target.value as 'pending' | 'received'})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="pending">Pending</option>
                <option value="received">Received</option>
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
                onClick={handleAddReceivable}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all"
              >
                Add Receivable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Receivables;
