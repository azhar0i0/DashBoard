
import React, { useState } from 'react';
import { Plus, Search, Filter, Download, AlertCircle, Calendar, Edit2, Trash2 } from 'lucide-react';
import { useFinancial } from '@/context/FinancialContext';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/currency';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Payables: React.FC = () => {
  const { payables, addPayable, updatePayable, deletePayable, settings } = useFinancial();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPayable, setEditingPayable] = useState<any>(null);
  const [newPayable, setNewPayable] = useState({
    vendor: '',
    description: '',
    amount: '',
    dueDate: '',
    status: 'pending' as 'pending' | 'paid' | 'overdue'
  });

  const totalPayables = payables.reduce((sum, item) => sum + item.amount, 0);
  const pendingPayables = payables.filter(item => item.status === 'pending').reduce((sum, item) => sum + item.amount, 0);
  const overduePayables = payables.filter(item => item.status === 'overdue').reduce((sum, item) => sum + item.amount, 0);

  const filteredPayables = payables.filter(item => {
    const matchesSearch = item.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddPayable = () => {
    if (!newPayable.vendor || !newPayable.description || !newPayable.amount || !newPayable.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    addPayable({
      date: new Date().toISOString().split('T')[0],
      vendor: newPayable.vendor,
      description: newPayable.description,
      amount: parseFloat(newPayable.amount),
      dueDate: newPayable.dueDate,
      status: newPayable.status,
    });

    toast({
      title: "Success",
      description: "Payable entry added successfully",
    });

    setShowAddModal(false);
    setNewPayable({ vendor: '', description: '', amount: '', dueDate: '', status: 'pending' });
  };

  const handleEditPayable = () => {
    console.error("❌ Cannot update payable: ID is missing");
    if (!editingPayable.vendor || !editingPayable.description || !editingPayable.amount || !editingPayable.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    updatePayable(editingPayable.id, {
      vendor: editingPayable.vendor,
      description: editingPayable.description,
      amount: parseFloat(editingPayable.amount),
      dueDate: editingPayable.dueDate,
      status: editingPayable.status,
    });

    toast({
      title: "Success",
      description: "Payable entry updated successfully",
    });

    setEditingPayable(null);
  };

  const handleDelete = (id: number) => {
    deletePayable(id);
    toast({
      title: "Success",
      description: "Payable entry deleted successfully",
    });
  };

  const handleMarkPaid = (id: string) => {
  if (!id) {
    toast({ title: "Error", description: "Payable ID is missing", variant: "destructive" });
    return;
  }

  const payable = payables.find(p => p.id === id);
  if (!payable) {
    toast({ title: "Error", description: "Payable not found", variant: "destructive" });
    return;
  }

  updatePayable(id, {
    vendor: payable.vendor,
    description: payable.description,
    amount: payable.amount,
    dueDate: payable.dueDate,
    status: 'paid',
  });

  toast({
    title: "Success",
    description: "Marked as paid",
  });
};


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Payables Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track outstanding payments and bills</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add Payable</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
          <h3 className="text-blue-100 text-sm font-medium">Total Payables</h3>
          <p className="text-3xl font-bold mt-2">{formatCurrency(totalPayables, settings.currency)}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
          <h3 className="text-orange-100 text-sm font-medium">Pending Amount</h3>
          <p className="text-3xl font-bold mt-2">{formatCurrency(pendingPayables, settings.currency)}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl text-white shadow-lg">
          <h3 className="text-red-100 text-sm font-medium">Overdue Amount</h3>
          <p className="text-3xl font-bold mt-2">{formatCurrency(overduePayables, settings.currency)}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search payables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Payables Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Vendor</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Description</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Due Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPayables.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{item.date}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">{item.vendor}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{item.description}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-red-600 dark:text-red-400">
                    {formatCurrency(item.amount, settings.currency)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      {item.dueDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300'
                        : item.status === 'pending'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                      }`}>
                      {item.status === 'overdue' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          console.log("Selected item:", item);
                          setEditingPayable(item);
                        }}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center space-x-1"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      {item.status !== 'paid' && (
                        <button
                          onClick={() => handleMarkPaid(item._id)}
                          className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 text-sm font-medium"
                        >
                          Mark Paid
                        </button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium flex items-center space-x-1">
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the payable entry.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(item._id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payable Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Payable</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Vendor Name"
                value={newPayable.vendor}
                onChange={(e) => setNewPayable({ ...newPayable, vendor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Description"
                value={newPayable.description}
                onChange={(e) => setNewPayable({ ...newPayable, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newPayable.amount}
                onChange={(e) => setNewPayable({ ...newPayable, amount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="date"
                placeholder="Due Date"
                value={newPayable.dueDate}
                onChange={(e) => setNewPayable({ ...newPayable, dueDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={newPayable.status}
                onChange={(e) => setNewPayable({ ...newPayable, status: e.target.value as 'pending' | 'paid' | 'overdue' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPayable}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all"
              >
                Add Payable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Payable Modal */}
      {editingPayable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Payable</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Vendor Name"
                value={editingPayable.vendor}
                onChange={(e) => setEditingPayable({ ...editingPayable, vendor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Description"
                value={editingPayable.description}
                onChange={(e) => setEditingPayable({ ...editingPayable, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Amount"
                value={editingPayable.amount}
                onChange={(e) => setEditingPayable({ ...editingPayable, amount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="date"
                placeholder="Due Date"
                value={editingPayable.dueDate}
                onChange={(e) => setEditingPayable({ ...editingPayable, dueDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={editingPayable.status}
                onChange={(e) => setEditingPayable({ ...editingPayable, status: e.target.value as 'pending' | 'paid' | 'overdue' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingPayable(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditPayable}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all"
              >
                Update Payable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payables;
