import { Plus, Search, Filter, Download, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/currency';
import CategorySelector from '@/components/common/CategorySelector';
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

//backend
import axiosInstance from '@/lib/axiosInstance';
import { useEffect, useState, createContext, useContext } from 'react';


const categoryColors = {
  'Utilities': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  'Marketing': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'Software': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Office': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'Equipment': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const Expenses: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: '',
    date: '',
    status: 'pending' as 'pending' | 'paid'
  });
  // backend ----------------------------------------------
  const [expenses, setExpenses] = useState([]);
  const [settings, setSettings] = useState({ currency: 'USD' });

  useEffect(() => {
    axiosInstance.get('/expenses')
      .then((res) => setExpenses(res.data))
      .catch((err) => console.error('Failed to load expenses:', err));

    axiosInstance.get('/settings')
      .then((res) => {
        if (res.data && res.data.currency) {
          setSettings(res.data);
        } else {
          setSettings({ currency: 'USD' });
        }
      })
      .catch(() => setSettings({ currency: 'USD' }));

  }, []);
  //----------------------------------------------------------

  const defaultCategories = ['Utilities', 'Marketing', 'Software', 'Office', 'Equipment'];

  const totalExpenses = expenses.reduce((sum, entry) => sum + entry.amount, 0);
  const pendingExpenses = expenses.filter(entry => entry.status === 'pending').reduce((sum, entry) => sum + entry.amount, 0);

  const filteredExpenses = expenses.filter(entry => {
    const matchesSearch =
      (entry.description || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
    const matchesTab = activeTab === 'all' || entry.category === activeTab;
    return matchesSearch && matchesCategory && matchesTab;
  });

  const expensesByCategory = {
    'Utilities': expenses.filter(e => e.category === 'Utilities').reduce((sum, e) => sum + e.amount, 0),
    'Marketing': expenses.filter(e => e.category === 'Marketing').reduce((sum, e) => sum + e.amount, 0),
    'Software': expenses.filter(e => e.category === 'Software').reduce((sum, e) => sum + e.amount, 0),
    'Office': expenses.filter(e => e.category === 'Office').reduce((sum, e) => sum + e.amount, 0),
  };

  const tabs = [
    { id: 'all', label: 'All Expenses', count: expenses.length },
    { id: 'Utilities', label: 'Utilities', count: expenses.filter(e => e.category === 'Utilities').length },
    { id: 'Marketing', label: 'Marketing', count: expenses.filter(e => e.category === 'Marketing').length },
    { id: 'Software', label: 'Software', count: expenses.filter(e => e.category === 'Software').length },
    { id: 'Office', label: 'Office', count: expenses.filter(e => e.category === 'Office').length },
  ];

  const handleAddCustomCategory = (category: string) => {
    setCustomCategories(prev => [...prev, category]);
  };

  const handleRemoveCustomCategory = (category: string) => {
    setCustomCategories(prev => prev.filter(c => c !== category));
  };

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.category || !newExpense.date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    addExpense({
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: newExpense.date,
      status: newExpense.status,
    });

    toast({
      title: "Success",
      description: "Expense entry added successfully",
    });

    setShowAddModal(false);
    setNewExpense({ description: '', amount: '', category: '', date: '', status: 'pending' });
  };

  const handleEditExpense = () => {
  if (!editingExpense._id) { // Changed from editingExpense.id
    toast({
      title: "Error",
      description: "Invalid expense ID",
      variant: "destructive",
    });
    return;
  }

  updateExpense(editingExpense._id, { // Changed from editingExpense.id
    description: editingExpense.description,
    amount: parseFloat(editingExpense.amount),
    category: editingExpense.category,
    date: editingExpense.date,
    status: editingExpense.status,
  });
};

  const handleDelete = (id: string | number | undefined) => {
    if (!id) {
      console.error("Tried to delete with invalid ID:", id);
      return;
    }

    deleteExpense(id);
    toast({
      title: "Success",
      description: "Expense entry deleted successfully",
    });
  };

  //backend----------------------------------------
  const addExpense = async (expense) => {
    const res = await axiosInstance.post('/expenses', expense);
    setExpenses((prev) => [...prev, res.data]);
  };

  const updateExpense = async (id: string, updatedExpense: any) => {
  try {
    // Debug: log what we're sending
    console.log('Updating expense:', { id, updatedExpense });
    
    const res = await axiosInstance.put(`/expenses/${id}`, updatedExpense);
    
    // Debug: log the response
    console.log('Update response:', res.data);
    
    setExpenses(prev => prev.map(e => e._id === id ? res.data : e));
    return res.data;
  } catch (error) {
    console.error('Update error:', {
      error: error.response?.data || error.message,
      status: error.response?.status,
      request: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      }
    });
    throw error;
  }
};

  const deleteExpense = async (id) => {
    await axiosInstance.delete(`/expenses/${id}`);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Expense Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track and categorize all business expenses</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl text-white shadow-lg">
          <h3 className="text-red-100 text-sm font-medium">Total Expenses</h3>
          <p className="text-3xl font-bold mt-2">{formatCurrency(totalExpenses, settings.currency)}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
          <h3 className="text-blue-100 text-sm font-medium">Utilities</h3>
          <p className="text-3xl font-bold mt-2">{formatCurrency(expensesByCategory.Utilities, settings.currency)}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl text-white shadow-lg">
          <h3 className="text-emerald-100 text-sm font-medium">Marketing</h3>
          <p className="text-3xl font-bold mt-2">{formatCurrency(expensesByCategory.Marketing, settings.currency)}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
          <h3 className="text-orange-100 text-sm font-medium">Software</h3>
          <p className="text-3xl font-bold mt-2">{formatCurrency(expensesByCategory.Software, settings.currency)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Filters and Search */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Categories</option>
              <option value="Utilities">Utilities</option>
              <option value="Marketing">Marketing</option>
              <option value="Software">Software</option>
              <option value="Office">Office</option>
              <option value="Equipment">Equipment</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100">
              <Filter className="h-5 w-5" />
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100">
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Expense Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Description</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredExpenses.map((entry, index) => {

                const expenseId = entry._id ?? index;

                return (
                  <tr key={entry._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{entry.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{entry.description}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[entry.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                        {entry.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-red-600 dark:text-red-400">
                      -{formatCurrency(entry.amount, settings.currency)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${entry.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                        }`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingExpense(entry)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center space-x-1"
                        >
                          <Edit2 className="h-4 w-4" />
                          <span>Edit</span>
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium flex items-center space-x-1">
                              <Trash2 className="h-4 w-4" />
                              <span>Delete</span>
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the expense entry.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(expenseId)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>)
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Add New Expense</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <CategorySelector
                value={newExpense.category}
                onChange={(value) => setNewExpense({ ...newExpense, category: value })}
                defaultCategories={defaultCategories}
                customCategories={customCategories}
                onAddCustomCategory={handleAddCustomCategory}
                onRemoveCustomCategory={handleRemoveCustomCategory}
                placeholder="Select expense category"
              />
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <select
                value={newExpense.status}
                onChange={(e) => setNewExpense({ ...newExpense, status: e.target.value as 'paid' | 'pending' })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
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
                onClick={handleAddExpense}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Expense Modal */}
      {editingExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Edit Expense</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Description"
                value={editingExpense.description}
                onChange={(e) => setEditingExpense({ ...editingExpense, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <input
                type="number"
                placeholder="Amount"
                value={editingExpense.amount}
                onChange={(e) => setEditingExpense({ ...editingExpense, amount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <CategorySelector
                value={editingExpense.category}
                onChange={(value) => setEditingExpense({ ...editingExpense, category: value })}
                defaultCategories={defaultCategories}
                customCategories={customCategories}
                onAddCustomCategory={handleAddCustomCategory}
                onRemoveCustomCategory={handleRemoveCustomCategory}
                placeholder="Select expense category"
              />
              <input
                type="date"
                value={editingExpense.date}
                onChange={(e) => setEditingExpense({ ...editingExpense, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <select
                value={editingExpense.status}
                onChange={(e) => setEditingExpense({ ...editingExpense, status: e.target.value as 'paid' | 'pending' })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingExpense(null)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditExpense}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all"
              >
                Update Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
