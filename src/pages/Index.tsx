
import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import LoginPage from '@/components/auth/LoginPage';
import RegisterPage from '@/components/auth/RegisterPage';
import Sidebar from '@/components/layout/Sidebar';
import Dashboard from '@/components/dashboard/Dashboard';
import Revenue from '@/components/pages/Revenue';
import Expenses from '@/components/pages/Expenses';
import Employees from '@/components/pages/Employees';
import Projects from '@/components/pages/Projects';
import Receivables from '@/components/pages/Receivables';
import Payables from '@/components/pages/Payables';
import Summary from '@/components/pages/Summary';
import Settings from '@/components/pages/Settings';
import { FinancialProvider } from '@/context/FinancialContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from '@/components/ui/sonner';

const Index: React.FC = () => {
  const { user, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (email: string, password: string) => {
    // Demo credentials validation
    if (email === 'admin@company.com' && password === 'company123') {
      const userData = {
        id: '1',
        name: 'Admin User',
        email: email,
        role: 'admin' as const
      };
      login(userData, 'company123');
      return true;
    }
    return false;
  };

  const handleRegister = (userData: any) => {
    // Register the new user
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role as 'admin' | 'accountant' | 'employee'
    };
    login(newUser, userData.password || 'defaultPassword');
  };

  if (!user) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {showRegister ? (
            <RegisterPage 
              onRegister={handleRegister}
              onSwitchToLogin={() => setShowRegister(false)} 
            />
          ) : (
            <LoginPage 
              onLogin={handleLogin}
              onSwitchToRegister={() => setShowRegister(true)} 
            />
          )}
        </div>
      </ThemeProvider>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'revenue':
        return <Revenue />;
      case 'expenses':
        return <Expenses />;
      case 'employees':
        return <Employees />;
      case 'projects':
        return <Projects />;
      case 'receivables':
        return <Receivables />;
      case 'payables':
        return <Payables />;
      case 'summary':
        return <Summary />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <FinancialProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userRole={user.role}
            onLogout={logout}
          />
          
          <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 transition-all duration-300">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
          
          <Toaster />
        </div>
      </FinancialProvider>
    </ThemeProvider>
  );
};

export default Index;
