import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export interface RevenueEntry {
  date: string;
  category: string;
  description?: string;
  amount: number;
  status: 'pending' | 'received';
}


export interface ExpenseEntry {
  id: number;
  date: string;
  category: string;
  description: string;
  amount: number;
  status: 'pending' | 'paid';
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  salary: number;
  status: 'active' | 'inactive';
  startDate: string;
}

export interface Project {
  _id: number;
  name: string;
  description: string;
  price: number;
  timePeriod: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  startDate: string;
  endDate: string;
  paymentStatus: 'pending' | 'collected';
}

export interface Receivable {
  id: number;
  date: string;
  client: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'received' | 'overdue';
}

export interface PayableEntry {
  id: number;
  date: string;
  vendor: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
}

interface FinancialContextType {
  revenue: RevenueEntry[];
  expenses: ExpenseEntry[];
  employees: Employee[];
  projects: Project[];
  receivables: Receivable[];
  payables: PayableEntry[];

  addRevenue: (entry: Omit<RevenueEntry, '_id'>) => void;
  updateRevenue: (id: number, entry: Partial<RevenueEntry>) => void;
  deleteRevenue: (id: number) => void;

  addExpense: (entry: Omit<ExpenseEntry, 'id'>) => void;
  updateExpense: (id: number, entry: Partial<ExpenseEntry>) => void;
  deleteExpense: (id: number) => void;

  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: number, employee: Partial<Employee>) => void;
  deleteEmployee: (id: number) => void;

  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: number, project: Partial<Project>) => void;
  deleteProject: (id: number) => void;

  addReceivable: (entry: Omit<Receivable, 'id'>) => void;
  updateReceivable: (id: number, entry: Partial<Receivable>) => void;
  deleteReceivable: (id: number) => void;

  addPayable: (entry: Omit<PayableEntry, 'id'>) => void;
  updatePayable: (id: number, entry: Partial<PayableEntry>) => void;
  deletePayable: (id: number) => void;

  getTotalRevenue: () => number;
  getTotalExpenses: () => number;
  getTotalReceivables: () => number;
  getTotalPayables: () => number;
  getTotalEmployeeSalaries: () => number;
  getTotalProjectValue: () => number;
  getCollectedProjectValue: () => number;
  getPendingProjectValue: () => number;
  getActiveProjects: () => number;
  getCompletedProjects: () => number;
  getNetProfit: () => number;
  getCashFlow: () => number;

  customCategories: {
    revenue: string[];
    expense: string[];
    department: string[];
  };
  addCustomCategory: (type: 'revenue' | 'expense' | 'department', category: string) => void;
  removeCustomCategory: (type: 'revenue' | 'expense' | 'department', category: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  settings: UserSettings;
}

interface UserSettings {
  companyName: string;
  currency: string;
  userName: string;
}

const FinancialContext = createContext<FinancialContextType | null>(null);

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [revenue, setRevenue] = useState<RevenueEntry[]>([]);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [receivables, setReceivables] = useState<Receivable[]>([]);
  const [payables, setPayables] = useState<PayableEntry[]>([]);
  
  const [settings, setSettings] = useState<UserSettings>({
    companyName: 'Zyberstar',
    currency: 'USD',
    userName: 'Admin User'
  });

  const [customCategories, setCustomCategories] = useState({
    revenue: [] as string[],
    expense: [] as string[],
    department: [] as string[]
  });

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await axiosInstance.get('/revenue');
        setRevenue(response.data);
      } catch (error) {
        console.error("Error loading revenue:", error);
      }
    };

    fetchRevenue();
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axiosInstance.get('/employees');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error loading employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
  try {
    const res = await axiosInstance.get('/settings');
    setSettings(res.data);
    console.log('📥 Settings loaded:', res.data);
  } catch (error) {
    console.error('❌ Error loading settings:', error);
  }
};

    loadSettings();
  }, []);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const res = await axiosInstance.get('/projects'); // ✅ Uses axiosInstance
        setProjects(res.data); // ✅ Sets the projects from DB
        console.log("📥 Fetched projects:", res.data);
      } catch (err) {
        console.error("❌ Error fetching projects", err);
      }
    };

    getProjects();
  }, []);

  useEffect(() => {
    // Load receivables
    const loadReceivables = async () => {
      try {
        const res = await axiosInstance.get(`${API}/receivables`);
        setReceivables(res.data);
      } catch (err) {
        console.error('❌ Error loading receivables', err);
      }
    };

    loadReceivables();
  }, []);
  
  useEffect(() => {
    const loadPayables = async () => {
      try {
        const response = await axiosInstance.get('/payables');
        const payablesWithId = response.data.map((p: any) => ({
          ...p,
          id: p._id || p.id, // Ensure `id` is always available
        }));
        setPayables(payablesWithId);
        console.log("📥 Loaded payables:", payablesWithId);
      } catch (error) {
        console.error('❌ Error loading payables', error);
      }
    };

    loadPayables();
  }, []);



  // Revenue functions
  const addRevenue = async (entry: Omit<RevenueEntry, 'id'>) => {
    try {
      const response = await axiosInstance.post('/revenue', entry);
      const newEntry: RevenueEntry = response.data;
      setRevenue(prev => [...prev, newEntry]);
    } catch (error) {
      console.error('Error adding revenue:', error);
    }
  };

  const updateRevenue = async (id: number, updatedEntry: Partial<RevenueEntry>) => {
    try {
      await axiosInstance.put(`/api/revenue/${id}`, updatedEntry);
      setRevenue(prev => prev.map(item => item._id === id ? { ...item, ...updatedEntry } : item));
    } catch (error) {
      console.error('Error updating revenue:', error);
    }
  };

  const deleteRevenue = async (id: number) => {
    try {
      await axiosInstance.delete(`/revenue/${id}`);
      setRevenue(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting revenue:', error);
    }
  };

  // Expense functions
  const addExpense = (entry: Omit<ExpenseEntry, 'id'>) => {
    const newEntry = { ...entry, id: Date.now() + Math.random() };
    setExpenses(prev => [...prev, newEntry]);
  };

  const updateExpense = (id: number, updatedEntry: Partial<ExpenseEntry>) => {
    setExpenses(prev => prev.map(item =>
      item.id === id ? { ...item, ...updatedEntry } : item
    ));
  };

  const deleteExpense = (id: number) => {
    setExpenses(prev => prev.filter(item => item.id !== id));
  };

  // Employee functions
  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };
  const addEmployee = async (employee: Omit<Employee, 'id'>) => {
    try {
      console.log("🚀 Sending to backend:", employee);
      const res = await axiosInstance.post('/employees', employee);
      setEmployees((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error adding employee:", err);
    }
  };
  const updateEmployee = async (id: string, updatedData: any) => {
    try {
      console.log("🔧 Updating employee with ID:", id, updatedData);
      const res = await axiosInstance.put(`http://localhost:5000/api/employees/${id}`, updatedData);
      setEmployees((prev) =>
        prev.map((emp) => (emp._id === id ? res.data : emp))
      );
    } catch (error) {
      console.error("❌ Error updating employee: ", error);
    }
  };
  const deleteEmployee = async (id: string) => {
    try {
      console.log("🧩 Deleting employee with ID:", id);
      await axiosInstance.delete(`http://localhost:5000/api/employees/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch (error) {
      console.error("❌ Error deleting employee: ", error);
    }
  };

  // Project functions
  const API = 'http://localhost:5000/api';
  const fetchProjects = async () => {
    try {
      const res = await axiosInstance.get(`${API}/projects`);
      setProjects(res.data);
    } catch (err) {
      console.error("❌ Error fetching projects", err);
    }
  };
  const addProject = async (projectData: Project) => {
    try {
      console.log("📦 Adding project to backend:", projectData);
      const res = await axiosInstance.post('/projects', projectData); // ✅ CORRECT: no `${API}`
      const newProject = res.data;
      setProjects(prev => [...prev, newProject]);
      console.log("✅ Project added successfully:", newProject);
    } catch (err) {
      console.error("❌ Error adding project", err);
    }
  };
  const updateProject = async (id: string, updatedData: Partial<Project>) => {
    try {
      console.log("🛠 Updating project with ID:", id);
      const res = await axiosInstance.put(`${API}/projects/${id}`, updatedData);
      const updated = res.data;
      setProjects((prev) =>
        prev.map((proj) => (proj._id === updated._id ? updated : proj))
      );
    } catch (err) {
      console.error("❌ Error updating project", err);
    }
  };
  const deleteProject = async (id: string) => {
    try {
      console.log("🗑 Deleting project with ID:", id); // this should NOT log undefined
      await axiosInstance.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((proj) => proj._id !== id));
    } catch (error) {
      console.error("❌ Error deleting project", error);
    }
  };


  // Receivable functions
  // Add receivable
  const addReceivable = async (receivableData: Receivable) => {
    try {
      const res = await axiosInstance.post(`${API}/receivables`, receivableData);
      setReceivables(prev => [...prev, res.data]);
    } catch (err) {
      console.error('❌ Error adding receivable', err);
    }
  };
  // Update receivable
  const updateReceivable = async (id: string, updatedFields: Partial<Receivable>) => {
    try {
      const res = await axiosInstance.put(`${API}/receivables/${id}`, updatedFields);
      setReceivables(prev =>
        prev.map(r => (r._id === id || r.id === id ? res.data : r))
      );
    } catch (err) {
      console.error('❌ Error updating receivable', err);
    }
  };
  // Delete receivable
  const deleteReceivable = async (id: string) => {
    try {
      await axiosInstance.delete(`${API}/receivables/${id}`);
      setReceivables(prev => prev.filter(r => r._id !== id && r.id !== id));
    } catch (err) {
      console.error('❌ Error deleting receivable', err);
    }
  };

  // Payable functions
  const addPayable = async (data) => {
    const res = await axiosInstance.post('payables', data);
    setPayables((prev) => [...prev, res.data]);
  };
  const updatePayable = async (id: string, updatedData) => {
    const res = await axiosInstance.put(`/payables/${id}`, updatedData);
    setPayables((prev) =>
      prev.map((item) => (item._id === id ? res.data : item))
    );
  };
  const deletePayable = async (id) => {
    await axiosInstance.delete(`/payables/${id}`);
    setPayables((prev) => prev.filter((item) => item._id !== id));
  };

  // settings
  const updateSettings = async (newSettings: { companyName: string; userName: string; currency: string }) => {
  try {
    const res = await axiosInstance.post('/settings', newSettings);
    setSettings(res.data);
    console.log('✅ Settings updated:', res.data);
  } catch (error) {
    console.error('❌ Error updating settings:', error);
  }
};

  // Calculation functions
  const getTotalRevenue = () => {
    return revenue.reduce((sum, item) => sum + item.amount, 0);
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  };

  const getTotalReceivables = () => {
    return receivables.reduce((sum, item) => sum + item.amount, 0);
  };

  const getTotalPayables = () => {
    return payables.reduce((sum, item) => sum + item.amount, 0);
  };

  const getTotalEmployeeSalaries = () => {
    return employees.filter(emp => emp.status === 'active').reduce((sum, emp) => sum + emp.salary, 0);
  };

  const getTotalProjectValue = () => {
    return projects.reduce((sum, project) => sum + project.price, 0);
  };

  const getCollectedProjectValue = () => {
    return projects
      .filter(project => project.paymentStatus === 'collected')
      .reduce((sum, project) => sum + project.price, 0);
  };

  const getPendingProjectValue = () => {
    return projects
      .filter(project => project.paymentStatus === 'pending')
      .reduce((sum, project) => sum + project.price, 0);
  };

  const getActiveProjects = () => {
    return projects.filter(project => project.status === 'in-progress').length;
  };

  const getCompletedProjects = () => {
    return projects.filter(project => project.status === 'completed').length;
  };

  const getNetProfit = () => {
    const totalRev = getTotalRevenue();
    const totalExp = getTotalExpenses();
    const totalSalaries = getTotalEmployeeSalaries();
    const collectedProjectValue = getCollectedProjectValue();
    return totalRev + collectedProjectValue - totalExp - totalSalaries;
  };

  const getCashFlow = () => {
    const totalRev = getTotalRevenue();
    const totalExp = getTotalExpenses();
    const totalSalaries = getTotalEmployeeSalaries();
    const netReceivables = getTotalReceivables();
    const netPayables = getTotalPayables();
    const collectedProjectValue = getCollectedProjectValue();

    // Cash flow = Revenue - Expenses - Salaries + Receivables - Payables
    return totalRev + collectedProjectValue - totalExp - totalSalaries + netReceivables - netPayables;
  };

  const addCustomCategory = (type: 'revenue' | 'expense' | 'department', category: string) => {
    setCustomCategories(prev => ({
      ...prev,
      [type]: [...prev[type], category]
    }));
  };

  const removeCustomCategory = (type: 'revenue' | 'expense' | 'department', category: string) => {
    setCustomCategories(prev => ({
      ...prev,
      [type]: prev[type].filter(cat => cat !== category)
    }));
  };



  const value: FinancialContextType = {
    revenue,
    expenses,
    employees,
    projects,
    receivables,
    payables,
    addRevenue,
    updateRevenue,
    deleteRevenue,
    addExpense,
    updateExpense,
    deleteExpense,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addProject,
    updateProject,
    deleteProject,
    addReceivable,
    updateReceivable,
    deleteReceivable,
    addPayable,
    updatePayable,
    deletePayable,
    getTotalRevenue,
    getTotalExpenses,
    getTotalReceivables,
    getTotalPayables,
    getTotalEmployeeSalaries,
    getTotalProjectValue,
    getCollectedProjectValue,
    getPendingProjectValue,
    getActiveProjects,
    getCompletedProjects,
    getNetProfit,
    getCashFlow,
    customCategories,
    addCustomCategory,
    removeCustomCategory,
    settings,
    updateSettings
  };

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};
