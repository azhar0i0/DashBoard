
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, User, Mail, Calendar, DollarSign } from 'lucide-react';
import { useFinancial } from '@/context/FinancialContext';
import { formatCurrency } from '@/utils/currency';

const Employees: React.FC = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee, settings } = useFinancial();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    department: '',
    salary: '',
    status: 'active' as 'active' | 'inactive',
    startDate: '',
  });

  const totalSalaries = employees.filter(emp => emp.status === 'active').reduce((sum, emp) => sum + emp.salary, 0);
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const inactiveEmployees = employees.filter(emp => emp.status === 'inactive').length;

  const filteredEmployees = (employees || []).filter(emp => {
    const matchesSearch = (emp.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (emp.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const Employees = () => {
  
    useEffect(() => {
  console.log("📦 Employees in state:", employees);
}, [employees]);


  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div>
      <h2>Employees</h2>
      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <ul>
          {employees.map((emp) => (
            <li key={emp._id || emp.id}>
              {emp.name} - {emp.position}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.email && newEmployee.department && newEmployee.salary && newEmployee.startDate) {
      addEmployee({
        name: newEmployee.name,
        email: newEmployee.email,
        department: newEmployee.department,
        salary: Number(newEmployee.salary),
        status: newEmployee.status,
        startDate: newEmployee.startDate,
      });
      setShowAddModal(false);
      setNewEmployee({ name: '', email: '', department: '', salary: '', status: 'active', startDate: '' });
    }
  };

  const handleDeleteEmployee = (id: number) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee(id);
    }
  };

const handleStatusToggle = (id: string, currentStatus: string) => {
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
  updateEmployee(id, { status: newStatus });
};


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Employee Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your team and track payroll</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-blue-100 text-sm font-medium">Total Monthly Payroll</h3>
              <p className="text-3xl font-bold mt-2">{formatCurrency(totalSalaries, settings.currency)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-emerald-100 text-sm font-medium">Active Employees</h3>
              <p className="text-3xl font-bold mt-2">{activeEmployees}</p>
            </div>
            <User className="h-8 w-8 text-emerald-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-orange-100 text-sm font-medium">Inactive Employees</h3>
              <p className="text-3xl font-bold mt-2">{inactiveEmployees}</p>
            </div>
            <User className="h-8 w-8 text-orange-200" />
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
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Employee</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Department</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Salary</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Start Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr key={employee._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{employee.name}</p>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Mail className="h-4 w-4 mr-1" />
                            {employee.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{employee.department}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(employee.salary, settings.currency)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                        {employee.startDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        employee.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                      }`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleStatusToggle(employee._id, employee.status)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                        >
                          {employee.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => handleDeleteEmployee(employee._id)}
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
                    No employees found. Add your first employee to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Add New Employee</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <select
                value={newEmployee.department}
                onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
              <input
                type="number"
                placeholder="Monthly Salary"
                value={newEmployee.salary}
                onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <input
                type="date"
                value={newEmployee.startDate}
                onChange={(e) => setNewEmployee({...newEmployee, startDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <select
                value={newEmployee.status}
                onChange={(e) => setNewEmployee({...newEmployee, status: e.target.value as 'active' | 'inactive'})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
                onClick={handleAddEmployee}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all"
              >
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
